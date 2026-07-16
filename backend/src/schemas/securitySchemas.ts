import { CloudProviderType, SecuritySeverity, SecurityStatus } from '@prisma/client';
import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => value || undefined);

export const securityQuerySchema = z.object({
  provider: z.nativeEnum(CloudProviderType).optional(),
  severity: z.nativeEnum(SecuritySeverity).optional(),
  service: optionalText,
  resource: optionalText,
  status: z.nativeEnum(SecurityStatus).optional(),
  eventType: optionalText,
  dateRange: z.enum(['7', '30', '90', '7d', '30d', '90d']).optional().default('30d'),
  search: optionalText,
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(['newest', 'oldest', 'highestSeverity', 'lowestSeverity']).optional().default('newest')
});

export type SecurityQuery = z.infer<typeof securityQuerySchema>;
