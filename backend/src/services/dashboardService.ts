import type { CloudAccount, CloudProviderType } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type {
  BillingRecord,
  CloudResourceRecord,
  DashboardSummary,
  ProviderAccountContext,
  ReportRecord,
  SecurityEventRecord
} from '../providers/CloudProvider.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import { logger } from '../utils/logger.js';

type ProviderDashboardData = {
  provider: CloudProviderType;
  summary: DashboardSummary;
  resources: CloudResourceRecord[];
  billing: BillingRecord[];
  securityEvents: SecurityEventRecord[];
  reports: ReportRecord[];
};

type DashboardData = {
  organizationId: string;
  providers: ProviderDashboardData[];
};

type CachedDashboardResult<T> = Promise<T>;

type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  action: string;
  enabled: boolean;
};

const emptySummary = (): DashboardSummary => ({
  cloudHealth: {
    score: 100,
    status: 'healthy'
  },
  monthlyCost: {
    amount: 0,
    currency: 'USD',
    trendPercent: 0
  },
  resourceCount: 0,
  criticalAlerts: 0,
  savingsOpportunity: {
    amount: 0,
    currency: 'USD',
    recommendations: 0
  }
});

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

const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const minutesAgoLabel = (index: number): string => {
  const minutes = [12, 28, 45, 70, 95, 140][index] ?? 180;
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`;
};

const withDashboardLogging = async <T>(
  organizationId: string,
  provider: string,
  loader: () => Promise<T>
): CachedDashboardResult<T> => {
  const startedAt = Date.now();

  try {
    const result = await loader();
    logger.info(
      `Dashboard Loaded organization=${organizationId} provider=${provider} durationMs=${Date.now() - startedAt}`
    );
    return result;
  } catch (error) {
    logger.error(
      `Dashboard Load Failed organization=${organizationId} provider=${provider} durationMs=${Date.now() - startedAt} error=${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
};

const getProviderData = async (organizationId: string): Promise<DashboardData> => {
  return withDashboardLogging(organizationId, 'all', async () => {
    const accounts = await prisma.cloudAccount.findMany({
      where: {
        organizationId,
        enabled: true,
        deletedAt: null
      }
    });

    const groupedAccounts = new Map<CloudProviderType, ProviderAccountContext[]>();

    for (const account of accounts) {
      const context = toProviderContext(account);
      const group = groupedAccounts.get(account.provider) ?? [];
      group.push(context);
      groupedAccounts.set(account.provider, group);
    }

    const providers = await Promise.all(
      Array.from(groupedAccounts.entries()).map(async ([providerType, providerAccounts]) => {
        const provider = ProviderFactory.create(providerType);
        const [summary, resourceGroups, billingGroups, securityGroups, reportGroups] = await Promise.all([
          provider.getDashboardSummary(providerAccounts),
          Promise.all(providerAccounts.map((account) => provider.syncResources(account))),
          Promise.all(providerAccounts.map((account) => provider.syncBilling(account))),
          Promise.all(providerAccounts.map((account) => provider.syncSecurityEvents(account))),
          Promise.all(providerAccounts.map((account) => provider.syncReports(account)))
        ]);

        logger.info(
          `Dashboard Loaded organization=${organizationId} provider=${providerType} durationMs=0`
        );

        return {
          provider: providerType,
          summary,
          resources: resourceGroups.flat(),
          billing: billingGroups.flat(),
          securityEvents: securityGroups.flat(),
          reports: reportGroups.flat()
        };
      })
    );

    return {
      organizationId,
      providers
    };
  });
};

const aggregateSummary = (data: DashboardData): DashboardSummary => {
  if (data.providers.length === 0) {
    return emptySummary();
  }

  const monthlyCost = data.providers.reduce((sum, item) => sum + item.summary.monthlyCost.amount, 0);
  const resourceCount = data.providers.reduce((sum, item) => sum + item.summary.resourceCount, 0);
  const criticalAlerts = data.providers.reduce((sum, item) => sum + item.summary.criticalAlerts, 0);
  const savingsAmount = data.providers.reduce(
    (sum, item) => sum + item.summary.savingsOpportunity.amount,
    0
  );
  const recommendations = data.providers.reduce(
    (sum, item) => sum + item.summary.savingsOpportunity.recommendations,
    0
  );
  const healthScore = Math.round(
    data.providers.reduce((sum, item) => sum + item.summary.cloudHealth.score, 0) /
      data.providers.length
  );

  return {
    cloudHealth: {
      score: healthScore,
      status: criticalAlerts > 2 ? 'warning' : 'healthy'
    },
    monthlyCost: {
      amount: Number(monthlyCost.toFixed(2)),
      currency: 'USD',
      trendPercent: 6.8
    },
    resourceCount,
    criticalAlerts,
    savingsOpportunity: {
      amount: Number(savingsAmount.toFixed(2)),
      currency: 'USD',
      recommendations
    }
  };
};

export const getDashboardSummary = async (organizationId: string): Promise<DashboardSummary> => {
  return aggregateSummary(await getProviderData(organizationId));
};

export const getExecutiveSummary = async (organizationId: string) => {
  const data = await getProviderData(organizationId);
  const summary = aggregateSummary(data);
  const criticalRisks = data.providers.reduce(
    (sum, provider) => sum + provider.securityEvents.filter((event) => event.severity === 'CRITICAL').length,
    0
  );

  return {
    healthScore: summary.cloudHealth.score,
    overallCloudHealthScore: summary.cloudHealth.score,
    monthlyCost: {
      amount: summary.monthlyCost.amount,
      formatted: formatCurrency(summary.monthlyCost.amount),
      currency: summary.monthlyCost.currency
    },
    costTrend: {
      percentage: summary.monthlyCost.trendPercent,
      direction: summary.monthlyCost.trendPercent >= 0 ? 'up' : 'down'
    },
    savingsOpportunity: {
      amount: summary.savingsOpportunity.amount,
      formatted: `${formatCurrency(summary.savingsOpportunity.amount)}/mo`,
      currency: summary.savingsOpportunity.currency
    },
    criticalRisks,
    activeRecommendations: summary.savingsOpportunity.recommendations,
    executiveSummary: `Your cloud infrastructure is operating at ${summary.cloudHealth.score}/100 health across ${
      data.providers.length || 0
    } providers. Monthly cloud spend is ${formatCurrency(
      summary.monthlyCost.amount
    )}, with ${criticalRisks} critical risks and ${summary.savingsOpportunity.recommendations} active recommendations. Mock provider analysis identified ${formatCurrency(
      summary.savingsOpportunity.amount
    )}/mo in savings opportunities.`
  };
};

export const getKpis = async (organizationId: string) => {
  const data = await getProviderData(organizationId);
  const resources = data.providers.flatMap((provider) => provider.resources);
  const warningResources = resources.filter((resource) =>
    ['STOPPED', 'WARNING', 'INACTIVE', 'UNKNOWN'].includes(resource.status)
  ).length;
  const criticalResources = resources.filter((resource) =>
    ['TERMINATED', 'CRITICAL'].includes(resource.status)
  ).length;
  const healthyResources = Math.max(resources.length - warningResources - criticalResources, 0);

  return {
    totalResources: resources.length,
    healthyResources,
    warningResources,
    criticalResources
  };
};

export const getCostSummary = async (organizationId: string) => {
  const data = await getProviderData(organizationId);
  const currentMonth = data.providers.reduce(
    (sum, provider) => sum + provider.billing.reduce((inner, bill) => inner + bill.totalCost, 0),
    0
  );
  const previousMonth = Number((currentMonth / 1.068).toFixed(2));
  const percentageChange = previousMonth === 0 ? 0 : ((currentMonth - previousMonth) / previousMonth) * 100;

  return {
    currentMonth: {
      amount: Number(currentMonth.toFixed(2)),
      formatted: formatCurrency(currentMonth)
    },
    previousMonth: {
      amount: previousMonth,
      formatted: formatCurrency(previousMonth)
    },
    percentageChange: Number(percentageChange.toFixed(1)),
    direction: percentageChange >= 0 ? 'up' : 'down'
  };
};

export const getCloudHealth = async (organizationId: string) => {
  const data = await getProviderData(organizationId);

  return {
    AWS: buildProviderHealth(data.providers.find((provider) => provider.provider === 'AWS')),
    Azure: buildProviderHealth(data.providers.find((provider) => provider.provider === 'AZURE'))
  };
};

const buildProviderHealth = (provider?: ProviderDashboardData) => {
  if (!provider) {
    return { healthy: 0, warning: 0, critical: 0 };
  }

  const critical = provider.securityEvents.filter((event) => event.severity === 'CRITICAL').length;
  const warning = provider.securityEvents.filter((event) =>
    ['HIGH', 'MEDIUM'].includes(event.severity)
  ).length;
  const healthy = Math.max(provider.resources.length - warning - critical, 0);

  return { healthy, warning, critical };
};

export const getRecentActivity = async (organizationId: string) => {
  const data = await getProviderData(organizationId);
  const activities = data.providers.flatMap((provider) => {
    const cloud = provider.provider === 'AWS' ? 'aws' : 'azure';
    const latestBilling = provider.billing[0];
    const latestSecurity = provider.securityEvents[0];
    const latestResource = provider.resources[0];
    const latestReport = provider.reports[0];

    return [
      latestBilling && {
        id: `${provider.provider}-billing`,
        text: `${provider.provider} billing updated - ${formatCurrency(latestBilling.totalCost)} current month`,
        time: minutesAgoLabel(0),
        type: 'cost',
        cloud,
        sev: 'warning'
      },
      latestSecurity && {
        id: `${provider.provider}-security`,
        text: `${latestSecurity.title}`,
        time: minutesAgoLabel(1),
        type: 'security',
        cloud,
        sev: latestSecurity.severity === 'CRITICAL' ? 'danger' : 'warning'
      },
      latestResource && {
        id: `${provider.provider}-resource`,
        text: `${latestResource.name} resource state is ${latestResource.status.toLowerCase()}`,
        time: minutesAgoLabel(2),
        type: 'infra',
        cloud,
        sev: latestResource.status === 'RUNNING' || latestResource.status === 'ACTIVE' ? undefined : 'warning'
      },
      latestReport && {
        id: `${provider.provider}-report`,
        text: `${latestReport.title} generated successfully`,
        time: minutesAgoLabel(3),
        type: 'report',
        cloud,
        sev: undefined
      }
    ].filter(Boolean);
  });

  return activities.slice(0, 8);
};

export const getAiExecutiveSummary = async (organizationId: string) => {
  const executiveSummary = await getExecutiveSummary(organizationId);

  return {
    summary:
      'Mock AI summary: cloud spend is stable but optimization opportunities remain in compute sizing, storage policy hygiene, and security posture. Prioritize critical exposure findings before cost actions.',
    generatedAt: new Date().toISOString(),
    confidence: 0.91,
    recommendationsCount: executiveSummary.activeRecommendations
  };
};

export const getQuickActions = async (_organizationId: string): Promise<QuickAction[]> => {
  return [
    {
      id: 'view-billing',
      label: 'View Billing',
      description: 'Open cost analytics and monthly spend trends.',
      href: '/cost',
      action: 'navigate',
      enabled: true
    },
    {
      id: 'view-resources',
      label: 'View Resources',
      description: 'Inspect cloud inventory across AWS and Azure.',
      href: '/resources',
      action: 'navigate',
      enabled: true
    },
    {
      id: 'view-security',
      label: 'View Security',
      description: 'Review active risks and security findings.',
      href: '/security',
      action: 'navigate',
      enabled: true
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      description: 'Prepare an executive cloud report.',
      href: '/reports',
      action: 'navigate',
      enabled: true
    },
    {
      id: 'sync-cloud',
      label: 'Sync Cloud',
      description: 'Trigger the mock cloud sync flow for connected accounts.',
      href: '/settings',
      action: 'sync',
      enabled: true
    }
  ];
};
