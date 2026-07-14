import { CloudProviderType } from '@prisma/client';
import { z } from 'zod';

const metadataSchema = z.record(z.string(), z.unknown()).optional();

export const organizationUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    logoUrl: z.string().trim().url().nullable().optional(),
    timezone: z.string().trim().min(1).max(100).optional(),
    currency: z.string().trim().length(3).toUpperCase().optional(),
    defaultProvider: z.nativeEnum(CloudProviderType).nullable().optional()
  })
  .strict();

const cloudAccountBaseSchema = z.object({
  accountName: z.string().trim().min(1).max(200),
  credentialRef: z.string().trim().min(1).max(500),
  region: z.string().trim().min(1).max(100).nullable().optional(),
  enabled: z.boolean().optional(),
  metadata: metadataSchema
});

const awsCloudAccountCreateSchema = cloudAccountBaseSchema
  .extend({
    provider: z.literal(CloudProviderType.AWS),
    accountId: z.string().trim().regex(/^\d{12}$/, 'AWS accountId must be a 12 digit account ID'),
    subscriptionId: z.null().optional(),
    tenantId: z.null().optional()
  })
  .strict();

const azureCloudAccountCreateSchema = cloudAccountBaseSchema
  .extend({
    provider: z.literal(CloudProviderType.AZURE),
    accountId: z.null().optional(),
    subscriptionId: z.string().trim().uuid('Azure subscriptionId must be a UUID'),
    tenantId: z.string().trim().uuid('Azure tenantId must be a UUID')
  })
  .strict();

export const cloudAccountCreateSchema = z.discriminatedUnion('provider', [
  awsCloudAccountCreateSchema,
  azureCloudAccountCreateSchema
]);

export const cloudAccountUpdateSchema = z
  .object({
    provider: z.nativeEnum(CloudProviderType).optional(),
    accountName: z.string().trim().min(1).max(200).optional(),
    credentialRef: z.string().trim().min(1).max(500).optional(),
    accountId: z.string().trim().regex(/^\d{12}$/, 'AWS accountId must be a 12 digit account ID').nullable().optional(),
    subscriptionId: z.string().trim().uuid('Azure subscriptionId must be a UUID').nullable().optional(),
    tenantId: z.string().trim().uuid('Azure tenantId must be a UUID').nullable().optional(),
    region: z.string().trim().min(1).max(100).nullable().optional(),
    enabled: z.boolean().optional(),
    metadata: metadataSchema
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
export type CloudAccountCreateInput = z.infer<typeof cloudAccountCreateSchema>;
export type CloudAccountUpdateInput = z.infer<typeof cloudAccountUpdateSchema>;
