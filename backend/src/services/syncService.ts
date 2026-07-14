import type { CloudAccount, SyncJob } from '@prisma/client';
import { SyncStatus } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type { ProviderAccountContext } from '../providers/CloudProvider.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export type SyncServiceKind = 'resources' | 'billing' | 'security' | 'reports';

type SyncRecords = Awaited<
  ReturnType<
    | ReturnType<typeof ProviderFactory.create>['syncResources']
    | ReturnType<typeof ProviderFactory.create>['syncBilling']
    | ReturnType<typeof ProviderFactory.create>['syncSecurityEvents']
    | ReturnType<typeof ProviderFactory.create>['syncReports']
  >
>;

export type SyncResult = {
  job: SyncJob;
  recordsFetched: number;
  records: SyncRecords;
};

const toProviderContext = (account: CloudAccount): ProviderAccountContext => ({
  id: account.id,
  organizationId: account.organizationId,
  provider: account.provider,
  accountName: account.accountName,
  accountId: account.accountId,
  subscriptionId: account.subscriptionId,
  tenantId: account.tenantId,
  credentialRef: account.credentialRef,
  region: account.region,
  metadata: account.metadata
});

const executeProviderSync = async (
  service: SyncServiceKind,
  account: ProviderAccountContext
): Promise<SyncRecords> => {
  const provider = ProviderFactory.create(account.provider);
  const connection = await provider.testConnection(account);

  if (!connection.ok) {
    throw new AppError(connection.message || 'Provider unavailable', 503);
  }

  switch (service) {
    case 'resources':
      return provider.syncResources(account);
    case 'billing':
      return provider.syncBilling(account);
    case 'security':
      return provider.syncSecurityEvents(account);
    case 'reports':
      return provider.syncReports(account);
    default:
      throw new AppError('Unsupported sync service', 400);
  }
};

export const runSync = async (
  organizationId: string,
  cloudAccountId: string,
  service: SyncServiceKind
): Promise<SyncResult> => {
  const account = await prisma.cloudAccount.findFirst({
    where: {
      id: cloudAccountId,
      organizationId,
      deletedAt: null
    }
  });

  if (!account) {
    throw new AppError('Cloud account not found', 404);
  }

  if (!account.enabled) {
    throw new AppError('Cloud account is disabled', 409);
  }

  const startedAt = new Date();
  const job = await prisma.syncJob.create({
    data: {
      organizationId,
      cloudAccountId: account.id,
      provider: account.provider,
      jobType: service,
      service,
      status: SyncStatus.RUNNING,
      startedAt
    }
  });

  logger.info(
    `Sync Started job=${job.id} organization=${organizationId} account=${account.id} provider=${account.provider} service=${service}`
  );

  try {
    const records = await executeProviderSync(service, toProviderContext(account));
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const recordsFetched = records.length;

    const updatedJob = await prisma.syncJob.update({
      where: { id: job.id },
      data: {
        status: SyncStatus.SUCCEEDED,
        finishedAt,
        completedAt: finishedAt,
        durationMs,
        recordsFetched
      }
    });

    await prisma.cloudAccount.update({
      where: { id: account.id },
      data: { lastSyncAt: finishedAt }
    });

    logger.info(
      `Sync Finished job=${job.id} durationMs=${durationMs} recordsSynced=${recordsFetched}`
    );

    return {
      job: updatedJob,
      recordsFetched,
      records
    };
  } catch (error) {
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const message = error instanceof Error ? error.message : 'Unexpected sync failure';

    await prisma.syncJob.update({
      where: { id: job.id },
      data: {
        status: SyncStatus.FAILED,
        finishedAt,
        completedAt: finishedAt,
        durationMs,
        recordsFetched: 0,
        errorMessage: message
      }
    });

    logger.error(`Sync Failed job=${job.id} durationMs=${durationMs} recordsSynced=0 error=${message}`);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Sync failed unexpectedly', 500);
  }
};
