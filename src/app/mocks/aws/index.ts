import {
  Zap, Shield, Sparkles, FileText, DollarSign, RefreshCw,
  TrendingDown, TrendingUp, Server, BarChart2, CheckCircle2
} from 'lucide-react';
import type { ProviderMocks } from '../types';

export const awsMocks: ProviderMocks = {
  kpi: {
    totalSpend: '$27,840',
    projectedMonthEnd: '$31,200',
    blockedThreats: '1,042',
    blockedThreatsTrend: '8.1%',
    openAlerts: 2,
    criticalAlerts: 1,
    healthScore: 76,
    estimatedSavings: '$1,247/mo',
    recommendations: 8,
  },

  executiveSummary: 'Your AWS infrastructure is operating at 76/100 health. EC2 costs are up 14% this week due to auto-scaling. 1 critical WAF vulnerability needs attention. CloudCEO AI has identified $1,247/month in savings across 8 optimisation opportunities.',

  aiSummary: 'AWS costs increased 14% this week. The primary driver was an EC2 auto-scaling event in us-east-1. Three idle instances are costing $847/month. Review Reserved Instance coverage and right-size the RDS cluster.',

  spendVsLabel: 'EC2 vs RDS vs Other',
  spendVsValue: 'EC2 $12.4k · RDS $6.8k · Other $8.6k',

  activity: [
    { icon: Zap,        text: 'EC2 auto-scaling event — 3 instances added in us-east-1', time: '14:23', type: 'infra',    cloud: 'aws', sev: 'warning' },
    { icon: Shield,     text: 'SQL injection blocked on /api/checkout by WAF rule SQL-001', time: '12:07', type: 'security', cloud: 'aws', sev: 'danger'  },
    { icon: Sparkles,   text: 'CloudCEO AI completed AWS cost analysis — 8 new insights',  time: '11:30', type: 'ai',       cloud: undefined, sev: undefined },
    { icon: FileText,   text: 'AWS Monthly Cost Report generated for billing period',       time: '10:00', type: 'report',   cloud: 'aws', sev: undefined },
    { icon: DollarSign, text: 'AWS budget alert — 84% of $33,000 monthly limit reached',   time: '09:15', type: 'cost',     cloud: 'aws', sev: 'warning' },
    { icon: RefreshCw,  text: 'Cost Explorer sync complete — 231 AWS resources indexed',   time: '08:00', type: 'cloud',    cloud: 'aws', sev: undefined },
  ],

  aiInsights: [
    { icon: TrendingDown, text: '$1,247/mo in savings identified — 3 idle EC2 + overprovisioned RDS', sev: 'warning' },
    { icon: Shield,       text: '1 critical WAF vulnerability: rate limiting missing on /api/auth',    sev: 'danger'  },
    { icon: Server,       text: 'EC2 fleet averaging 38% CPU — right-sizing recommended (m5.large)',   sev: 'warning' },
    { icon: TrendingUp,   text: 'EC2 capacity forecast to hit 85% by mid-August at current growth',   sev: 'warning' },
  ],

  aiInsightCards: [
    { cat: 'Cost',        icon: TrendingDown,  sev: 'warning', title: '$1,247/month in savings identified',    desc: '3 idle EC2 instances and overprovisioned RDS — terminate or right-size.' },
    { cat: 'Security',    icon: Shield,         sev: 'danger',  title: '1 critical WAF vulnerability',          desc: 'Rate limiting missing on /api/auth. Public S3 bucket allowing reads.' },
    { cat: 'Performance', icon: BarChart2,      sev: 'warning', title: 'CloudFront cache hit rate at 42%',      desc: 'Down from 68% over 14 days — increasing latency for global users.' },
    { cat: 'Compliance',  icon: CheckCircle2,   sev: 'danger',  title: '2 IAM policy violations',               desc: 'MFA not enforced for 2 IAM users. Overly permissive S3 bucket policy.' },
    { cat: 'Forecast',    icon: TrendingUp,     sev: 'warning', title: 'EC2 capacity at 85% by mid-Aug',       desc: 'Purchase Reserved Instances now to lock in 40% cost reduction.' },
  ],

  recommendations: [
    { id: 'r1', title: '3 idle EC2 instances',      impact: 'Compute waste',  priority: 'critical', cat: 'cost',        action: 'Terminate', cloud: 'AWS EC2',        savings: '$847/mo' },
    { id: 'r2', title: 'WAF rate limiting missing',  impact: 'Attack surface', priority: 'critical', cat: 'security',    action: 'Configure', cloud: 'AWS WAF'                            },
    { id: 'r3', title: 'RDS overprovisioned 40%',    impact: 'Compute waste',  priority: 'high',     cat: 'cost',        action: 'Resize',    cloud: 'AWS RDS',        savings: '$312/mo' },
    { id: 'r4', title: 'S3 lifecycle rules missing', impact: 'Storage waste',  priority: 'high',     cat: 'cost',        action: 'Configure', cloud: 'AWS S3',         savings: '$88/mo'  },
    { id: 'r5', title: 'Public S3 bucket detected',  impact: 'Data exposure',  priority: 'critical', cat: 'security',    action: 'Restrict',  cloud: 'AWS S3'                             },
    { id: 'r6', title: 'CloudFront cache settings',  impact: '32% perf gain',  priority: 'medium',   cat: 'performance', action: 'Optimise',  cloud: 'AWS CloudFront'                     },
  ],

  serviceCosts: [
    { label: 'EC2',        value: 12450, cloud: 'aws' },
    { label: 'RDS',        value: 6820,  cloud: 'aws' },
    { label: 'S3',         value: 3210,  cloud: 'aws' },
    { label: 'Lambda',     value: 2340,  cloud: 'aws' },
    { label: 'CloudFront', value: 1820,  cloud: 'aws' },
    { label: 'WAF',        value: 680,   cloud: 'aws' },
    { label: 'Other',      value: 520,   cloud: 'aws' },
  ],

  monthlyRows: [
    { month: 'Jun 2026', total: 27840, change: -4.1  },
    { month: 'May 2026', total: 29040, change: 8.6   },
    { month: 'Apr 2026', total: 26750, change: 4.2   },
    { month: 'Mar 2026', total: 25680, change: 2.9   },
    { month: 'Feb 2026', total: 24950, change: 5.3   },
    { month: 'Jan 2026', total: 23700, change: -18.4 },
  ],

  resources: [
    { id: 'a1',  name: 'prod-ec2-api-01',    type: 'compute',  cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$312/mo', icon: Server,    cpu: 58, memory: 72, owner: 'Platform Team', environment: 'production', health: 'healthy',  tags: ['api','critical'], service: 'EC2'        },
    { id: 'a2',  name: 'prod-ec2-api-02',    type: 'compute',  cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$312/mo', icon: Server,    cpu: 62, memory: 68, owner: 'Platform Team', environment: 'production', health: 'healthy',  tags: ['api','critical'], service: 'EC2'        },
    { id: 'a3',  name: 'prod-ec2-worker-01', type: 'compute',  cloud: 'aws', region: 'us-east-1',    status: 'warning', cost: '$156/mo', icon: Server,    cpu: 3,  memory: 8,  owner: 'DevOps',        environment: 'production', health: 'warning',  tags: ['worker','idle'],  service: 'EC2'        },
    { id: 'a4',  name: 'rds-prod-primary',   type: 'database', cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$284/mo', icon: Server,    cpu: 12, memory: 34, owner: 'Data Team',     environment: 'production', health: 'healthy',  tags: ['db','postgres'],  service: 'RDS'        },
    { id: 'a5',  name: 'rds-prod-replica',   type: 'database', cloud: 'aws', region: 'us-west-2',    status: 'running', cost: '$142/mo', icon: Server,    cpu: 8,  memory: 24, owner: 'Data Team',     environment: 'production', health: 'healthy',  tags: ['db','replica'],   service: 'RDS'        },
    { id: 'a6',  name: 'cloudceo-assets',    type: 'storage',  cloud: 'aws', region: 'us-east-1',    status: 'warning', cost: '$48/mo',  icon: Server,    cpu: 0,  memory: 0,  owner: 'Platform Team', environment: 'production', health: 'warning',  tags: ['public','static'],service: 'S3'         },
    { id: 'a7',  name: 'cloudceo-logs',      type: 'storage',  cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$32/mo',  icon: Server,    cpu: 0,  memory: 0,  owner: 'DevOps',        environment: 'production', health: 'healthy',  tags: ['logs'],           service: 'S3'         },
    { id: 'a8',  name: 'api-fn-checkout',    type: 'compute',  cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$24/mo',  icon: Server,    cpu: 0,  memory: 0,  owner: 'Dev Team',      environment: 'production', health: 'healthy',  tags: ['serverless'],     service: 'Lambda'     },
    { id: 'a9',  name: 'cloudceo-cdn',       type: 'network',  cloud: 'aws', region: 'Global',       status: 'running', cost: '$88/mo',  icon: Server,    cpu: 0,  memory: 0,  owner: 'Platform Team', environment: 'production', health: 'warning',  tags: ['cdn','global'],   service: 'CloudFront' },
    { id: 'a10', name: 'waf-prod-acl',       type: 'network',  cloud: 'aws', region: 'us-east-1',    status: 'running', cost: '$28/mo',  icon: Server,    cpu: 0,  memory: 0,  owner: 'Security Team', environment: 'production', health: 'healthy',  tags: ['waf','security'], service: 'WAF'        },
  ],

  securityKpi: {
    totalRequests: '284,910',
    totalRequestsTrend: '12.3%',
    blockedRequests: '1,042',
    blockedRequestsTrend: '8.6%',
    blockRate: '0.37%',
    activeRules: 18,
  },

  attackTypes: [
    { label: 'SQL injection',   value: 487 },
    { label: 'Bot traffic',     value: 312 },
    { label: 'XSS',             value: 198 },
    { label: 'Rate limit abuse',value: 164 },
    { label: 'Path traversal',  value: 123 },
  ],

  securityEvents: [
    { id: 'e1', time: '14:23', type: 'SQLi',         severity: 'critical', source: '203.0.113.42',  rule: 'AWS-AWSManagedRulesSQLiRuleSet', action: 'BLOCK', country: 'CN', ip: '203.0.113.42',  detail: 'SQL injection in query param on /api/checkout', cloud: 'aws', service: 'WAF', resource: 'waf-prod-acl', status: 'blocked', eventType: 'WAF' },
    { id: 'e2', time: '13:11', type: 'XSS',          severity: 'critical', source: '198.51.100.17', rule: 'AWS-AWSManagedRulesCommonRuleSet', action: 'BLOCK', country: 'RU', ip: '198.51.100.17', detail: 'XSS payload in search query string', cloud: 'aws', service: 'WAF', resource: 'waf-prod-acl', status: 'blocked', eventType: 'WAF' },
    { id: 'e3', time: '12:58', type: 'Rate limit',   severity: 'warning',  source: '192.0.2.88',   rule: 'RateLimitRule-1000rpm',           action: 'BLOCK', country: 'US', ip: '192.0.2.88',   detail: 'Exceeded 1,000 req/min on /api/', cloud: 'aws', service: 'WAF', resource: 'waf-prod-acl', status: 'blocked', eventType: 'WAF' },
    { id: 'e4', time: '11:45', type: 'Bot traffic',  severity: 'warning',  source: '203.0.113.99', rule: 'AWSManagedRulesBotControlRuleSet', action: 'BLOCK', country: 'BR', ip: '203.0.113.99', detail: 'Known scraper signature detected', cloud: 'aws', service: 'WAF', resource: 'waf-prod-acl', status: 'blocked', eventType: 'WAF' },
    { id: 'e5', time: '10:22', type: 'Path traversal', severity: 'warning', source: '198.51.100.55', rule: 'AWSManagedRulesKnownBadInputs', action: 'BLOCK', country: 'IN', ip: '198.51.100.55', detail: 'Directory traversal on /api/files', cloud: 'aws', service: 'WAF', resource: 'waf-prod-acl', status: 'blocked', eventType: 'WAF' },
    { id: 'e6', time: '09:15', type: 'IAM anomaly',  severity: 'critical', source: 'IAM/GuardDuty', rule: 'UnauthorizedAccess:IAMUser',     action: 'ALERT', country: 'US', ip: '10.0.1.5',     detail: 'Unusual IAM activity: 4 API keys created in 10min', cloud: 'aws', service: 'IAM', resource: 'arn:aws:iam::123:user/admin', status: 'flagged', eventType: 'Identity' },
  ],

  blockedIps: [
    { ip: '203.0.113.42',  count: 487, country: 'CN', cloud: 'aws' },
    { ip: '198.51.100.17', count: 312, country: 'RU', cloud: 'aws' },
    { ip: '192.0.2.88',    count: 198, country: 'US', cloud: 'aws' },
    { ip: '203.0.113.99',  count: 164, country: 'BR', cloud: 'aws' },
    { ip: '198.51.100.55', count: 123, country: 'IN', cloud: 'aws' },
  ],

  reports: [
    { id: 'aws-exec', title: 'Q2 2026 AWS Executive Summary',     type: 'cost',       cloud: 'aws',  date: 'Jun 28, 2026', pages: 16, status: 'ready', size: '2.8 MB', aiGenerated: true,  featured: true,  summary: 'AI-generated executive summary covering AWS total spend, EC2 cost trends, WAF security posture, and 8 actionable optimisation opportunities.' },
    { id: 'aws-r1',   title: 'AWS Monthly Cost Analysis',         type: 'cost',       cloud: 'aws',  date: 'Jun 28, 2026', pages: 12, status: 'ready', size: '1.4 MB', aiGenerated: true  },
    { id: 'aws-r2',   title: 'WAF Security Assessment',           type: 'security',   cloud: 'aws',  date: 'Jun 27, 2026', pages: 8,  status: 'ready', size: '920 KB', aiGenerated: true  },
    { id: 'aws-r3',   title: 'EC2 Resource Utilisation Report',   type: 'usage',      cloud: 'aws',  date: 'Jun 25, 2026', pages: 6,  status: 'ready', size: '780 KB', aiGenerated: false },
    { id: 'aws-r4',   title: 'IAM Compliance Status Report',      type: 'compliance', cloud: 'aws',  date: 'Jun 22, 2026', pages: 11, status: 'ready', size: '1.6 MB', aiGenerated: false },
    { id: 'aws-r5',   title: 'GuardDuty Threat Intelligence',     type: 'security',   cloud: 'aws',  date: 'Jun 15, 2026', pages: 9,  status: 'ready', size: '1.1 MB', aiGenerated: false },
    { id: 'aws-r6',   title: 'AWS Cost Forecast — Q3 2026',       type: 'cost',       cloud: 'aws',  date: 'Jun 8, 2026',  pages: 7,  status: 'ready', size: '860 KB', aiGenerated: true  },
  ],

  resourceHealth: { healthy: 8, warning: 2, critical: 1 },
};
