import { useState } from 'react';
import { Sparkles, TrendingDown, Shield, Zap, CheckCircle2, ArrowRight, Filter, RefreshCw } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface AiRecommendationsPageProps {
  breadcrumbs: BreadcrumbItem[];
}

type Category = 'all' | 'cost' | 'security' | 'performance' | 'reliability';
type Priority  = 'all' | 'critical' | 'high' | 'medium' | 'low';
type Cloud     = 'all' | 'aws' | 'azure';
type Status    = 'open' | 'dismissed' | 'applied';

interface Recommendation {
  id: string;
  category: Exclude<Category, 'all'>;
  priority: Exclude<Priority, 'all'>;
  cloud: Exclude<Cloud, 'all'>;
  title: string;
  description: string;
  impact: string;
  savings?: string;
  effort: 'low' | 'medium' | 'high';
  status: Status;
}

const RECS: Recommendation[] = [
  { id: 'r1',  category: 'cost',        priority: 'critical', cloud: 'aws',   title: '3 idle EC2 instances detected',          description: 'Instances i-0abc123, i-0def456, i-0ghi789 in us-east-1 have had 0% CPU for 14+ days and are incurring unnecessary costs.',   impact: 'High cost waste',       savings: '$847/mo',  effort: 'low',    status: 'open' },
  { id: 'r2',  category: 'security',    priority: 'critical', cloud: 'aws',   title: 'WAF rate limiting not configured',        description: 'The /api/auth endpoint has no rate limiting rule. This leaves it exposed to brute-force and credential stuffing attacks.',             impact: 'Critical exposure',     savings: undefined,  effort: 'low',    status: 'open' },
  { id: 'r3',  category: 'cost',        priority: 'high',     cloud: 'aws',   title: 'RDS overprovisioned — resize recommended', description: 'db.t3.large is consistently at 12% utilization. Downsizing to db.t3.medium maintains headroom with 62% less cost.',         impact: 'Compute right-sizing',  savings: '$312/mo',  effort: 'medium', status: 'open' },
  { id: 'r4',  category: 'cost',        priority: 'high',     cloud: 'azure', title: 'Azure VMs running during off-hours',      description: '4 VMs in East US are running 24/7 but show zero traffic outside business hours (08:00–18:00 UTC). Auto-shutdown recommended.',  impact: 'Scheduling opportunity',savings: '$428/mo',  effort: 'low',    status: 'open' },
  { id: 'r5',  category: 'security',    priority: 'high',     cloud: 'aws',   title: 'S3 bucket public access not fully blocked', description: 'Bucket "acme-prod-assets" has a policy allowing s3:GetObject from *. Confirm this is intentional or restrict immediately.',   impact: 'Potential data exposure',savings: undefined,  effort: 'low',    status: 'open' },
  { id: 'r6',  category: 'performance', priority: 'medium',   cloud: 'aws',   title: 'CloudFront cache hit rate is 42%',        description: 'Target hit rate is 80%+. Increasing TTL values and adding cache headers to /api/products responses can dramatically improve this.',  impact: '32% latency reduction',  savings: undefined,  effort: 'medium', status: 'open' },
  { id: 'r7',  category: 'cost',        priority: 'medium',   cloud: 'aws',   title: 'S3 lifecycle policies not configured',    description: '12 buckets storing logs older than 90 days lack lifecycle policies. Moving to Glacier after 30 days saves significantly.',            impact: 'Storage tiering',       savings: '$95/mo',   effort: 'low',    status: 'open' },
  { id: 'r8',  category: 'reliability', priority: 'medium',   cloud: 'aws',   title: 'No Multi-AZ for production RDS',         description: 'Your primary RDS instance is Single-AZ. A hardware failure could cause 20–30 minutes of downtime. Enable Multi-AZ for HA.',         impact: 'Single point of failure',savings: undefined,  effort: 'medium', status: 'open' },
  { id: 'r9',  category: 'security',    priority: 'medium',   cloud: 'azure', title: 'MFA not enforced for 3 IAM users',       description: 'Users marcus.webb, priya.patel, and one service account do not have MFA enabled. Enforce immediately under your security policy.',    impact: 'Account takeover risk',  savings: undefined,  effort: 'low',    status: 'open' },
  { id: 'r10', category: 'cost',        priority: 'low',      cloud: 'azure', title: 'Unused DynamoDB tables to delete',       description: '5 DynamoDB tables have had 0 reads or writes for 60 days. Deleting them removes $28/month in read/write capacity charges.',          impact: 'Storage cleanup',       savings: '$28/mo',   effort: 'low',    status: 'open' },
  { id: 'r11', category: 'performance', priority: 'low',      cloud: 'azure', title: 'Azure Storage using LRS instead of ZRS',  description: 'Production storage accounts use Locally Redundant Storage. Zone-Redundant Storage provides better availability at a small premium.',      impact: 'Availability improvement',savings: undefined, effort: 'medium', status: 'open' },
  { id: 'r12', category: 'reliability', priority: 'low',      cloud: 'aws',   title: 'No backup retention policy on Lambda',   description: '7 Lambda functions have no versioning or rollback policy. A bad deployment has no safe recovery path.',                               impact: 'Deployment safety',      savings: undefined,  effort: 'low',    status: 'open' },
];

