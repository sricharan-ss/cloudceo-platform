import crypto from 'node:crypto';

import type { CloudAccount, CloudProviderType, SecuritySeverity, SecurityStatus } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type { CloudResourceRecord, ProviderAccountContext, SecurityEventRecord } from '../providers/CloudProvider.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import type { SecurityQuery } from '../schemas/securitySchemas.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

type SecurityEventType = 'Network' | 'Identity' | 'Data Security' | 'Compliance' | 'VM Security' | 'WAF' | 'API Security';

type SecurityEventItem = {
  eventId: string;
  timestamp: string;
  provider: CloudProviderType;
  severity: SecuritySeverity;
  service: string;
  resource: string;
  resourceId: string;
  sourceIp: string;
  destination: string;
  status: SecurityStatus;
  eventType: SecurityEventType;
  description: string;
  metadata: Record<string, unknown>;
};

type SecurityDataset = {
  organizationId: string;
  events: SecurityEventItem[];
  resources: Array<CloudResourceRecord & { provider: CloudProviderType; accountId: string }>;
};

type Paged<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

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

const stableId = (value: string): string => crypto.createHash('sha1').update(value).digest('hex').slice(0, 16);

const scoreFrom = (value: string, min: number, max: number): number => {
  const seed = parseInt(stableId(value).slice(0, 8), 16);
  return min + (seed % (max - min + 1));
};

const daysAgo = (days: number): string => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString();
};

const normalizeDateRange = (dateRange: SecurityQuery['dateRange']): number => {
  return Number(String(dateRange).replace('d', ''));
};

const severityRank = (severity: SecuritySeverity): number => {
  const ranks: Record<SecuritySeverity, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4
  };

  return ranks[severity];
};

const inferService = (event: SecurityEventRecord, provider: CloudProviderType): string => {
  const text = `${event.title} ${event.description}`.toLowerCase();

  if (text.includes('s3')) {
    return 'S3';
  }

  if (text.includes('storage')) {
    return provider === 'AWS' ? 'S3' : 'Storage Accounts';
  }

  if (text.includes('ec2')) {
    return 'EC2';
  }

  if (text.includes('virtual machine') || text.includes('vm')) {
    return provider === 'AWS' ? 'EC2' : 'Virtual Machines';
  }

  if (text.includes('waf')) {
    return provider === 'AWS' ? 'AWS WAF' : 'Azure WAF';
  }

  if (text.includes('policy')) {
    return provider === 'AWS' ? 'Security Hub' : 'Azure Policy';
  }

  return provider === 'AWS' ? 'GuardDuty' : 'Defender for Cloud';
};

const inferEventType = (event: SecurityEventRecord): SecurityEventType => {
  const text = `${event.title} ${event.description}`.toLowerCase();

  if (text.includes('public') || text.includes('blob') || text.includes('bucket')) {
    return 'Data Security';
  }

  if (text.includes('policy') || text.includes('tag')) {
    return 'Compliance';
  }

  if (text.includes('backup') || text.includes('virtual machine')) {
    return 'VM Security';
  }

  if (text.includes('waf')) {
    return 'WAF';
  }

  return 'Network';
};

const sourceIpFor = (eventId: string): string => {
  return `198.51.100.${scoreFrom(eventId, 10, 240)}`;
};

const mapEvent = (
  account: CloudAccount,
  event: SecurityEventRecord,
  fallbackResource?: CloudResourceRecord
): SecurityEventItem => {
  const eventId = stableId(`${account.id}:${event.externalId}`);
  const resource = fallbackResource?.name ?? event.resourceExternalId ?? account.accountName;
  const service = inferService(event, account.provider);

  return {
    eventId,
    timestamp: event.occurredAt,
    provider: account.provider,
    severity: event.severity,
    service,
    resource,
    resourceId: fallbackResource?.externalId ?? event.resourceExternalId ?? account.id,
    sourceIp: sourceIpFor(eventId),
    destination: fallbackResource?.name ?? `${account.provider.toLowerCase()}://${account.accountName}`,
    status: event.status,
    eventType: inferEventType(event),
    description: event.description,
    metadata: {
      ...event.metadata,
      title: event.title,
      accountName: account.accountName,
      cloudAccountId: account.id
    }
  };
};

