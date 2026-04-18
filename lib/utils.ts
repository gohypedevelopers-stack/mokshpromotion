import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Recursively converts Prisma Decimal objects to numbers for serialization
 * to Client Components. Also handles Dates.
 */
export function serializeDecimal<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => serializeDecimal(item)) as any;
  }

  // Handle Prisma Decimal
  if (
    typeof data === "object" &&
    data !== null &&
    (data as any).hasOwnProperty("d") &&
    (data as any).hasOwnProperty("s") &&
    (data as any).hasOwnProperty("e")
  ) {
    return Number(data) as any;
  }

  // Handle Dates
  if (data instanceof Date) {
    return data.toISOString() as any;
  }

  // Plain object
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = serializeDecimal(value);
  }
  return result;
}
