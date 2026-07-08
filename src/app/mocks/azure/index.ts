import {
  Zap, Shield, Sparkles, FileText, DollarSign, RefreshCw,
  TrendingDown, TrendingUp, Server, BarChart2, CheckCircle2
} from 'lucide-react';
import type { ProviderMocks } from '../types';

export const azureMocks: ProviderMocks = {
  kpi: {
    totalSpend: '$14,470',
    projectedMonthEnd: '$16,100',
    blockedThreats: '242',
    blockedThreatsTrend: '3.2%',
    openAlerts: 1,
    criticalAlerts: 0,
    healthScore: 82,
    estimatedSavings: '$465/mo',
    recommendations: 4,
  },

  executiveSummary: 'Your Azure infrastructure is operating at 82/100 health. VM costs are up 7% this week due to scaling in East US. No critical security alerts. CloudCEO AI has identified $465/month in savings across 4 optimisation opportunities.',

  aiSummary: 'Azure costs increased 7% this week. The primary driver was VM scaling in East US 2. Two VMs are running outside business hours without scheduling, costing $428/month. Consider enabling auto-shutdown policies.',

  spendVsLabel: 'VM vs SQL vs Storage vs Other',
  spendVsValue: 'VM $7.3k · SQL $3.1k · Storage $2.1k · Other $1.9k',

  activity: [
    { icon: Zap,        text: 'Azure VM autoscale in East US 2 — 3 new instances started', time: '14:10', type: 'infra',    cloud: 'azure', sev: 'warning'   },
    { icon: Shield,     text: 'Azure Defender alert: suspicious login from unknown location', time: '11:42', type: 'security', cloud: 'azure', sev: 'warning'   },
    { icon: Sparkles,   text: 'CloudCEO AI completed Azure cost analysis — 4 new insights',  time: '10:55', type: 'ai',       cloud: undefined, sev: undefined  },
    { icon: FileText,   text: 'Azure Monthly Cost Report generated for billing period',       time: '10:00', type: 'report',   cloud: 'azure', sev: undefined   },
    { icon: DollarSign, text: 'Azure budget alert — 79% of $18,300 monthly limit reached',   time: '08:45', type: 'cost',     cloud: 'azure', sev: 'warning'   },
    { icon: RefreshCw,  text: 'Azure Cost Management sync complete — 115 resources indexed',  time: '07:30', type: 'cloud',    cloud: 'azure', sev: undefined   },
  ],

  aiInsights: [
    { icon: TrendingDown, text: '$465/mo in savings — 2 VMs running off-hours without scheduling', sev: 'warning' },
    { icon: Shield,       text: 'Azure AD: MFA not enforced for 3 guest accounts',                sev: 'warning' },
    { icon: Server,       text: 'Azure SQL Database provisioned at 80 DTUs — recommend 40 DTUs',  sev: 'warning' },
    { icon: TrendingUp,   text: 'Front Door latency increased 22% in Southeast Asia in last 7 days', sev: 'warning' },
  ],

  aiInsightCards: [
    { cat: 'Cost',        icon: TrendingDown, sev: 'warning', title: '$465/month in savings identified',       desc: '2 VMs running off-hours; SQL Database overprovisioned by 50% DTUs.' },
    { cat: 'Security',    icon: Shield,        sev: 'warning', title: 'Azure AD: 3 guest accounts without MFA', desc: 'Enforce MFA via Conditional Access policy to reduce identity risk.' },
    { cat: 'Performance', icon: BarChart2,     sev: 'warning', title: 'Front Door latency up 22% in APAC',     desc: 'Investigate origin response time from Southeast Asia region.' },
    { cat: 'Compliance',  icon: CheckCircle2,  sev: 'warning', title: '1 policy violation: storage encryption', desc: 'Blob storage container missing customer-managed key encryption.' },
    { cat: 'Forecast',    icon: TrendingUp,    sev: 'warning', title: 'VM capacity at 72% by end of Q3',       desc: 'Consider reserved VM instances for predictable workloads (up to 72% savings).' },
  ],

  recommendations: [
    { id: 'r1', title: '2 VMs running off-hours',       impact: 'Scheduling gap', priority: 'high',     cat: 'cost',        action: 'Schedule',  cloud: 'Azure VMs',      savings: '$428/mo' },
    { id: 'r2', title: 'SQL DTUs overprovisioned 50%',   impact: 'Compute waste',  priority: 'high',     cat: 'cost',        action: 'Resize',    cloud: 'Azure SQL DB',   savings: '$37/mo'  },
    { id: 'r3', title: 'Azure AD MFA gap — 3 accounts',  impact: 'Identity risk',  priority: 'high',     cat: 'security',    action: 'Enforce',   cloud: 'Azure AD'                            },
    { id: 'r4', title: 'Blob storage missing CMK',        impact: 'Compliance',    priority: 'medium',   cat: 'security',    action: 'Encrypt',   cloud: 'Azure Storage'                       },
  ],

  serviceCosts: [
    { label: 'Virtual Machines', value: 7340, cloud: 'azure' },
    { label: 'SQL Database',     value: 3100, cloud: 'azure' },
    { label: 'Blob Storage',     value: 2120, cloud: 'azure' },
    { label: 'Functions',        value: 890,  cloud: 'azure' },
    { label: 'Front Door',       value: 560,  cloud: 'azure' },
    { label: 'Azure Firewall',   value: 320,  cloud: 'azure' },
    { label: 'Azure Monitor',    value: 140,  cloud: 'azure' },
  ],

  monthlyRows: [
    { month: 'Jun 2026', total: 14470, change: -6.8  },
    { month: 'May 2026', total: 15530, change: 14.8  },
    { month: 'Apr 2026', total: 13530, change: 9.1   },
    { month: 'Mar 2026', total: 12400, change: 3.5   },
    { month: 'Feb 2026', total: 11980, change: 8.6   },
    { month: 'Jan 2026', total: 11030, change: -25.4 },
  ],

  resources: [
    { id: 'az1',  name: 'prod-vm-east-01',       type: 'compute',  cloud: 'azure', region: 'East US',       status: 'running', cost: '$248/mo', icon: Server, cpu: 44, memory: 61, owner: 'Cloud Team',    environment: 'production', health: 'healthy',  tags: ['vm','api'],      service: 'Virtual Machines' },
    { id: 'az2',  name: 'prod-vm-east-02',       type: 'compute',  cloud: 'azure', region: 'East US',       status: 'running', cost: '$248/mo', icon: Server, cpu: 38, memory: 55, owner: 'Cloud Team',    environment: 'production', health: 'healthy',  tags: ['vm','api'],      service: 'Virtual Machines' },
    { id: 'az3',  name: 'staging-vm-east-01',    type: 'compute',  cloud: 'azure', region: 'East US 2',     status: 'warning', cost: '$124/mo', icon: Server, cpu: 2,  memory: 6,  owner: 'DevOps',        environment: 'staging',    health: 'warning',  tags: ['vm','idle'],     service: 'Virtual Machines' },
    { id: 'az4',  name: 'cloudceo-sql-prod',     type: 'database', cloud: 'azure', region: 'East US',       status: 'running', cost: '$180/mo', icon: Server, cpu: 18, memory: 42, owner: 'Data Team',     environment: 'production', health: 'healthy',  tags: ['sql','primary'], service: 'SQL Database'     },
    { id: 'az5',  name: 'cloudceo-storage-prod', type: 'storage',  cloud: 'azure', region: 'East US',       status: 'running', cost: '$72/mo',  icon: Server, cpu: 0,  memory: 0,  owner: 'DevOps',        environment: 'production', health: 'healthy',  tags: ['storage'],       service: 'Blob Storage'     },
    { id: 'az6',  name: 'cloudceo-fn-api',       type: 'compute',  cloud: 'azure', region: 'East US',       status: 'stopped', cost: '$0/mo',   icon: Server, cpu: 0,  memory: 0,  owner: 'Dev Team',      environment: 'dev',        health: 'critical', tags: ['functions','dev'],service: 'Functions'        },
    { id: 'az7',  name: 'cloudceo-fn-scheduler', type: 'compute',  cloud: 'azure', region: 'East US 2',     status: 'running', cost: '$18/mo',  icon: Server, cpu: 0,  memory: 0,  owner: 'Dev Team',      environment: 'production', health: 'healthy',  tags: ['functions'],     service: 'Functions'        },
    { id: 'az8',  name: 'cloudceo-frontdoor',    type: 'network',  cloud: 'azure', region: 'Global',        status: 'running', cost: '$56/mo',  icon: Server, cpu: 0,  memory: 0,  owner: 'Platform Team', environment: 'production', health: 'healthy',  tags: ['cdn','global'],  service: 'Front Door'       },
    { id: 'az9',  name: 'az-firewall-prod',      type: 'network',  cloud: 'azure', region: 'East US',       status: 'running', cost: '$32/mo',  icon: Server, cpu: 0,  memory: 0,  owner: 'Security Team', environment: 'production', health: 'healthy',  tags: ['firewall'],      service: 'Azure Firewall'   },
    { id: 'az10', name: 'azure-monitor-ws',      type: 'compute',  cloud: 'azure', region: 'East US',       status: 'running', cost: '$14/mo',  icon: Server, cpu: 0,  memory: 0,  owner: 'DevOps',        environment: 'production', health: 'healthy',  tags: ['monitoring'],    service: 'Azure Monitor'    },
  ],

  securityKpi: {
    totalRequests: '96,220',
    totalRequestsTrend: '4.1%',
    blockedRequests: '242',
    blockedRequestsTrend: '3.2%',
    blockRate: '0.25%',
    activeRules: 12,
  },

  attackTypes: [
    { label: 'Credential stuffing',  value: 89  },
    { label: 'DDoS attempt',         value: 67  },
    { label: 'Malicious bot',        value: 52  },
    { label: 'Port scanning',        value: 21  },
    { label: 'Privilege escalation', value: 13  },
  ],

  securityEvents: [
    { id: 'az-e1', time: '14:10', type: 'Identity',       severity: 'warning',  source: 'Azure AD',         rule: 'Defender: UnfamiliarSignInProperties', action: 'ALERT', country: 'RU', ip: '195.62.52.11',  detail: 'Sign-in from unfamiliar location for admin@cloudceo.io', cloud: 'azure', service: 'Azure AD', resource: 'admin@cloudceo.io', status: 'flagged', eventType: 'Identity' },
    { id: 'az-e2', time: '12:33', type: 'Network',        severity: 'warning',  source: 'Azure Firewall',   rule: 'DenyAll-InboundScan',                  action: 'DENY',  country: 'CN', ip: '203.0.113.200', detail: 'Port scan detected on 22, 443, 3389 from external IP', cloud: 'azure', service: 'Azure Firewall', resource: 'az-firewall-prod', status: 'blocked', eventType: 'Network' },
    { id: 'az-e3', time: '11:05', type: 'VM Security',    severity: 'warning',  source: 'Defender for VMs', rule: 'BruteForce:RDP',                       action: 'ALERT', country: 'BR', ip: '177.23.44.12',  detail: 'RDP brute-force attempt on prod-vm-east-02', cloud: 'azure', service: 'Virtual Machines', resource: 'prod-vm-east-02', status: 'flagged', eventType: 'VM Security' },
    { id: 'az-e4', time: '09:48', type: 'Data Security',  severity: 'warning',  source: 'Defender for SQL', rule: 'SQLi-Detection',                       action: 'ALERT', country: 'US', ip: '10.0.1.22',     detail: 'Potential SQL injection in stored procedure call', cloud: 'azure', service: 'SQL Database', resource: 'cloudceo-sql-prod', status: 'flagged', eventType: 'Data Security' },
    { id: 'az-e5', time: '08:15', type: 'Compliance',     severity: 'warning',  source: 'Security Center',  rule: 'StorageEncryptionPolicy',              action: 'FLAG',  country: 'US', ip: 'N/A',           detail: 'Blob container missing CMK encryption — policy violation', cloud: 'azure', service: 'Blob Storage', resource: 'cloudceo-storage-prod', status: 'flagged', eventType: 'Compliance' },
  ],

  blockedIps: [
    { ip: '195.62.52.11',  count: 89, country: 'RU', cloud: 'azure' },
    { ip: '203.0.113.200', count: 67, country: 'CN', cloud: 'azure' },
    { ip: '177.23.44.12',  count: 52, country: 'BR', cloud: 'azure' },
    { ip: '91.108.4.22',   count: 21, country: 'NL', cloud: 'azure' },
    { ip: '45.142.212.18', count: 13, country: 'DE', cloud: 'azure' },
  ],

  reports: [
    { id: 'az-exec', title: 'Q2 2026 Azure Executive Summary',        type: 'cost',       cloud: 'azure', date: 'Jun 28, 2026', pages: 14, status: 'ready', size: '2.2 MB', aiGenerated: true,  featured: true,  summary: 'AI-generated summary covering Azure total spend, VM scaling trends, Defender security posture, and 4 optimisation opportunities across your Azure estate.' },
    { id: 'az-r1',   title: 'Azure Monthly Cost Analysis',            type: 'cost',       cloud: 'azure', date: 'Jun 28, 2026', pages: 10, status: 'ready', size: '1.2 MB', aiGenerated: true  },
    { id: 'az-r2',   title: 'Defender for Cloud Security Assessment', type: 'security',   cloud: 'azure', date: 'Jun 27, 2026', pages: 8,  status: 'ready', size: '880 KB', aiGenerated: true  },
    { id: 'az-r3',   title: 'VM Utilisation & Rightsizing Report',    type: 'usage',      cloud: 'azure', date: 'Jun 25, 2026', pages: 6,  status: 'ready', size: '720 KB', aiGenerated: false },
    { id: 'az-r4',   title: 'Azure Policy Compliance Report',         type: 'compliance', cloud: 'azure', date: 'Jun 22, 2026', pages: 13, status: 'ready', size: '1.8 MB', aiGenerated: false },
    { id: 'az-r5',   title: 'Azure AD Identity Risk Assessment',      type: 'security',   cloud: 'azure', date: 'Jun 15, 2026', pages: 7,  status: 'ready', size: '940 KB', aiGenerated: false },
    { id: 'az-r6',   title: 'Azure Cost Forecast — Q3 2026',          type: 'cost',       cloud: 'azure', date: 'Jun 8, 2026',  pages: 6,  status: 'ready', size: '780 KB', aiGenerated: true  },
  ],

  resourceHealth: { healthy: 6, warning: 1, critical: 0 },
};
