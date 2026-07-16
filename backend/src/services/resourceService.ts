import crypto from 'node:crypto';

import type { CloudAccount, CloudProviderType } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import type { CloudResourceRecord, ProviderAccountContext, SecurityEventRecord } from '../providers/CloudProvider.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import type { ResourceQuery } from '../schemas/resourceSchemas.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

type Health = 'healthy' | 'warning' | 'critical';
type ResourceType = 'compute' | 'database' | 'storage' | 'network';

type ResourceListItem = {
  id: string;
  externalId: string;
  organizationId: string;
  cloudAccountId: string;
  name: string;
  provider: CloudProviderType;
  service: string;
  resourceType: ResourceType;
  region: string;
  status: string;
  health: Health;
  utilization: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  monthlyCost: number;
  owner: string;
  environment: string;
  tags: Record<string, string>;
  metadata: Record<string, unknown>;
  lastUpdated: string;
};

type ResourceDataset = {
  organizationId: string;
  resources: ResourceListItem[];
  securityEvents: Array<SecurityEventRecord & { provider: CloudProviderType }>;
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

const stableId = (value: string): string => {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 16);
};

const scoreFrom = (value: string, min: number, max: number): number => {
  const seed = parseInt(stableId(value).slice(0, 8), 16);
  return min + (seed % (max - min + 1));
};

const daysAgo = (days: number): string => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString();
};

const getTagValue = (tags: Record<string, string>, key: string, fallback: string): string => {
  const entry = Object.entries(tags).find(([tagKey]) => tagKey.toLowerCase() === key.toLowerCase());
  return entry?.[1] ?? fallback;
};

const getResourceType = (service: string): ResourceType => {
  const normalized = service.toLowerCase();

  if (normalized.includes('sql') || normalized.includes('rds') || normalized.includes('database')) {
    return 'database';
  }

  if (normalized.includes('s3') || normalized.includes('storage')) {
    return 'storage';
  }

  if (normalized.includes('front') || normalized.includes('firewall') || normalized.includes('waf')) {
    return 'network';
  }

  return 'compute';
};

const deriveHealth = (resource: CloudResourceRecord): Health => {
  const normalized = resource.status.toLowerCase();

  if (normalized.includes('terminated') || normalized.includes('critical') || normalized.includes('stopped')) {
    return 'critical';
  }

  if (normalized.includes('unknown') || normalized.includes('inactive') || resource.tags.idle === 'true') {
    return 'warning';
  }

  return 'healthy';
};

const costFor = (resource: CloudResourceRecord, provider: CloudProviderType): number => {
  const type = getResourceType(resource.type);
  const base = provider === 'AWS' ? 1 : 0.92;

  switch (type) {
    case 'database':
      return Number((scoreFrom(resource.externalId, 180, 640) * base).toFixed(2));
    case 'storage':
      return Number((scoreFrom(resource.externalId, 32, 160) * base).toFixed(2));
    case 'network':
      return Number((scoreFrom(resource.externalId, 24, 220) * base).toFixed(2));
    case 'compute':
    default:
      return Number((scoreFrom(resource.externalId, 96, 420) * base).toFixed(2));
  }
};

const buildUtilization = (resource: CloudResourceRecord) => ({
  cpu: scoreFrom(`${resource.externalId}:cpu`, 2, 82),
  memory: scoreFrom(`${resource.externalId}:memory`, 8, 88),
  storage: scoreFrom(`${resource.externalId}:storage`, 12, 91),
  network: scoreFrom(`${resource.externalId}:network`, 1, 76)
});

