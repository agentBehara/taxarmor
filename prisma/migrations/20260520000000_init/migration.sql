Loaded Prisma config from prisma.config.ts.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CA', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PAN', 'AADHAAR', 'ITR', 'GST', 'BANK_STATEMENT', 'INCOME_STATEMENT', 'PROPERTY_DOC', 'LOAN_DOC', 'OTHER');

-- CreateEnum
CREATE TYPE "FilingStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'VERIFIED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AdvisoryStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AuditLogAction" AS ENUM ('LOGIN', 'LOGOUT', 'DOCUMENT_UPLOAD', 'DOCUMENT_DOWNLOAD', 'DOCUMENT_DELETE', 'FILING_CREATE', 'FILING_SUBMIT', 'SUBSCRIPTION_CREATE', 'SUBSCRIPTION_UPDATE', 'SUBSCRIPTION_CANCEL', 'PROFILE_UPDATE', 'MFA_ENABLE', 'MFA_DISABLE', 'DATA_PURGE_REQUEST');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SALARIED', 'BUSINESS');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRAVEL_BUSINESS', 'CONVEYANCE', 'BUSINESS_STAY', 'CLIENT_MEETINGS', 'TELECOM', 'RENTAL_EXPENSE', 'OFFICE_SUPPLIES', 'CHILDCARE', 'PERSONAL_TRAVEL', 'FOOD_PERSONAL', 'TAXI_PERSONAL', 'MOBILE_PERSONAL');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('APPROVED', 'PENDING', 'FLAGGED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('STOCKS_CAPITAL_GAINS', 'STOCKS_DIVIDENDS', 'FIXED_DEPOSIT', 'RENTAL_INCOME', 'MUTUAL_FUNDS', 'BONDS_DEBENTURES', 'SAVINGS_INTEREST', 'OTHER_INVESTMENT');

-- CreateEnum
CREATE TYPE "IncomeStatus" AS ENUM ('REPORTED', 'PENDING_REVIEW', 'FILED');

-- CreateEnum
CREATE TYPE "LossType" AS ENUM ('STCL', 'LTCL', 'BUSINESS_NON_SPECULATIVE', 'BUSINESS_SPECULATIVE', 'HOUSE_PROPERTY');

-- CreateEnum
CREATE TYPE "LossStatus" AS ENUM ('UNADJUSTED', 'PARTIALLY_ADJUSTED', 'FULLY_ADJUSTED', 'CARRIED_FORWARD', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "pan" TEXT,
    "aadhaarMasked" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'SALARIED',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "amount" DOUBLE PRECISION NOT NULL,
    "razorpaySubId" TEXT,
    "commitmentYears" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "tags" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "status" "FilingStatus" NOT NULL DEFAULT 'DRAFT',
    "data" TEXT NOT NULL,
    "filedAt" TIMESTAMP(3),
    "acknowledgment" TEXT,
    "notes" TEXT,
    "caId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisoryCall" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" "AdvisoryStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "recordingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvisoryCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAssignment" (
    "id" TEXT NOT NULL,
    "caId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClientAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditLogAction" NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LossRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LossType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "financialYear" TEXT NOT NULL,
    "description" TEXT,
    "assetType" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "saleDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "carriedForwardFrom" TEXT,
    "carryForwardYear" INTEGER NOT NULL DEFAULT 0,
    "remainingCarryYears" INTEGER NOT NULL DEFAULT 8,
    "adjustedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "LossStatus" NOT NULL DEFAULT 'UNADJUSTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LossRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "IncomeType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "financialYear" TEXT NOT NULL,
    "description" TEXT,
    "taxDeducted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hasForm26AS" BOOLEAN NOT NULL DEFAULT false,
    "status" "IncomeStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxExemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "purpose" TEXT,
    "businessUsePercent" INTEGER DEFAULT 100,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "receiptUrl" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "financialYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxExemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_pan_key" ON "User"("pan");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_userType_idx" ON "User"("userType");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

-- CreateIndex
CREATE INDEX "Filing_userId_idx" ON "Filing"("userId");

-- CreateIndex
CREATE INDEX "Filing_status_idx" ON "Filing"("status");

-- CreateIndex
CREATE INDEX "Filing_financialYear_idx" ON "Filing"("financialYear");

-- CreateIndex
CREATE INDEX "AdvisoryCall_userId_idx" ON "AdvisoryCall"("userId");

-- CreateIndex
CREATE INDEX "AdvisoryCall_status_idx" ON "AdvisoryCall"("status");

-- CreateIndex
CREATE INDEX "AdvisoryCall_scheduledAt_idx" ON "AdvisoryCall"("scheduledAt");

-- CreateIndex
CREATE INDEX "ClientAssignment_caId_idx" ON "ClientAssignment"("caId");

-- CreateIndex
CREATE INDEX "ClientAssignment_userId_idx" ON "ClientAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAssignment_caId_userId_key" ON "ClientAssignment"("caId", "userId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "LossRecord_userId_idx" ON "LossRecord"("userId");

-- CreateIndex
CREATE INDEX "LossRecord_type_idx" ON "LossRecord"("type");

-- CreateIndex
CREATE INDEX "LossRecord_financialYear_idx" ON "LossRecord"("financialYear");

-- CreateIndex
CREATE INDEX "LossRecord_status_idx" ON "LossRecord"("status");

-- CreateIndex
CREATE INDEX "IncomeRecord_userId_idx" ON "IncomeRecord"("userId");

-- CreateIndex
CREATE INDEX "IncomeRecord_type_idx" ON "IncomeRecord"("type");

-- CreateIndex
CREATE INDEX "IncomeRecord_financialYear_idx" ON "IncomeRecord"("financialYear");

-- CreateIndex
CREATE INDEX "TaxExemption_userId_idx" ON "TaxExemption"("userId");

-- CreateIndex
CREATE INDEX "TaxExemption_category_idx" ON "TaxExemption"("category");

-- CreateIndex
CREATE INDEX "TaxExemption_financialYear_idx" ON "TaxExemption"("financialYear");

-- CreateIndex
CREATE INDEX "TaxExemption_status_idx" ON "TaxExemption"("status");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filing" ADD CONSTRAINT "Filing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisoryCall" ADD CONSTRAINT "AdvisoryCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAssignment" ADD CONSTRAINT "ClientAssignment_caId_fkey" FOREIGN KEY ("caId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAssignment" ADD CONSTRAINT "ClientAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LossRecord" ADD CONSTRAINT "LossRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeRecord" ADD CONSTRAINT "IncomeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxExemption" ADD CONSTRAINT "TaxExemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

