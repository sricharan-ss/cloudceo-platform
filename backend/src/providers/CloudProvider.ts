import type { CloudProviderType } from '@prisma/client';

export type ProviderAccountContext = {
  id: string;
  organizationId: string;
  provider: CloudProviderType;
  accountName: string;
  accountId: string | null;
  subscriptionId: string | null;
  tenantId: string | null;
  credentialRef: string;
  region: string | null;
  metadata: unknown;
};

export type ProviderConnectionResult = {
  ok: boolean;
  provider: CloudProviderType;
  message: string;
  checkedAt: Date;
};

export type CloudResourceRecord = {
  externalId: string;
  name: string;
  type: string;
  region: string;
  status: string;
  tags: Record<string, string>;
  metadata: Record<string, unknown>;
};

export type BillingRecord = {
  periodStart: string;
  periodEnd: string;
  currency: string;
  totalCost: number;
  serviceBreakdown: Array<{
    service: string;
    cost: number;
  }>;
};

export type SecurityEventRecord = {
  externalId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  occurredAt: string;
  resourceExternalId?: string;
  metadata: Record<string, unknown>;
};

export type ReportRecord = {
  externalId: string;
  title: string;
  status: 'DRAFT' | 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  generatedAt: string;
  artifactRef: string;
  metadata: Record<string, unknown>;
};

export type DashboardSummary = {
  cloudHealth: {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
  };
  monthlyCost: {
    amount: number;
    currency: string;
    trendPercent: number;
  };
  resourceCount: number;
  criticalAlerts: number;
  savingsOpportunity: {
    amount: number;
    currency: string;
    recommendations: number;
  };
};

export interface CloudProvider {
  testConnection(account: ProviderAccountContext): Promise<ProviderConnectionResult>;
  syncResources(account: ProviderAccountContext): Promise<CloudResourceRecord[]>;
  syncBilling(account: ProviderAccountContext): Promise<BillingRecord[]>;
  syncSecurityEvents(account: ProviderAccountContext): Promise<SecurityEventRecord[]>;
  syncReports(account: ProviderAccountContext): Promise<ReportRecord[]>;
  getDashboardSummary(accounts: ProviderAccountContext[]): Promise<DashboardSummary>;
}