const averageUtilization = (resource: ResourceListItem): number => {
  const values = Object.values(resource.utilization);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const mapResource = (
  organizationId: string,
  account: CloudAccount,
  resource: CloudResourceRecord
): ResourceListItem => {
  const service = resource.type;
  const health = deriveHealth(resource);
  const utilization = buildUtilization(resource);
  const owner = getTagValue(resource.tags, 'Owner', account.accountName);
  const environment = getTagValue(resource.tags, 'Environment', 'production').toLowerCase();

  return {
    id: stableId(`${account.id}:${resource.externalId}`),
    externalId: resource.externalId,
    organizationId,
    cloudAccountId: account.id,
    name: resource.name,
    provider: account.provider,
    service,
    resourceType: getResourceType(service),
    region: resource.region,
    status: resource.status.toLowerCase(),
    health,
    utilization,
    monthlyCost: costFor(resource, account.provider),
    owner,
    environment,
    tags: resource.tags,
    metadata: resource.metadata,
    lastUpdated: daysAgo(scoreFrom(`${resource.externalId}:updated`, 0, 12))
  };
};

const withResourceLogging = async <T>(
  organizationId: string,
  provider: string | undefined,
  operation: string,
  loader: () => Promise<T>
): Promise<T> => {
  const startedAt = Date.now();

  try {
    const result = await loader();
    logger.info(
      `Resource API operation=${operation} organization=${organizationId} provider=${provider ?? 'all'} durationMs=${Date.now() - startedAt}`
    );
    return result;
  } catch (error) {
    logger.error(
      `Resource API Failed operation=${operation} organization=${organizationId} provider=${provider ?? 'all'} durationMs=${Date.now() - startedAt} error=${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
};

const loadResourceDataset = async (
  organizationId: string,
  query?: Partial<ResourceQuery>
): Promise<ResourceDataset> => {
  const accounts = await prisma.cloudAccount.findMany({
    where: {
      organizationId,
      enabled: true,
      deletedAt: null,
      ...(query?.provider ? { provider: query.provider } : {})
    }
  });

  const accountResults = await Promise.all(
    accounts.map(async (account) => {
      const provider = ProviderFactory.create(account.provider);
      const context = toProviderContext(account);
      const [resources, securityEvents] = await Promise.all([
        provider.syncResources(context),
        provider.syncSecurityEvents(context)
      ]);

      return {
        account,
        resources,
        securityEvents
      };
    })
  );

  return {
    organizationId,
    resources: accountResults.flatMap(({ account, resources }) =>
      resources.map((resource) => mapResource(organizationId, account, resource))
    ),
    securityEvents: accountResults.flatMap(({ account, securityEvents }) =>
      securityEvents.map((event) => ({ ...event, provider: account.provider }))
    )
  };
};

const matchesText = (value: string, expected?: string): boolean => {
  return !expected || value.toLowerCase() === expected.toLowerCase();
};

const applyFilters = (resources: ResourceListItem[], query: ResourceQuery): ResourceListItem[] => {
  return resources.filter((resource) => {
    if (query.provider && resource.provider !== query.provider) {
      return false;
    }

    if (!matchesText(resource.service, query.service)) {
      return false;
    }

    if (!matchesText(resource.resourceType, query.resourceType)) {
      return false;
    }

    if (!matchesText(resource.region, query.region)) {
      return false;
    }

    if (!matchesText(resource.environment, query.environment)) {
      return false;
    }

    if (!matchesText(resource.status, query.status)) {
      return false;
    }

    if (query.health && resource.health !== query.health) {
      return false;
    }

    if (!matchesText(resource.owner, query.owner)) {
      return false;
    }

    if (query.search) {
      const search = query.search.toLowerCase();
      const tagText = Object.entries(resource.tags)
        .map(([key, value]) => `${key}:${value}`)
        .join(' ')
        .toLowerCase();

      return [resource.name, resource.externalId, resource.owner, tagText].some((value) =>
        value.toLowerCase().includes(search)
      );
    }

    return true;
  });
};

const healthRank = (health: Health): number => {
  if (health === 'critical') {
    return 3;
  }

  if (health === 'warning') {
    return 2;
  }

  return 1;
};

const sortResources = (resources: ResourceListItem[], query: ResourceQuery): ResourceListItem[] => {
  const direction = query.direction === 'asc' ? 1 : -1;

  return [...resources].sort((left, right) => {
    switch (query.sort) {
      case 'name':
        return left.name.localeCompare(right.name) * direction;
      case 'monthlyCost':
        return (left.monthlyCost - right.monthlyCost) * direction;
      case 'utilization':
        return (averageUtilization(left) - averageUtilization(right)) * direction;
      case 'health':
        return (healthRank(left.health) - healthRank(right.health)) * direction;
      case 'recentlyUpdated':
      default:
        return (new Date(left.lastUpdated).getTime() - new Date(right.lastUpdated).getTime()) * direction;
    }
  });
};

const paginate = <T>(items: T[], query: ResourceQuery): Paged<T> => {
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

const utilizationHistory = (resource: ResourceListItem) => {
  return Array.from({ length: 12 }, (_, index) => ({
    timestamp: daysAgo(11 - index),
    cpu: Math.max(resource.utilization.cpu - 8 + index, 0),
    memory: Math.max(resource.utilization.memory - 5 + index, 0),
    storage: Math.min(resource.utilization.storage + index, 100),
    network: Math.max(resource.utilization.network - 6 + index, 0)
  }));
};

const monthlyCostHistory = (resource: ResourceListItem) => {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      month: date.toISOString().slice(0, 7),
      cost: Number((resource.monthlyCost * (0.88 + index * 0.035)).toFixed(2))
    };
  });
};

const healthTimeline = (resource: ResourceListItem) => {
  return Array.from({ length: 5 }, (_, index) => ({
    timestamp: daysAgo(8 - index * 2),
    health: index === 4 ? resource.health : index === 0 ? 'healthy' : resource.health,
    message: index === 4 ? `Current health is ${resource.health}` : 'Periodic health check completed'
  }));
};

export const listResources = async (organizationId: string, query: ResourceQuery) => {
  return withResourceLogging(organizationId, query.provider, 'list', async () => {
    const dataset = await loadResourceDataset(organizationId, query);
    const filtered = applyFilters(dataset.resources, query);
    const sorted = sortResources(filtered, query);

    return paginate(sorted, query);
  });
};

export const getResourceById = async (organizationId: string, id: string) => {
  return withResourceLogging(organizationId, undefined, 'detail', async () => {
    const dataset = await loadResourceDataset(organizationId);
    const resource = dataset.resources.find((item) => item.id === id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    return {
      ...resource,
      utilizationHistory: utilizationHistory(resource),
      monthlyCostHistory: monthlyCostHistory(resource),
      healthTimeline: healthTimeline(resource),
      relatedSecurityEvents: dataset.securityEvents.filter(
        (event) => event.provider === resource.provider && (!event.resourceExternalId || event.resourceExternalId === resource.externalId)
      ),
      actions: [
        { id: 'view-cost', label: 'View Cost', type: 'read-only' },
        { id: 'view-security', label: 'View Security Events', type: 'read-only' },
        { id: 'sync-account', label: 'Sync Cloud Account', type: 'read-only' }
      ]
    };
  });
};

export const getSummary = async (organizationId: string) => {
  return withResourceLogging(organizationId, undefined, 'summary', async () => {
    const dataset = await loadResourceDataset(organizationId);
    const totalResources = dataset.resources.length;
    const healthy = dataset.resources.filter((resource) => resource.health === 'healthy').length;
    const warning = dataset.resources.filter((resource) => resource.health === 'warning').length;
    const critical = dataset.resources.filter((resource) => resource.health === 'critical').length;
    const awsCount = dataset.resources.filter((resource) => resource.provider === 'AWS').length;
    const azureCount = dataset.resources.filter((resource) => resource.provider === 'AZURE').length;

    return {
      totalResources,
      healthy,
      warning,
      critical,
      awsCount,
      azureCount
    };
  });
};

const groupUtilization = (resources: ResourceListItem[], key: (resource: ResourceListItem) => string) => {
  const groups = new Map<string, { count: number; cpu: number; memory: number; storage: number; network: number }>();

  for (const resource of resources) {
    const groupKey = key(resource);
    const current = groups.get(groupKey) ?? { count: 0, cpu: 0, memory: 0, storage: 0, network: 0 };
    current.count += 1;
    current.cpu += resource.utilization.cpu;
    current.memory += resource.utilization.memory;
    current.storage += resource.utilization.storage;
    current.network += resource.utilization.network;
    groups.set(groupKey, current);
  }

  return Array.from(groups.entries()).map(([group, value]) => ({
    group,
    count: value.count,
    cpu: Math.round(value.cpu / value.count),
    memory: Math.round(value.memory / value.count),
    storage: Math.round(value.storage / value.count),
    network: Math.round(value.network / value.count)
  }));
};

export const getUtilization = async (organizationId: string, query: ResourceQuery) => {
  return withResourceLogging(organizationId, query.provider, 'utilization', async () => {
    const dataset = await loadResourceDataset(organizationId, query);
    const resources = applyFilters(dataset.resources, query);

    return {
      byProvider: groupUtilization(resources, (resource) => resource.provider),
      byService: groupUtilization(resources, (resource) => resource.service),
      byResourceType: groupUtilization(resources, (resource) => resource.resourceType)
    };
  });
};

export const getCosts = async (organizationId: string, query: ResourceQuery) => {
  return withResourceLogging(organizationId, query.provider, 'cost', async () => {
    const dataset = await loadResourceDataset(organizationId, query);
    const resources = sortResources(applyFilters(dataset.resources, query), {
      ...query,
      sort: 'monthlyCost'
    });

    return paginate(
      resources.map((resource) => ({
        id: resource.id,
        name: resource.name,
        provider: resource.provider,
        service: resource.service,
        region: resource.region,
        monthlyCost: resource.monthlyCost,
        currency: 'USD'
      })),
      query
    );
  });
};

const healthBreakdown = (resources: ResourceListItem[]) => ({
  healthy: resources.filter((resource) => resource.health === 'healthy').length,
  warning: resources.filter((resource) => resource.health === 'warning').length,
  critical: resources.filter((resource) => resource.health === 'critical').length
});

export const getHealth = async (organizationId: string, query: ResourceQuery) => {
  return withResourceLogging(organizationId, query.provider, 'health', async () => {
    const dataset = await loadResourceDataset(organizationId, query);
    const resources = applyFilters(dataset.resources, query);

    return {
      overall: healthBreakdown(resources),
      byProvider: {
        AWS: healthBreakdown(resources.filter((resource) => resource.provider === 'AWS')),
        Azure: healthBreakdown(resources.filter((resource) => resource.provider === 'AZURE'))
      },
      byResourceType: Object.fromEntries(
        ['compute', 'database', 'storage', 'network'].map((resourceType) => [
          resourceType,
          healthBreakdown(resources.filter((resource) => resource.resourceType === resourceType))
        ])
      )
    };
  });
};
