import { CloudProviderType } from '@prisma/client';
import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => value || undefined);

export const resourceQuerySchema = z.object({
  provider: z.nativeEnum(CloudProviderType).optional(),
  service: optionalText,
  resourceType: optionalText,
  region: optionalText,
  environment: optionalText,
  status: optionalText,
  health: z.enum(['healthy', 'warning', 'critical']).optional(),
  owner: optionalText,
  search: optionalText,
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z
    .enum(['name', 'monthlyCost', 'utilization', 'health', 'recentlyUpdated'])
    .optional()
    .default('recentlyUpdated'),
  direction: z.enum(['asc', 'desc']).optional().default('desc')
});

export type ResourceQuery = z.infer<typeof resourceQuerySchema>;