const syntheticWafEvent = (account: CloudAccount): SecurityEventItem => {
  const eventId = stableId(`${account.id}:waf-rate-limit`);

  return {
    eventId,
    timestamp: daysAgo(0),
    provider: account.provider,
    severity: 'HIGH',
    service: account.provider === 'AWS' ? 'AWS WAF' : 'Azure WAF',
    resource: account.provider === 'AWS' ? 'waf-prod-acl' : 'frontdoor-waf-policy',
    resourceId: `${account.id}:waf`,
    sourceIp: sourceIpFor(eventId),
    destination: '/api/auth',
    status: 'OPEN',
    eventType: 'WAF',
    description: 'Elevated request rate detected and blocked by mock WAF policy.',
    metadata: {
      rule: 'RateLimit-AuthEndpoint',
      action: 'BLOCK',
      blockedRequests: scoreFrom(eventId, 80, 420),
      cloudAccountId: account.id
    }
  };
};

const withSecurityLogging = async <T>(
  organizationId: string,
  provider: string | undefined,
  operation: string,
  loader: () => Promise<T>
): Promise<T> => {
  const startedAt = Date.now();

  try {
    const result = await loader();
    logger.info(
      `Security API operation=${operation} organization=${organizationId} provider=${provider ?? 'all'} durationMs=${Date.now() - startedAt}`
    );
    return result;
  } catch (error) {
    logger.error(
      `Security API Failed operation=${operation} organization=${organizationId} provider=${provider ?? 'all'} durationMs=${Date.now() - startedAt} error=${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
};

const loadSecurityDataset = async (
  organizationId: string,
  query?: Partial<SecurityQuery>
): Promise<SecurityDataset> => {
  const accounts = await prisma.cloudAccount.findMany({
    where: {
      organizationId,
      enabled: true,
      deletedAt: null,
      ...(query?.provider ? { provider: query.provider } : {})
    }
  });

  const results = await Promise.all(
    accounts.map(async (account) => {
      const provider = ProviderFactory.create(account.provider);
      const context = toProviderContext(account);
      const [events, resources] = await Promise.all([
        provider.syncSecurityEvents(context),
        provider.syncResources(context)
      ]);

      return { account, events, resources };
    })
  );

  return {
    organizationId,
    events: results.flatMap(({ account, events, resources }) => [
      ...events.map((event, index) => mapEvent(account, event, resources[index % Math.max(resources.length, 1)])),
      syntheticWafEvent(account)
    ]),
    resources: results.flatMap(({ account, resources }) =>
      resources.map((resource) => ({ ...resource, provider: account.provider, accountId: account.id }))
    )
  };
};

const matchesText = (value: string, expected?: string): boolean => {
  return !expected || value.toLowerCase() === expected.toLowerCase();
};

const applyFilters = (events: SecurityEventItem[], query: SecurityQuery): SecurityEventItem[] => {
  const days = normalizeDateRange(query.dateRange);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return events.filter((event) => {
    if (new Date(event.timestamp) < cutoff) {
      return false;
    }

    if (query.provider && event.provider !== query.provider) {
      return false;
    }

    if (query.severity && event.severity !== query.severity) {
      return false;
    }

    if (!matchesText(event.service, query.service)) {
      return false;
    }

    if (!matchesText(event.resource, query.resource)) {
      return false;
    }

    if (query.status && event.status !== query.status) {
      return false;
    }

    if (!matchesText(event.eventType, query.eventType)) {
      return false;
    }

    if (query.search) {
      const search = query.search.toLowerCase();
      return [event.eventId, event.resource, event.sourceIp, event.destination, event.service].some((value) =>
        value.toLowerCase().includes(search)
      );
    }

    return true;
  });
};

const sortEvents = (events: SecurityEventItem[], sort: SecurityQuery['sort']): SecurityEventItem[] => {
  return [...events].sort((left, right) => {
    switch (sort) {
      case 'oldest':
        return new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
      case 'highestSeverity':
        return severityRank(right.severity) - severityRank(left.severity);
      case 'lowestSeverity':
        return severityRank(left.severity) - severityRank(right.severity);
      case 'newest':
      default:
        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
    }
  });
};

const paginate = <T>(items: T[], query: SecurityQuery): Paged<T> => {
  const start = (query.page - 1) * query.limit;

  return {
    items: items.slice(start, start + query.limit),
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems: items.length,
      totalPages: Math.max(Math.ceil(items.length / query.limit), 1)
    }
  };
};

const countBySeverity = (events: SecurityEventItem[], severity: SecuritySeverity): number => {
  return events.filter((event) => event.severity === severity).length;
};

export const getOverview = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'overview', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = applyFilters(dataset.events, query);
    const criticalAlerts = countBySeverity(events, 'CRITICAL');
    const highAlerts = countBySeverity(events, 'HIGH');
    const mediumAlerts = countBySeverity(events, 'MEDIUM');
    const lowAlerts = countBySeverity(events, 'LOW');
    const penalty = criticalAlerts * 16 + highAlerts * 8 + mediumAlerts * 4 + lowAlerts * 1;
    const securityScore = Math.max(100 - penalty, 0);
    const complianceScore = Math.max(92 - criticalAlerts * 6 - highAlerts * 3, 0);

    return {
      securityScore,
      criticalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts,
      wafStatus: highAlerts + criticalAlerts > 0 ? 'attention_required' : 'healthy',
      firewallStatus: events.some((event) => event.eventType === 'Network') ? 'monitoring' : 'healthy',
      complianceScore
    };
  });
};

export const listEvents = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'events', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = sortEvents(applyFilters(dataset.events, query), query.sort).map((item) => {
      const { metadata: _metadata, ...event } = item;
      return event;
    });
    return paginate(events, query);
  });
};

export const getEventById = async (organizationId: string, id: string) => {
  return withSecurityLogging(organizationId, undefined, 'event-detail', async () => {
    const dataset = await loadSecurityDataset(organizationId);
    const event = dataset.events.find((item) => item.eventId === id);

    if (!event) {
      throw new AppError('Security event not found', 404);
    }

    const relatedEvents = dataset.events
      .filter((item) => item.eventId !== event.eventId && (item.resource === event.resource || item.service === event.service))
      .slice(0, 5);
    const affectedResources = dataset.resources.filter(
      (resource) => resource.name === event.resource || resource.type === event.service || resource.externalId === event.resourceId
    );

    return {
      ...event,
      relatedEvents,
      recommendations: recommendationsFor(event, affectedResources.length),
      timeline: [
        { timestamp: event.timestamp, status: 'detected', description: 'Security event detected by mock provider.' },
        { timestamp: daysAgo(0), status: 'triaged', description: 'CloudCEO categorized severity and impact.' },
        { timestamp: daysAgo(0), status: 'recommended', description: 'Remediation guidance generated.' }
      ],
      affectedResources
    };
  });
};

const groupForDate = (timestamp: string): 'Today' | 'Yesterday' | 'Earlier' => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return 'Earlier';
};

export const getActivity = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'activity', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = sortEvents(applyFilters(dataset.events, query), 'newest');

    return {
      Today: events.filter((event) => groupForDate(event.timestamp) === 'Today'),
      Yesterday: events.filter((event) => groupForDate(event.timestamp) === 'Yesterday'),
      Earlier: events.filter((event) => groupForDate(event.timestamp) === 'Earlier')
    };
  });
};

export const getBlockedIps = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'blocked-ips', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = applyFilters(dataset.events, query).filter((event) => ['OPEN', 'INVESTIGATING'].includes(event.status));
    const groups = new Map<string, SecurityEventItem[]>();

    for (const event of events) {
      groups.set(event.sourceIp, [...(groups.get(event.sourceIp) ?? []), event]);
    }

    return Array.from(groups.entries()).map(([ip, ipEvents]) => ({
      ip,
      country: countryForIp(ip),
      provider: ipEvents[0].provider,
      blockCount: ipEvents.length * scoreFrom(ip, 6, 38),
      lastSeen: sortEvents(ipEvents, 'newest')[0].timestamp,
      threatScore: Math.min(100, Math.max(...ipEvents.map((event) => severityRank(event.severity) * 22)))
    }));
  });
};

const countryForIp = (ip: string): string => {
  const countries = ['United States', 'Netherlands', 'Germany', 'Singapore', 'Brazil', 'India'];
  return countries[scoreFrom(ip, 0, countries.length - 1)];
};

export const getVulnerabilities = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'vulnerabilities', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = applyFilters(dataset.events, query);

    return {
      totals: {
        critical: countBySeverity(events, 'CRITICAL'),
        high: countBySeverity(events, 'HIGH'),
        medium: countBySeverity(events, 'MEDIUM'),
        low: countBySeverity(events, 'LOW')
      },
      byProvider: groupSeverity(events, (event) => event.provider),
      byResource: groupSeverity(events, (event) => event.resource)
    };
  });
};

const groupSeverity = (events: SecurityEventItem[], key: (event: SecurityEventItem) => string) => {
  const groups = new Map<string, SecurityEventItem[]>();

  for (const event of events) {
    const groupKey = key(event);
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), event]);
  }

  return Array.from(groups.entries()).map(([group, groupEvents]) => ({
    group,
    critical: countBySeverity(groupEvents, 'CRITICAL'),
    high: countBySeverity(groupEvents, 'HIGH'),
    medium: countBySeverity(groupEvents, 'MEDIUM'),
    low: countBySeverity(groupEvents, 'LOW')
  }));
};

export const getCompliance = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'compliance', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = applyFilters(dataset.events, query);
    const checks = ['Identity', 'Storage', 'Network', 'Encryption', 'Compute'];

    return checks.map((category) => {
      const related = events.filter((event) => complianceMatch(category, event));
      const failed = related.filter((event) => ['CRITICAL', 'HIGH'].includes(event.severity)).length;
      const warning = related.filter((event) => event.severity === 'MEDIUM').length;
      const passed = Math.max(8 - failed - warning, 0);
      const score = Math.max(100 - failed * 18 - warning * 7, 0);

      return {
        category,
        score,
        passed,
        warning,
        failed,
        status: failed > 0 ? 'failed' : warning > 0 ? 'warning' : 'passed'
      };
    });
  });
};

const complianceMatch = (category: string, event: SecurityEventItem): boolean => {
  const text = `${event.service} ${event.resource} ${event.description} ${event.eventType}`.toLowerCase();
  return text.includes(category.toLowerCase()) || (category === 'Storage' && text.includes('bucket'));
};

export const getRecommendations = async (organizationId: string, query: SecurityQuery) => {
  return withSecurityLogging(organizationId, query.provider, 'recommendations', async () => {
    const dataset = await loadSecurityDataset(organizationId, query);
    const events = applyFilters(dataset.events, query);
    const affectedResources = Array.from(new Set(events.map((event) => event.resource)));

    return [
      {
        id: 'restrict-public-storage',
        title: 'Restrict public storage access',
        priority: 'critical',
        category: 'Storage',
        confidence: 0.94,
        estimatedRiskReduction: 38,
        affectedResources: affectedResources.filter((resource) => resource.toLowerCase().includes('storage') || resource.toLowerCase().includes('s3'))
      },
      {
        id: 'enforce-waf-rate-limits',
        title: 'Enforce WAF rate limits on public endpoints',
        priority: 'high',
        category: 'Network',
        confidence: 0.9,
        estimatedRiskReduction: 24,
        affectedResources: affectedResources.slice(0, 3)
      },
      {
        id: 'complete-backup-policy',
        title: 'Apply backup policy to production compute',
        priority: 'high',
        category: 'Compute',
        confidence: 0.87,
        estimatedRiskReduction: 19,
        affectedResources: affectedResources.filter((resource) => resource.toLowerCase().includes('vm') || resource.toLowerCase().includes('ec2'))
      },
      {
        id: 'standardize-resource-tags',
        title: 'Standardize required security and ownership tags',
        priority: 'medium',
        category: 'Compliance',
        confidence: 0.82,
        estimatedRiskReduction: 11,
        affectedResources: affectedResources.slice(0, 5)
      }
    ];
  });
};

const recommendationsFor = (event: SecurityEventItem, affectedCount: number) => [
  {
    priority: event.severity === 'CRITICAL' ? 'critical' : 'high',
    category: event.eventType,
    action: `Remediate ${event.service} finding for ${event.resource}`,
    confidence: 0.91,
    estimatedRiskReduction: Math.min(45, severityRank(event.severity) * 10 + affectedCount * 2)
  },
  {
    priority: 'medium',
    category: 'Monitoring',
    action: 'Increase alerting sensitivity for similar events',
    confidence: 0.84,
    estimatedRiskReduction: 9
  }
];
