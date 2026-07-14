-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "Organization" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'UTC';
ALTER TABLE "Organization" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Organization" ADD COLUMN "defaultProvider" "CloudProviderType";

-- AlterTable
ALTER TABLE "CloudAccount" ADD COLUMN "accountName" TEXT NOT NULL DEFAULT 'Unnamed Account';
ALTER TABLE "CloudAccount" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "CloudAccount" ADD COLUMN "region" TEXT;
ALTER TABLE "CloudAccount" ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CloudAccount" ADD COLUMN "lastSyncAt" TIMESTAMP(3);
