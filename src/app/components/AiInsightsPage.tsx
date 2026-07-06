import { useState } from 'react';
import {
  Sparkles, TrendingDown, Shield, Cpu, Activity, BarChart2,
  CheckCircle2, Battery, Zap, RefreshCw, ChevronRight,
  AlertTriangle, TrendingUp, ArrowRight, ExternalLink,
} from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface AiInsightsPageProps { breadcrumbs: BreadcrumbItem[] }

/* ── Sparkline ── */
function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1;
  const w = 80, h = 30;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── Confidence bar ── */
function ConfidenceBar({ value, color = 'var(--dash-accent)' }: { value: number; color?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: 'var(--dash-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI confidence</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-primary)' }}>{value}%</span>
      </div>
      <div style={{ height: 4, backgroundColor: 'var(--dash-border-light)', borderRadius: 999 }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 999, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

/* ── Insight data ── */
interface Insight {
  id: string;
  category: string;
  icon: React.ElementType;
  severity: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  problem: string;
  whyItMatters: string;
  affectedResources: Array<{ name: string; cloud: 'aws' | 'azure' }>;
  confidence: number;
  impact: string;
  nextAction: string;
  sparkValues?: number[];
  sparkColor?: string;
  metric?: { label: string; value: string };
}

const INSIGHTS: Insight[] = [
  {
    id: 'i1', category: 'Cost Optimization', icon: TrendingDown, severity: 'warning',
    title: '$1,712/month in identified savings',
    problem: 'Analysis of 30-day usage data found 3 idle EC2 instances, overprovisioned RDS, and unoptimised S3 storage all contributing to avoidable spend.',
    whyItMatters: 'At current trajectory, annual overspend exceeds $20,000 — budget that could fund 2 additional cloud-native services.',
    affectedResources: [{ name: 'i-0abc123 (EC2)', cloud: 'aws' }, { name: 'db.t3.large (RDS)', cloud: 'aws' }, { name: 'cloudceo-logs (S3)', cloud: 'aws' }],
    confidence: 92,
    impact: 'Est. $1,712/month reduction',
    nextAction: 'View cost recommendations',
    sparkValues: [2800,2750,2900,3100,3200,3050,2980],
    sparkColor: 'var(--dash-warning)',
    metric: { label: 'Overspend this month', value: '$1,712' },
  },
  {
    id: 'i2', category: 'Security Risks', icon: Shield, severity: 'danger',
    title: '2 critical vulnerabilities require immediate action',
    problem: 'WAF rate limiting is not configured on /api/auth, and an S3 bucket allows public read access. Both represent active attack surfaces.',
    whyItMatters: 'Unprotected authentication endpoints are a primary vector for credential stuffing attacks. The public S3 bucket may expose sensitive billing data.',
    affectedResources: [{ name: '/api/auth (WAF)', cloud: 'aws' }, { name: 'cloudceo-prod-assets (S3)', cloud: 'aws' }],
    confidence: 98,
    impact: 'Critical exposure — immediate risk',
    nextAction: 'Open security dashboard',
    sparkValues: [0,0,1,1,1,2,2],
    sparkColor: 'var(--dash-danger)',
    metric: { label: 'Critical risks', value: '2' },
  },
  {
    id: 'i3', category: 'Resource Utilisation', icon: Cpu, severity: 'warning',
    title: 'Average CPU utilisation is 38% across fleet',
    problem: 'EC2 fleet averages 38% CPU and RDS averages 12% CPU over the past 30 days. Significant overprovisioning detected across production.',
    whyItMatters: 'Right-sizing to actual workload demand would reduce compute costs by approximately 40% while maintaining performance headroom.',
    affectedResources: [{ name: 'prod-ec2-cluster (6 instances)', cloud: 'aws' }, { name: 'db.t3.large', cloud: 'aws' }],
    confidence: 87,
    impact: 'Est. $420/month savings',
    nextAction: 'View right-sizing guide',
    sparkValues: [42,40,38,39,37,36,38],
    sparkColor: 'var(--dash-warning)',
    metric: { label: 'Avg CPU', value: '38%' },
  },
  {
    id: 'i4', category: 'Infrastructure Health', icon: Activity, severity: 'success',
    title: 'Cloud health score: 78/100 — moderate risk',
    problem: 'Health score is moderate, dragged down by missing Multi-AZ for production RDS, no Lambda versioning policy, and WAF gaps.',
    whyItMatters: 'Infrastructure gaps create potential single points of failure. Resolving the top 3 issues would raise the score to 91/100.',
    affectedResources: [{ name: 'rds-prod-primary', cloud: 'aws' }, { name: '7 Lambda functions', cloud: 'aws' }],
    confidence: 90,
    impact: 'Score can reach 91/100',
    nextAction: 'View health report',
    sparkValues: [72,74,73,75,76,77,78],
    sparkColor: 'var(--dash-success)',
    metric: { label: 'Health score', value: '78/100' },
  },
  {
    id: 'i5', category: 'Performance Trends', icon: BarChart2, severity: 'warning',
    title: 'CloudFront cache hit rate at 42% (target: 80%+)',
    problem: 'Cache hit rate has declined from 68% to 42% over 2 weeks, causing increased origin requests and higher data transfer costs.',
    whyItMatters: 'A 42% hit rate means 58% of requests hit the origin server, increasing latency by ~180ms for international users and adding $68/month in data transfer costs.',
    affectedResources: [{ name: 'cloudceo-cdn (CloudFront)', cloud: 'aws' }, { name: '/api/products endpoint', cloud: 'aws' }],
    confidence: 85,
    impact: 'Performance + $68/mo cost',
    nextAction: 'Optimise cache settings',
    sparkValues: [68,65,62,58,52,46,42],
    sparkColor: 'var(--dash-warning)',
    metric: { label: 'Cache hit rate', value: '42%' },
  },
  {
    id: 'i6', category: 'Compliance Status', icon: CheckCircle2, severity: 'danger',
    title: '3 policy violations detected in this billing period',
    problem: 'MFA not enforced for 3 IAM users, session timeout policy not applied organisation-wide, and one storage account lacks customer-managed encryption.',
    whyItMatters: 'These violations may breach SOC 2 Type II and ISO 27001 requirements currently under your organisation\'s compliance framework.',
    affectedResources: [{ name: 'marcus.webb (IAM)', cloud: 'aws' }, { name: 'priya.patel (IAM)', cloud: 'aws' }, { name: 'cloudceo-storage-02 (Azure)', cloud: 'azure' }],
    confidence: 96,
    impact: 'SOC 2 / ISO 27001 risk',
    nextAction: 'Open compliance report',
    metric: { label: 'Policy violations', value: '3' },
  },
  {
    id: 'i7', category: 'Capacity Forecast', icon: TrendingUp, severity: 'warning',
    title: 'EC2 capacity will reach 85% by mid-August 2026',
    problem: 'Based on 90-day growth trends, the production EC2 cluster will hit 85% capacity by August 14 without intervention.',
    whyItMatters: 'At 85% capacity, auto-scaling events will increase frequency and cost. Pre-purchasing Reserved Instances now saves 35–40% vs on-demand.',
    affectedResources: [{ name: 'prod-ec2-cluster (us-east-1)', cloud: 'aws' }],
    confidence: 83,
    impact: 'Capacity risk in 46 days',
    nextAction: 'Plan capacity upgrade',
    sparkValues: [60,63,65,68,71,74,78],
    sparkColor: 'var(--dash-warning)',
    metric: { label: 'Current utilisation', value: '78%' },
  },
  {
    id: 'i8', category: 'Sustainability', icon: Battery, severity: 'success',
    title: 'Estimated carbon score: B+ · 14% below industry avg',
    problem: 'CloudCEO estimates your environment runs at approximately 68 kg CO₂e/month — 14% below the SaaS industry average for comparable workloads.',
    whyItMatters: 'Moving 3 Azure VMs to East US (cleaner grid) and enabling S3 Intelligent-Tiering would further reduce estimated emissions by 8%.',
    affectedResources: [{ name: 'East US VMs (3)', cloud: 'azure' }, { name: 'cloudceo-logs (S3)', cloud: 'aws' }],
    confidence: 72,
    impact: 'Below industry average',
    nextAction: 'View sustainability report',
    sparkValues: [75,73,71,70,69,68,68],
    sparkColor: 'var(--dash-success)',
    metric: { label: 'CO₂e/month', value: '68 kg' },
  },
];

const SEV_ICON: Record<string, React.ElementType> = {
  danger: AlertTriangle, warning: Zap, success: CheckCircle2, info: Sparkles,
};

const SEV_LABEL: Record<string, string> = {
  danger: 'Critical', warning: 'Attention', success: 'Good', info: 'Info',
};

export function AiInsightsPage({ breadcrumbs }: AiInsightsPageProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const toggle = (id: string) => setExpanded(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const gridCols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr';

  return (
    <div style={{ fontFamily: 'var(--dash-font)', maxWidth: 1100, margin: '0 auto' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={17} color="var(--dash-accent)" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text-primary)' }}>AI Insights</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>Auto-generated from AWS + Azure analysis · Updated 5 min ago · 8 insights across 8 categories</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Executive summary card ── */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: isMobile ? '18px 18px' : '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={16} color="var(--dash-accent)" strokeWidth={1.5} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Executive Summary</span>
        </div>
        <p style={{ fontSize: 15, color: 'var(--dash-text-primary)', lineHeight: 1.75, margin: '0 0 20px', fontWeight: 400 }}>
          Your cloud environment is operating at <strong>78% health</strong> across AWS and Azure. AWS costs increased <strong>14% this week</strong> primarily driven by EC2 and Lambda auto-scaling. <strong>2 critical security vulnerabilities</strong> — an unprotected authentication endpoint and a publicly accessible S3 bucket — require immediate remediation. On the positive side, your sustainability score of <strong>B+</strong> places you 14% below the industry average for comparable workloads. CloudCEO AI has identified <strong>$1,712/month in actionable savings</strong> across 12 specific recommendations.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Health score', value: '78/100', color: 'var(--dash-success)'   },
            { label: 'Critical risks', value: '2',       color: 'var(--dash-danger)'  },
            { label: 'Est. savings',  value: '$1,712/mo', color: 'var(--dash-success)'  },
            { label: 'Insights generated', value: '8',  color: 'var(--dash-accent)'  },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Insight cards grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 16 }}>
        {INSIGHTS.map(ins => {
          const Icon = ins.icon;
          const SevIcon = SEV_ICON[ins.severity];
          const isExpanded = expanded.has(ins.id);
          const sevColor = {
            danger: 'var(--dash-danger)', warning: 'var(--dash-warning)',
            success: 'var(--dash-success)', info: 'var(--dash-accent)',
          }[ins.severity];
          const sevBg = {
            danger: 'var(--dash-danger-tint)', warning: 'var(--dash-warning-tint)',
            success: 'var(--dash-success-tint)', info: 'var(--dash-accent-tint)',
          }[ins.severity];

          return (
            <div
              key={ins.id}
              style={{
                backgroundColor: 'var(--dash-bg-surface)',
                border: `1px solid var(--dash-border)`,
                borderRadius: 'var(--dash-radius-card)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Top strip */}
              <div style={{ height: 3, backgroundColor: sevColor }} />

              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Category + badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: sevBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={sevColor} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ins.category}</span>
                  </div>
                  <StatusBadge label={SEV_LABEL[ins.severity]} severity={ins.severity === 'info' ? 'success' : ins.severity === 'success' ? 'success' : ins.severity} />
                </div>

                {/* Title */}
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', lineHeight: 1.4, marginBottom: 10 }}>{ins.title}</div>

                {/* Metric + sparkline */}
                {(ins.metric || ins.sparkValues) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                    {ins.metric && (
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{ins.metric.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: sevColor, fontVariantNumeric: 'tabular-nums' }}>{ins.metric.value}</div>
                      </div>
                    )}
                    {ins.sparkValues && ins.sparkColor && (
                      <Spark values={ins.sparkValues} color={ins.sparkColor} />
                    )}
                  </div>
                )}

                {/* Problem */}
                <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
                  {ins.problem}
                </div>

                {/* Expandable details */}
                {isExpanded && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Why it matters</div>
                    <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>{ins.whyItMatters}</div>

                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Affected resources</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
                      {ins.affectedResources.map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <CloudBadge variant={r.cloud} />
                          <span style={{ fontSize: 12, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace' }}>{r.name}</span>
                        </div>
                      ))}
                    </div>

                    <ConfidenceBar value={ins.confidence} color={sevColor} />
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--dash-text-muted)' }}>Business impact: <span style={{ fontWeight: 500, color: 'var(--dash-text-primary)' }}>{ins.impact}</span></div>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                  <button
                    onClick={() => toggle(ins.id)}
                    style={{ fontSize: 12, color: 'var(--dash-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                  >
                    {isExpanded ? 'Show less ↑' : 'Show details ↓'}
                  </button>
                  <button style={{ width: '100%', padding: '9px 0', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {ins.nextAction} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