const CAT_ICONS: Record<Exclude<Category, 'all'>, React.ElementType> = {
  cost:        TrendingDown,
  security:    Shield,
  performance: Zap,
  reliability: CheckCircle2,
};

const CAT_COLORS: Record<Exclude<Category, 'all'>, string> = {
  cost:        'var(--dash-success)',
  security:    'var(--dash-danger)',
  performance: 'var(--dash-accent)',
  reliability: 'var(--dash-warning)',
};

const CAT_BG: Record<Exclude<Category, 'all'>, string> = {
  cost:        'var(--dash-success-tint)',
  security:    'var(--dash-danger-tint)',
  performance: 'var(--dash-accent-tint)',
  reliability: 'var(--dash-warning-tint)',
};

export function AiRecommendationsPage({ breadcrumbs }: AiRecommendationsPageProps) {
  const [category, setCategory] = useState<Category>('all');
  const [priority, setPriority] = useState<Priority>('all');
  const [cloud, setCloud]       = useState<Cloud>('all');
  const [applied, setApplied]   = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const filtered = RECS.filter(r => {
    if (dismissed.has(r.id)) return false;
    if (category !== 'all' && r.category !== category) return false;
    if (priority  !== 'all' && r.priority  !== priority)  return false;
    if (cloud     !== 'all' && r.cloud     !== cloud)     return false;
    return true;
  });

  const totalSavings = filtered.reduce((sum, r) => {
    const n = r.savings ? parseInt(r.savings.replace(/[^0-9]/g, '')) : 0;
    return sum + n;
  }, 0);

  const criticalCount = filtered.filter(r => r.priority === 'critical').length;
  const openCount     = filtered.filter(r => !applied.has(r.id)).length;

  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={15} color="var(--dash-accent)" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Recommendations</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--dash-text-primary)' }}>Actionable cloud improvements</div>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', marginTop: 4 }}>Generated from 30-day usage and security analysis · Updated 5 min ago</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', flexShrink: 0 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16, marginBottom: 24 }}>
        {[
          { label: 'Open items',         value: openCount.toString(),     color: 'var(--dash-text-primary)' },
          { label: 'Critical priority',  value: criticalCount.toString(), color: 'var(--dash-danger)'       },
          { label: 'Est. monthly savings', value: `$${totalSavings.toLocaleString()}`, color: 'var(--dash-success)' },
          { label: 'Applied',            value: applied.size.toString(),  color: 'var(--dash-accent)'       },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: isMobile ? '14px 14px' : '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: isMobile ? 8 : 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--dash-text-muted)' }}>
            <Filter size={13} /> Filter
          </div>

          <FilterGroup label="Category" options={['all', 'cost', 'security', 'performance', 'reliability']} value={category}
            labels={{ all: 'All', cost: 'Cost', security: 'Security', performance: 'Performance', reliability: 'Reliability' }}
            onChange={v => setCategory(v as Category)} />

          {!isMobile && <Divider />}

          <FilterGroup label="Priority" options={['all', 'critical', 'high', 'medium', 'low']} value={priority}
            labels={{ all: 'All', critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }}
            onChange={v => setPriority(v as Priority)} />

          {!isMobile && <Divider />}

          <FilterGroup label="Cloud" options={['all', 'aws', 'azure']} value={cloud}
            labels={{ all: 'All', aws: 'AWS', azure: 'Azure' }}
            onChange={v => setCloud(v as Cloud)} />
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 14 }}>
        Showing {filtered.length} recommendation{filtered.length !== 1 ? 's' : ''}
        {applied.size > 0 && ` · ${applied.size} applied`}
        {dismissed.size > 0 && ` · ${dismissed.size} dismissed`}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 48, textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--dash-success)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6 }}>All clear for this filter</div>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>No open recommendations match the current filters.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 16 }}>
          {filtered.map(rec => (
            <RecCard
              key={rec.id}
              rec={rec}
              isApplied={applied.has(rec.id)}
              onApply={() => setApplied(prev => new Set([...prev, rec.id]))}
              onDismiss={() => setDismissed(prev => new Set([...prev, rec.id]))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Recommendation card ───────────────────────────────────────── */

function RecCard({ rec, isApplied, onApply, onDismiss }: {
  rec: Recommendation; isApplied: boolean; onApply: () => void; onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CAT_ICONS[rec.category];
  const prioritySev: Record<string, 'danger' | 'warning' | 'success'> = { critical: 'danger', high: 'warning', medium: 'warning', low: 'success' };
  const effortLabel: Record<string, string> = { low: 'Quick fix', medium: 'Some effort', high: 'Complex' };

  return (
    <div
      style={{
        backgroundColor: isApplied ? 'var(--dash-success-tint)' : 'var(--dash-bg-surface)',
        border: `1px solid ${isApplied ? 'var(--dash-success)' : 'var(--dash-border)'}`,
        borderRadius: 'var(--dash-radius-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Category strip */}
      <div style={{ height: 3, backgroundColor: CAT_COLORS[rec.category] }} />

      <div style={{ padding: '18px 18px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: CAT_BG[rec.category], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={15} color={CAT_COLORS[rec.category]} strokeWidth={1.5} />
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <StatusBadge label={rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} severity={prioritySev[rec.priority] || 'success'} />
            <CloudBadge variant={rec.cloud} />
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', lineHeight: 1.4, marginBottom: 8 }}>{rec.title}</div>

        {/* Description */}
        <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 12 }}>
          {expanded ? rec.description : `${rec.description.slice(0, 90)}…`}
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: 'var(--dash-accent)', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'var(--dash-font)' }}>
            {expanded ? ' less' : ' more'}
          </button>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          {rec.savings && (
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-success)', backgroundColor: 'var(--dash-success-tint)', padding: '3px 8px', borderRadius: 999, fontVariantNumeric: 'tabular-nums' }}>
              Save {rec.savings}
            </span>
          )}
          <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', padding: '3px 8px', borderRadius: 999, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)' }}>
            {effortLabel[rec.effort]}
          </span>
          <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>{rec.impact}</span>
        </div>

        {/* Actions */}
        {isApplied ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--dash-success)' }}>
            <CheckCircle2 size={15} /> Applied
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onApply}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 'var(--dash-radius-button)', border: 'none',
                backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              Apply <ArrowRight size={13} />
            </button>
            <button
              onClick={onDismiss}
              style={{
                padding: '8px 14px', borderRadius: 'var(--dash-radius-button)',
                border: '1px solid var(--dash-border)', background: 'none',
                fontSize: 13, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)',
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function FilterGroup({ label, options, value, labels, onChange }: {
  label: string; options: string[]; value: string; labels: Record<string, string>; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            border: `1px solid ${value === opt ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
            backgroundColor: value === opt ? 'var(--dash-accent-tint)' : 'transparent',
            color: value === opt ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
            fontFamily: 'var(--dash-font)', transition: 'all 0.12s ease', whiteSpace: 'nowrap',
          }}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, backgroundColor: 'var(--dash-border)', flexShrink: 0 }} />;
}
