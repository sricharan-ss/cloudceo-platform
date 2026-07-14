import type {
  BillingRecord,
  CloudProvider,
  CloudResourceRecord,
  DashboardSummary,
  ProviderAccountContext,
  ProviderConnectionResult,
  ReportRecord,
  SecurityEventRecord
} from '../CloudProvider.js';

const daysAgo = (days: number): string => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString();
};

export class MockCloudProvider implements CloudProvider {
  async testConnection(account: ProviderAccountContext): Promise<ProviderConnectionResult> {
    return {
      ok: true,
      provider: account.provider,
      message: `Mock ${account.provider} connection validated for ${account.accountName}`,
      checkedAt: new Date()
    };
  }

  async syncResources(account: ProviderAccountContext): Promise<CloudResourceRecord[]> {
    const region = account.region ?? (account.provider === 'AWS' ? 'us-east-1' : 'eastus');

    if (account.provider === 'AWS') {
      return [
        {
          externalId: `arn:aws:ec2:${region}:${account.accountId ?? '123456789012'}:instance/i-0a1b2c3d4e5f67890`,
          name: 'prod-api-ec2-01',
          type: 'EC2 Instance',
          region,
          status: 'RUNNING',
          tags: { Environment: 'production', Owner: 'platform' },
          metadata: { instanceType: 'm6i.large', vpcId: 'vpc-0f12abc345def6789' }
        },
        {
          externalId: `arn:aws:rds:${region}:${account.accountId ?? '123456789012'}:db:cloudceo-prod`,
          name: 'cloudceo-prod-rds',
          type: 'RDS Database',
          region,
          status: 'ACTIVE',
          tags: { Environment: 'production', Engine: 'postgres' },
          metadata: { engine: 'postgres', storageGb: 500, multiAz: true }
        },
        {
          externalId: `arn:aws:s3:::cloudceo-prod-reports-${account.accountId ?? '123456789012'}`,
          name: 'cloudceo-prod-reports',
          type: 'S3 Bucket',
          region,
          status: 'ACTIVE',
          tags: { Environment: 'production', DataClass: 'reports' },
          metadata: { versioning: true, encryption: 'AES256' }
        }
      ];
    }

    return [
      {
        externalId: `/subscriptions/${account.subscriptionId ?? '00000000-0000-0000-0000-000000000000'}/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/prod-api-vm-01`,
        name: 'prod-api-vm-01',
        type: 'Virtual Machine',
        region,
        status: 'RUNNING',
        tags: { environment: 'production', owner: 'platform' },
        metadata: { size: 'Standard_D4s_v5', resourceGroup: 'prod-rg' }
      },
      {
        externalId: `/subscriptions/${account.subscriptionId ?? '00000000-0000-0000-0000-000000000000'}/resourceGroups/prod-rg/providers/Microsoft.Sql/servers/cloudceo-sql/databases/cloudceo-prod`,
        name: 'cloudceo-prod-sql',
        type: 'Azure SQL Database',
        region,
        status: 'ACTIVE',
        tags: { environment: 'production', tier: 'business-critical' },
        metadata: { sku: 'BusinessCritical', vCores: 8 }
      },
      {
        externalId: `/subscriptions/${account.subscriptionId ?? '00000000-0000-0000-0000-000000000000'}/resourceGroups/prod-rg/providers/Microsoft.Storage/storageAccounts/cloudceoprodsa`,
        name: 'cloudceoprodsa',
        type: 'Storage Account',
        region,
        status: 'ACTIVE',
        tags: { environment: 'production', dataClass: 'reports' },
        metadata: { replication: 'ZRS', accessTier: 'Hot' }
      }
    ];
  }

