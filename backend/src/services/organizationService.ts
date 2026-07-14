import type { Organization } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type { OrganizationUpdateInput } from '../schemas/managementSchemas.js';
import { AppError } from '../utils/AppError.js';

export type SafeOrganization = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  timezone: string;
  currency: string;
  defaultProvider: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

const toSafeOrganization = (org: Organization): SafeOrganization => ({
  id: org.id,
  name: org.name,
  slug: org.slug,
  logoUrl: org.logoUrl,
  timezone: org.timezone,
  currency: org.currency,
  defaultProvider: org.defaultProvider ?? null,
  metadata: org.metadata,
  createdAt: org.createdAt,
  updatedAt: org.updatedAt
});

export const getOrganization = async (organizationId: string): Promise<SafeOrganization> => {
  const org = await prisma.organization.findFirst({
    where: { id: organizationId, deletedAt: null }
  });

  if (!org) {
    throw new AppError('Organization not found', 404);
  }

  return toSafeOrganization(org);
};

export const updateOrganization = async (
  organizationId: string,
  data: OrganizationUpdateInput
): Promise<SafeOrganization> => {
  const org = await prisma.organization.findFirst({
    where: { id: organizationId, deletedAt: null }
  });

  if (!org) {
    throw new AppError('Organization not found', 404);
  }

  const updated = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.timezone !== undefined && { timezone: data.timezone }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.defaultProvider !== undefined && { defaultProvider: data.defaultProvider })
    }
  });

  return toSafeOrganization(updated);
};

export const getOrganizationMembers = async (organizationId: string) => {
  const users = await prisma.user.findMany({
    where: { organizationId, deletedAt: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  return users;
};
