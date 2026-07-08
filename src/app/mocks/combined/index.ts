import {
  Zap, Shield, Sparkles, FileText, DollarSign, RefreshCw,
  TrendingDown, TrendingUp, Server, BarChart2, CheckCircle2
} from 'lucide-react';
import type { ProviderMocks } from '../types';

// Combined uses totals across both providers
export const combinedMocks: ProviderMocks = {
  kpi: {
    totalSpend: '$42,310',
    projectedMonthEnd: '$48,900',
    blockedThreats: '1,284',
    blockedThreatsTrend: '6.8%',
    openAlerts: 3,
    criticalAlerts: 1,
    healthScore: 78,
    estimatedSavings: '$1,712/mo',
    recommendations: 12,
  },

  executiveSummary: 'Your cloud infrastructure is operating at 78/100 health across AWS and Azure. AWS costs increased 14% this week driven by EC2 auto-scaling. 2 critical security vulnerabilities require immediate attention. CloudCEO AI has identified $1,712/month in optimisation savings across 12 recommendations.',

  aiSummary: 'AWS costs increased 18.2% this week. The primary driver was EC2 auto-scaling at 14:23 UTC. Three idle instances are costing $847/month. I recommend reviewing scaling policies and converting baseline capacity to Reserved Instances — that alone would save approximately 40%.',

  spendVsLabel: 'AWS vs Azure',
  spendVsValue: 'AWS $27.8k · Azure $14.5k',

  activity: [
    { icon: Zap,        text: 'EC2 auto-scaling event triggered — 3 instances added',        time: '14:23', type: 'infra',    cloud: 'aws',   sev: 'warning' },
    { icon: Shield,     text: 'SQL injection attempt blocked on /api/checkout',               time: '12:07', type: 'security', cloud: 'aws',   sev: 'danger'  },
    { icon: Sparkles,   text: 'CloudCEO AI analysis completed — 5 new insights',             time: '11:30', type: 'ai',       cloud: undefined, sev: undefined },
    { icon: FileText,   text: 'Monthly cost report generated successfully',                   time: '10:00', type: 'report',   cloud: undefined, sev: undefined },
    { icon: DollarSign, text: 'AWS budget alert — 85% of monthly limit reached',             time: '09:15', type: 'cost',     cloud: 'aws',   sev: 'warning' },
    { icon: RefreshCw,  text: 'Azure data sync completed — 346 resources updated',           time: '08:00', type: 'cloud',    cloud: 'azure', sev: undefined },
  ],

  aiInsights: [
    { icon: TrendingDown, text: '$1,712/mo in savings identified across 12 items',              sev: 'warning' },
    { icon: Shield,       text: '2 critical WAF vulnerabilities require immediate action',       sev: 'danger'  },
    { icon: Server,       text: 'EC2 fleet averaging 38% CPU — right-sizing recommended',       sev: 'warning' },
    { icon: TrendingUp,   text: 'EC2 capacity forecast to hit 85% by mid-August',              sev: 'warning' },
  ],

  aiInsightCards: [
    { cat: 'Cost',        icon: TrendingDown, sev: 'warning', title: '$1,712/month in savings identified',    desc: '3 idle EC2 instances and overprovisioned RDS are the primary drivers.' },
    { cat: 'Security',    icon: Shield,        sev: 'danger',  title: '2 critical vulnerabilities active',     desc: 'WAF rate limiting missing on /api/auth. S3 bucket allows public reads.' },
    { cat: 'Performance', icon: BarChart2,     sev: 'warning', title: 'CloudFront cache hit rate at 42%',      desc: 'Down from 68% over 14 days — increasing latency for global users.' },
    { cat: 'Compliance',  icon: CheckCircle2,  sev: 'danger',  title: '3 policy violations this period',       desc: 'MFA not enforced for 3 IAM users. Session policy missing org-wide.' },
    { cat: 'Forecast',    icon: TrendingUp,    sev: 'warning', title: 'EC2 capacity at 85% by mid-Aug',       desc: 'Based on 90-day trend. Purchase Reserved Instances now to save 40%.' },
  ],

  recommendations: [
    { id: 'r1', title: '3 idle EC2 instances',       impact: 'Compute waste',  priority: 'critical', cat: 'cost',        action: 'Terminate', cloud: 'AWS',   savings: '$847/mo' },
    { id: 'r2', title: 'WAF rate limiting missing',   impact: 'Attack surface', priority: 'critical', cat: 'security',    action: 'Configure', cloud: 'AWS'                     },
    { id: 'r3', title: 'RDS overprovisioned 40%',     impact: 'Compute waste',  priority: 'high',     cat: 'cost',        action: 'Resize',    cloud: 'AWS',   savings: '$312/mo' },
    { id: 'r4', title: 'Azure VMs off-hours',         impact: 'Scheduling gap', priority: 'high',     cat: 'cost',        action: 'Schedule',  cloud: 'Azure', savings: '$428/mo' },
    { id: 'r5', title: 'Public S3 bucket detected',   impact: 'Data exposure',  priority: 'critical', cat: 'security',    action: 'Restrict',  cloud: 'AWS'                     },
    { id: 'r6', title: 'CloudFront cache settings',   impact: '32% perf gain',  priority: 'medium',   cat: 'performance', action: 'Optimise',  cloud: 'AWS'                     },
  ],

  serviceCosts: [
    { label: 'EC2',          value: 12450, cloud: 'aws'   },
    { label: 'Azure VM',     value: 7340,  cloud: 'azure' },
    { label: 'RDS',          value: 6820,  cloud: 'aws'   },
    { label: 'Azure Storage',value: 4120,  cloud: 'azure' },
    { label: 'S3',           value: 3210,  cloud: 'aws'   },
    { label: 'Azure SQL',    value: 3010,  cloud: 'azure' },
    { label: 'Lambda',       value: 2340,  cloud: 'aws'   },
    { label: 'Functions',    value: 1820,  cloud: 'azure' },
  ],

  monthlyRows: [
    { month: 'Jun 2026', total: 42310, change: -10.2 },
    { month: 'May 2026', total: 47100, change: 10.8  },
    { month: 'Apr 2026', total: 42500, change: 6.5   },
    { month: 'Mar 2026', total: 39900, change: 3.1   },
    { month: 'Feb 2026', total: 38700, change: 6.6   },
    { month: 'Jan 2026', total: 36300, change: -21.6 },
  ],

  resources: [],  // Merges both — populated dynamically via combined import

  securityKpi: {
    totalRequests: '284,910',
    totalRequestsTrend: '12.3%',
    blockedRequests: '1,284',
    blockedRequestsTrend: '8.6%',
    blockRate: '0.45%',
    activeRules: 18,
  },

  attackTypes: [
    { label: 'SQL injection',  value: 487 },
    { label: 'Bot traffic',    value: 312 },
    { label: 'XSS',            value: 198 },
    { label: 'Rate limit abuse',value: 164 },
    { label: 'Path traversal', value: 123 },
  ],

  securityEvents: [],  // Merges both — populated dynamically
  blockedIps: [],      // Merges both — populated dynamically

  reports: [
    { id: 'exec', title: 'Q2 2026 Executive Cloud Summary', type: 'cost', cloud: 'both', date: 'Jun 28, 2026', pages: 20, status: 'ready', size: '3.2 MB', aiGenerated: true, featured: true, summary: 'AI-generated executive brief covering total cloud spend, cost trends, security posture, and 12 actionable optimisation opportunities across AWS and Azure.' },
    { id: 'r1', title: 'Monthly Cost Analysis',       type: 'cost',       cloud: 'aws',   date: 'Jun 28, 2026', pages: 12, status: 'ready', size: '1.4 MB', aiGenerated: true  },
    { id: 'r2', title: 'Security Assessment',          type: 'security',   cloud: 'azure', date: 'Jun 27, 2026', pages: 8,  status: 'ready', size: '920 KB', aiGenerated: true  },
    { id: 'r3', title: 'Resource Utilisation Report',  type: 'usage',      cloud: 'aws',   date: 'Jun 25, 2026', pages: 6,  status: 'ready', size: '780 KB', aiGenerated: false },
    { id: 'r4', title: 'Compliance Status Report',     type: 'compliance', cloud: 'azure', date: 'Jun 22, 2026', pages: 15, status: 'ready', size: '2.1 MB', aiGenerated: false },
    { id: 'r5', title: 'Azure Cost Breakdown',         type: 'cost',       cloud: 'azure', date: 'Jun 20, 2026', pages: 9,  status: 'ready', size: '1.1 MB', aiGenerated: true  },
    { id: 'r6', title: 'WAF Security Audit',           type: 'security',   cloud: 'aws',   date: 'Jun 15, 2026', pages: 11, status: 'ready', size: '1.3 MB', aiGenerated: false },
    { id: 'r7', title: 'Cost Forecast — Q3 2026',      type: 'cost',       cloud: 'both',  date: 'Jun 8, 2026',  pages: 7,  status: 'ready', size: '860 KB', aiGenerated: true  },
  ],

  resourceHealth: { healthy: 14, warning: 3, critical: 1 },
};
