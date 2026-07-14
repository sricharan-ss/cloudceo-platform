import { AuditAction } from '@prisma/client';
import type { Prisma } from '@prisma/client';

import { prisma } from '../prisma/client.js';

type AuditInput = {
  organizationId: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Prisma.InputJsonValue;
};

export const writeAuditLog = async ({
  organizationId,
  userId,
  action,
  entityType,
  entityId,
  ipAddress,
  userAgent,
  metadata
}: AuditInput): Promise<void> => {
  await prisma.auditLog.create({
    data: {
      organizationId,
      userId,
      action,
      entityType,
      entityId,
      ipAddress,
      userAgent,
      metadata
    }
  });
};
