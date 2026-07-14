import type { CloudAccount } from '@prisma/client';
import { AuditAction } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type {
  CloudAccountCreateInput,
  CloudAccountUpdateInput
} from '../schemas/managementSchemas.js';
import { AppError } from '../utils/AppError.js';
import { writeAuditLog } from '../utils/auditLog.js';

export type SafeCloudAccount = {
  id: string;
  organizationId: string;
  cloudProviderId: string;
  accountName: string;
  provider: string;
  accountId: string | null;
  subscriptionId: string | null;
  tenantId: string | null;
  region: string | null;
  enabled: boolean;
  lastSyncAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

const toSafe = (account: CloudAccount): SafeCloudAccount => ({
  id: account.id,
  organizationId: account.organizationId,
  cloudProviderId: account.cloudProviderId,
  accountName: account.accountName,
  provider: account.provider,
  accountId: account.accountId,
  subscriptionId: account.subscriptionId,
  tenantId: account.tenantId,
  region: account.region,
  enabled: account.enabled,
  lastSyncAt: account.lastSyncAt,
  metadata: account.metadata,
  createdAt: account.createdAt,
  updatedAt: account.updatedAt
});

export const listCloudAccounts = async (organizationId: string): Promise<SafeCloudAccount[]> => {
  const accounts = await prisma.cloudAccount.findMany({
    where: { organizationId, deletedAt: null },
    orderBy: { createdAt: 'asc' }
  });

  return accounts.map(toSafe);
};

export const getCloudAccount = async (
  organizationId: string,
  accountId: string
): Promise<SafeCloudAccount> => {
  const account = await prisma.cloudAccount.findFirst({
    where: { id: accountId, organizationId, deletedAt: null }
  });

  if (!account) {
    throw new AppError('Cloud account not found', 404);
  }

  return toSafe(account);
};

export const createCloudAccount = async (
  organizationId: string,
  userId: string,
  data: CloudAccountCreateInput,
  context: { ipAddress?: string; userAgent?: string }
): Promise<SafeCloudAccount> => {
  // Resolve or create the CloudProvider for this org + type
  let cloudProvider = await prisma.cloudProvider.findFirst({
    where: { organizationId, type: data.provider, deletedAt: null }
  });

  if (!cloudProvider) {
    cloudProvider = await prisma.cloudProvider.create({
      data: {
        organizationId,
        type: data.provider,
        displayName: data.provider === 'AWS' ? 'Amazon Web Services' : 'Microsoft Azure'
      }
    });
  }

  // Guard duplicate accountId / subscriptionId within the same org+provider
  if (data.provider === 'AWS' && data.accountId) {
    const existing = await prisma.cloudAccount.findFirst({
      where: {
        organizationId,
        provider: data.provider,
        accountId: data.accountId,
        deletedAt: null
      }
    });
    if (existing) {
      throw new AppError('An account with this AWS account ID already exists in your organization', 409);
    }
  }

  if (data.provider === 'AZURE' && data.subscriptionId) {
    const existing = await prisma.cloudAccount.findFirst({
      where: {
        organizationId,
        provider: data.provider,
        subscriptionId: data.subscriptionId,
        deletedAt: null
      }
    });
    if (existing) {
      throw new AppError('An account with this Azure subscription ID already exists in your organization', 409);
    }
  }

  const account = await prisma.cloudAccount.create({
    data: {
      organizationId,
      cloudProviderId: cloudProvider.id,
      provider: data.provider,
      accountName: data.accountName,
      credentialRef: data.credentialRef,
      accountId: data.provider === 'AWS' ? data.accountId : null,
      subscriptionId: data.provider === 'AZURE' ? data.subscriptionId : null,
      tenantId: data.provider === 'AZURE' ? data.tenantId : null,
      region: data.region ?? null,
      enabled: data.enabled ?? true,
      metadata: data.metadata as object | undefined
    }
  });

  await writeAuditLog({
    organizationId,
    userId,
    action: AuditAction.CREATE,
    entityType: 'CloudAccount',
    entityId: account.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    metadata: { provider: data.provider, accountName: data.accountName }
  });

  return toSafe(account);
};

export const updateCloudAccount = async (
  organizationId: string,
  userId: string,
  accountId: string,
  data: CloudAccountUpdateInput,
  context: { ipAddress?: string; userAgent?: string }
): Promise<SafeCloudAccount> => {
  const existing = await prisma.cloudAccount.findFirst({
    where: { id: accountId, organizationId, deletedAt: null }
  });

  if (!existing) {
    throw new AppError('Cloud account not found', 404);
  }

  const updated = await prisma.cloudAccount.update({
    where: { id: accountId },
    data: {
      ...(data.accountName !== undefined && { accountName: data.accountName }),
      ...(data.credentialRef !== undefined && { credentialRef: data.credentialRef }),
      ...(data.region !== undefined && { region: data.region }),
      ...(data.enabled !== undefined && { enabled: data.enabled }),
      ...(data.accountId !== undefined && { accountId: data.accountId }),
      ...(data.subscriptionId !== undefined && { subscriptionId: data.subscriptionId }),
      ...(data.tenantId !== undefined && { tenantId: data.tenantId }),
      ...(data.metadata !== undefined && { metadata: data.metadata as object })
    }
  });

  await writeAuditLog({
    organizationId,
    userId,
    action: AuditAction.UPDATE,
    entityType: 'CloudAccount',
    entityId: accountId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });

  return toSafe(updated);
};

export const deleteCloudAccount = async (
  organizationId: string,
  userId: string,
  accountId: string,
  context: { ipAddress?: string; userAgent?: string }
): Promise<void> => {
  const existing = await prisma.cloudAccount.findFirst({
    where: { id: accountId, organizationId, deletedAt: null }
  });

  if (!existing) {
    throw new AppError('Cloud account not found', 404);
  }

  // Soft delete
  await prisma.cloudAccount.update({
    where: { id: accountId },
    data: { deletedAt: new Date() }
  });

  await writeAuditLog({
    organizationId,
    userId,
    action: AuditAction.DELETE,
    entityType: 'CloudAccount',
    entityId: accountId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    metadata: { accountName: existing.accountName, provider: existing.provider }
  });
};
