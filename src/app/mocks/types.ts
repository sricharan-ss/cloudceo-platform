// Shared types for mock data modules

export interface KpiData {
  totalSpend: string;
  projectedMonthEnd: string;
  blockedThreats: string;
  blockedThreatsTrend: string;
  openAlerts: number;
  criticalAlerts: number;
  healthScore: number;
  estimatedSavings: string;
  recommendations: number;
}

export interface ActivityItem {
  icon: React.ElementType;
  text: string;
  time: string;
  type: string;
  cloud?: 'aws' | 'azure';
  sev?: 'danger' | 'warning';
}

export interface AiInsight {
  icon: React.ElementType;
  text: string;
  sev: 'danger' | 'warning';
}

export interface AiRecommendation {
  id: string;
  title: string;
  impact: string;
  priority: 'critical' | 'high' | 'medium';
  cat: 'cost' | 'security' | 'performance';
  action: string;
  cloud: string;
  savings?: string;
}

export interface AiInsightCard {
  cat: string;
  icon: React.ElementType;
  sev: string;
  title: string;
  desc: string;
}

export interface ServiceCostItem {
  label: string;
  value: number;
  cloud: 'aws' | 'azure';
}

export interface MonthlyRow {
  month: string;
  total: number;
  change: number;
}

export interface ResourceItem {
  id: string;
  name: string;
  type: 'compute' | 'database' | 'storage' | 'network';
  cloud: 'aws' | 'azure';
  region: string;
  status: 'running' | 'stopped' | 'warning';
  cost: string;
  icon: React.ElementType;
  cpu: number;
  memory: number;
  owner: string;
  environment: 'production' | 'staging' | 'dev';
  health: 'healthy' | 'warning' | 'critical';
  tags: string[];
  service?: string; // The specific AWS/Azure service type
}

export interface SecurityKpi {
  totalRequests: string;
  totalRequestsTrend: string;
  blockedRequests: string;
  blockedRequestsTrend: string;
  blockRate: string;
  activeRules: number;
}

export interface AttackTypeItem {
  label: string;
  value: number;
}

export interface SecurityEventMock {
  id: string;
  time: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  rule: string;
  action: string;
  country: string;
  ip: string;
  detail: string;
  cloud: 'aws' | 'azure';
  service?: string;
  resource?: string;
  status?: 'blocked' | 'allowed' | 'flagged';
  eventType?: 'Network' | 'Identity' | 'Data Security' | 'Compliance' | 'VM Security' | 'WAF' | 'API Security';
}

export interface BlockedIpMock {
  ip: string;
  count: number;
  country: string;
  cloud: 'aws' | 'azure';
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'cost' | 'security' | 'usage' | 'compliance';
  cloud: 'aws' | 'azure' | 'both';
  date: string;
  pages: number;
  status: 'ready';
  size: string;
  aiGenerated: boolean;
  featured?: boolean;
  summary?: string;
}

export interface ResourceHealth {
  healthy: number;
  warning: number;
  critical: number;
}

export interface ProviderMocks {
  kpi: KpiData;
  activity: ActivityItem[];
  aiInsights: AiInsight[];
  aiInsightCards: AiInsightCard[];
  recommendations: AiRecommendation[];
  serviceCosts: ServiceCostItem[];
  monthlyRows: MonthlyRow[];
  resources: ResourceItem[];
  securityKpi: SecurityKpi;
  attackTypes: AttackTypeItem[];
  securityEvents: SecurityEventMock[];
  blockedIps: BlockedIpMock[];
  reports: ReportItem[];
  resourceHealth: ResourceHealth;
  executiveSummary: string;
  aiSummary: string;
  spendVsLabel: string;
  spendVsValue: string;
}