  async syncBilling(account: ProviderAccountContext): Promise<BillingRecord[]> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = now.toISOString();
    const awsBreakdown = [
      { service: 'Amazon EC2', cost: 8420.32 },
      { service: 'Amazon RDS', cost: 4180.5 },
      { service: 'Amazon S3', cost: 615.28 }
    ];
    const azureBreakdown = [
      { service: 'Virtual Machines', cost: 7310.2 },
      { service: 'Azure SQL', cost: 5360.4 },
      { service: 'Storage Accounts', cost: 540.1 }
    ];
    const serviceBreakdown = account.provider === 'AWS' ? awsBreakdown : azureBreakdown;

    return [
      {
        periodStart,
        periodEnd,
        currency: 'USD',
        totalCost: Number(serviceBreakdown.reduce((sum, item) => sum + item.cost, 0).toFixed(2)),
        serviceBreakdown
      }
    ];
  }

  async syncSecurityEvents(account: ProviderAccountContext): Promise<SecurityEventRecord[]> {
    if (account.provider === 'AWS') {
      return [
        {
          externalId: 'finding-guardduty-001',
          title: 'Public S3 bucket policy detected',
          description: 'A bucket policy allows public read access and should be reviewed.',
          severity: 'CRITICAL',
          status: 'OPEN',
          occurredAt: daysAgo(1),
          metadata: { source: 'GuardDuty', control: 'S3_PUBLIC_READ' }
        },
        {
          externalId: 'finding-securityhub-017',
          title: 'EC2 instance missing required tag',
          description: 'Production EC2 instance does not include the CostCenter tag.',
          severity: 'MEDIUM',
          status: 'ACKNOWLEDGED',
          occurredAt: daysAgo(3),
          metadata: { source: 'Security Hub', standard: 'CloudCEO Tagging' }
        }
      ];
    }

    return [
      {
        externalId: 'defender-alert-001',
        title: 'Storage account allows public blob access',
        description: 'Microsoft Defender detected permissive blob container access.',
        severity: 'CRITICAL',
        status: 'OPEN',
        occurredAt: daysAgo(1),
        metadata: { source: 'Microsoft Defender for Cloud', policy: 'PublicBlobAccess' }
      },
      {
        externalId: 'policy-state-044',
        title: 'Virtual machine missing backup policy',
        description: 'A production virtual machine is not protected by the required backup policy.',
        severity: 'HIGH',
        status: 'INVESTIGATING',
        occurredAt: daysAgo(2),
        metadata: { source: 'Azure Policy', initiative: 'Operational Resilience' }
      }
    ];
  }

  async syncReports(account: ProviderAccountContext): Promise<ReportRecord[]> {
    return [
      {
        externalId: `${account.provider.toLowerCase()}-cost-optimization-current`,
        title: `${account.accountName} Cost Optimization Report`,
        status: 'COMPLETED',
        generatedAt: daysAgo(0),
        artifactRef: `mock://reports/${account.id}/cost-optimization.pdf`,
        metadata: { recommendationCount: 7, estimatedMonthlySavings: 1840.25 }
      },
      {
        externalId: `${account.provider.toLowerCase()}-security-posture-current`,
        title: `${account.accountName} Security Posture Report`,
        status: 'COMPLETED',
        generatedAt: daysAgo(1),
        artifactRef: `mock://reports/${account.id}/security-posture.pdf`,
        metadata: { criticalFindings: 1, highFindings: 2 }
      }
    ];
  }

  async getDashboardSummary(accounts: ProviderAccountContext[]): Promise<DashboardSummary> {
    const accountCount = Math.max(accounts.length, 1);
    const monthlyCost = accountCount * 12850.75;
    const criticalAlerts = accountCount;

    return {
      cloudHealth: {
        score: criticalAlerts > 2 ? 72 : 86,
        status: criticalAlerts > 2 ? 'warning' : 'healthy'
      },
      monthlyCost: {
        amount: Number(monthlyCost.toFixed(2)),
        currency: 'USD',
        trendPercent: 6.8
      },
      resourceCount: accountCount * 38,
      criticalAlerts,
      savingsOpportunity: {
        amount: Number((accountCount * 1840.25).toFixed(2)),
        currency: 'USD',
        recommendations: accountCount * 7
      }
    };
  }
}
