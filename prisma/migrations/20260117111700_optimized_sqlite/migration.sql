-- AlterTable
ALTER TABLE "InventoryHoarding" ADD COLUMN "discountedRate" DECIMAL;

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "companyName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "baseTotal" DECIMAL NOT NULL,
    "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
    "discountValue" DECIMAL NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL NOT NULL DEFAULT 0,
    "finalTotal" DECIMAL NOT NULL,
    "itemsSnapshot" TEXT NOT NULL,
    "notes" TEXT,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscountInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "companyName" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "baseTotal" DECIMAL NOT NULL,
    "discountPercent" DECIMAL,
    "discountAmount" DECIMAL,
    "finalTotal" DECIMAL,
    "cartSnapshot" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "approvedByUserId" INTEGER,
    CONSTRAINT "DiscountInquiry_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inquiryId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "consumedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminOtp_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "DiscountInquiry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminOtp_inquiryId_key" ON "AdminOtp"("inquiryId");

-- CreateIndex
CREATE INDEX "InventoryHoarding_locationName_idx" ON "InventoryHoarding"("locationName");

-- CreateIndex
CREATE INDEX "InventoryHoarding_city_idx" ON "InventoryHoarding"("city");

-- CreateIndex
CREATE INDEX "Lead_assigneeId_idx" ON "Lead"("assigneeId");

-- CreateIndex
CREATE INDEX "Lead_salesUserId_idx" ON "Lead"("salesUserId");

-- CreateIndex
CREATE INDEX "Lead_financeUserId_idx" ON "Lead"("financeUserId");

-- CreateIndex
CREATE INDEX "Lead_opsUserId_idx" ON "Lead"("opsUserId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "LeadCampaignItem_leadId_idx" ON "LeadCampaignItem"("leadId");

-- CreateIndex
CREATE INDEX "LeadCampaignItem_inventoryHoardingId_idx" ON "LeadCampaignItem"("inventoryHoardingId");
