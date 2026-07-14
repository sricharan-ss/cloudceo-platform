-- AlterTable
ALTER TABLE "SyncJob" ADD COLUMN "service" TEXT;
ALTER TABLE "SyncJob" ADD COLUMN "finishedAt" TIMESTAMP(3);
ALTER TABLE "SyncJob" ADD COLUMN "durationMs" INTEGER;
ALTER TABLE "SyncJob" ADD COLUMN "recordsFetched" INTEGER;

-- CreateIndex
CREATE INDEX "SyncJob_organizationId_service_startedAt_idx" ON "SyncJob"("organizationId", "service", "startedAt");
