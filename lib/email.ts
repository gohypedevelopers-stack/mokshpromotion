import nodemailer from "nodemailer"

type SendEmailParams = {
    to: string
    subject: string
    html: string
    replyTo?: string
}

type SendEmailResult =
    | { success: true; simulated?: true; retried?: true }
    | { success: false; error: unknown; code?: string; reason?: "AUTH_FAILED" | "SEND_FAILED" }

const toBool = (value?: string) => (value || "").toLowerCase() === "true"

const cleanEnvValue = (value?: string) => {
    const trimmed = (value || "").trim()
    if (!trimmed) return ""

    const startsWithQuote = trimmed.startsWith('"') || trimmed.startsWith("'")
    const endsWithQuote = trimmed.endsWith('"') || trimmed.endsWith("'")
    if (startsWithQuote && endsWithQuote && trimmed.length >= 2) {
        return trimmed.slice(1, -1).trim()
    }

    return trimmed
}

const getFirstEnv = (keys: string[]) => {
    for (const key of keys) {
        const value = cleanEnvValue(process.env[key])
        if (value) return value
    }
    return ""
}

const getSmtpHost = () => getFirstEnv(["SMTP_HOST", "EMAIL_HOST", "MAIL_HOST"]) || "smtp.gmail.com"

const getSmtpPort = () => Number(getFirstEnv(["SMTP_PORT", "EMAIL_PORT", "MAIL_PORT"])) || 587

const getSmtpSecure = (port: number) => {
    const explicit = getFirstEnv(["SMTP_SECURE", "EMAIL_SECURE", "MAIL_SECURE"])
    return explicit ? toBool(explicit) : port === 465
}

const getSmtpUser = () => getFirstEnv(["SMTP_USER", "EMAIL_USER", "MAIL_USER", "GMAIL_USER"])

const getSmtpPass = (host: string) => {
    const raw = getFirstEnv(["SMTP_PASS", "EMAIL_PASS", "MAIL_PASS", "GMAIL_APP_PASSWORD"])
    if (!raw) return ""

    // Gmail app passwords are shown with spaces; normalize automatically.
    if (host.toLowerCase().includes("gmail")) {
        return raw.replace(/\s+/g, "")
    }
    return raw
}

const getTransporter = () => {
    const host = getSmtpHost()
    const port = getSmtpPort()
    const secure = getSmtpSecure(port)
    const user = getSmtpUser()
    const pass = getSmtpPass(host)

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    })
}

const getPrimaryFrom = () => {
    const from = getFirstEnv(["SMTP_FROM", "EMAIL_FROM", "MAIL_FROM"])
    if (from) return from
    const smtpUser = getSmtpUser()
    if (smtpUser) return `"Moksh CRM" <${smtpUser}>`
    return '"Moksh CRM" <no-reply@mokshpromotion.com>'
}

const getFallbackFrom = () => {
    const smtpUser = getSmtpUser()
    if (!smtpUser) return null
    return `"Moksh CRM" <${smtpUser}>`
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
    console.log(`Attempting to send email to ${to}`)

    const host = getSmtpHost()
    const smtpUser = getSmtpUser()
    const smtpPass = getSmtpPass(host)

    if (!smtpUser || !smtpPass) {
        console.warn("SMTP credentials missing. Email not sent (simulated).")
        return { success: true, simulated: true }
    }

    const transporter = getTransporter()
    const primaryFrom = getPrimaryFrom()

    try {
        const info = await transporter.sendMail({
            from: primaryFrom,
            to,
            replyTo,
            subject,
            html,
        })
        console.log("Message sent: %s", info.messageId)
        return { success: true }
    } catch (primaryError) {
        console.error("EMAIL_SEND_ERROR_PRIMARY", primaryError)
        const primaryCode = (primaryError as { code?: string })?.code
        const primaryResponseCode = (primaryError as { responseCode?: number })?.responseCode
        const primaryReason = primaryCode === "EAUTH" || primaryResponseCode === 535 ? "AUTH_FAILED" : "SEND_FAILED"

        const fallbackFrom = getFallbackFrom()
        if (!fallbackFrom || fallbackFrom === primaryFrom) {
            return { success: false, error: primaryError, code: primaryCode, reason: primaryReason } satisfies SendEmailResult
        }

        try {
            console.warn("Retrying email with fallback FROM address.")
            const info = await transporter.sendMail({
                from: fallbackFrom,
                to,
                replyTo,
                subject,
                html,
            })
            console.log("Message sent on retry: %s", info.messageId)
            return { success: true, retried: true }
        } catch (retryError) {
            console.error("EMAIL_SEND_ERROR_RETRY", retryError)
            const retryCode = (retryError as { code?: string })?.code || primaryCode
            const retryResponseCode = (retryError as { responseCode?: number })?.responseCode
            const retryReason = retryCode === "EAUTH" || retryResponseCode === 535 ? "AUTH_FAILED" : "SEND_FAILED"
            return { success: false, error: retryError, code: retryCode, reason: retryReason } satisfies SendEmailResult
        }
    }
}
