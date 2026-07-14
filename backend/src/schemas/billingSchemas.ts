import { CloudProviderType } from '@prisma/client';
import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => value || undefined);

export const billingQuerySchema = z.object({
  provider: z.nativeEnum(CloudProviderType).optional(),
  dateRange: z.enum(['7', '30', '90', '7d', '30d', '90d']).optional().default('30d'),
  service: optionalText,
  region: optionalText,
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.enum(['highestCost', 'lowestCost', 'alphabetical']).optional().default('highestCost')
});

export type BillingQuery = z.infer<typeof billingQuerySchema>;
