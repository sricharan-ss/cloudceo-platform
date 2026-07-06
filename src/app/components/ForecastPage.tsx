import { TrendingUp, AlertTriangle } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const DAILY_DATA = [
  { day: 'Jun 1',  actual: 1320, projected: null },
  { day: 'Jun 5',  actual: 1480, projected: null },
  { day: 'Jun 10', actual: 1410, projected: null },
  { day: 'Jun 15', actual: 1590, projected: null },
  { day: 'Jun 20', actual: 1520, projected: null },
  { day: 'Jun 25', actual: 1380, projected: null },
  { day: 'Jun 28', actual: 1450, projected: 1450 },
  { day: 'Jun 30', actual: null, projected: 1490 },
  { day: 'Jul 2',  actual: null, projected: 1510 },
];

const DRIVERS = [
  { service: 'EC2',           current: 12450, projected: 14200, cloud: 'AWS',   change: 14.1, reason: 'Scheduled scale-up for Q3 load testing' },
  { service: 'RDS',           current: 6820,  projected: 7100,  cloud: 'AWS',   change: 4.1,  reason: 'Multi-AZ failover replica added' },
  { service: 'Azure VM',      current: 7340,  projected: 8100,  cloud: 'Azure', change: 10.4, reason: 'East US 2 autoscale triggered yesterday' },
  { service: 'S3',            current: 3210,  projected: 3400,  cloud: 'AWS',   change: 5.9,  reason: 'Log storage volume increasing' },
  { service: 'Cosmos DB',     current: 3010,  projected: 3010,  cloud: 'Azure', change: 0,    reason: 'Stable' },
];

interface ForecastPageProps {
  breadcrumbs: BreadcrumbItem[];
}

export function ForecastPage({ breadcrumbs }: ForecastPageProps) {
  const budget = 50000;
  const projected = 48900;
  const pctOfBudget = Math.round((projected / budget) * 100);

  return (
    <div style={{ fontFamily: 'var(--dash-font)', maxWidth: 960 }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Month-end forecast</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>$48,900</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge label="On track" severity="success" />
          <span style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>{pctOfBudget}% of $50,000 monthly budget · Based on Jun 1–28 spend</span>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Current spend',   value: '$42,310', sub: 'Jun 1–28 actual' },
          { label: 'Daily avg',       value: '$1,440',  sub: 'vs $1,613/day budget' },
          { label: 'Days remaining',  value: '2',       sub: 'of 30 billing days' },
          { label: 'Budget headroom', value: '$1,100',  sub: `${100 - pctOfBudget}% remaining` },
        ].map(c => (
          <div key={c.label} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Budget progress bar */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Budget utilisation</span>
          <span style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>$48,900 projected of $50,000 budget</span>
        </div>
        <div style={{ height: 8, backgroundColor: 'var(--dash-border-light)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: `${(42310 / 50000) * 100}%`, backgroundColor: 'var(--dash-success)', borderRadius: '999px 0 0 999px', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${((projected - 42310) / 50000) * 100}%`, backgroundColor: 'var(--dash-warning)', opacity: 0.6 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
          <LegendDot color="var(--dash-success)" label="Actual ($42.3k)" />
          <LegendDot color="var(--dash-warning)" label="Projected remaining ($6.6k)" />
          <LegendDot color="var(--dash-border-light)" label="Unused budget ($1.1k)" />
        </div>
      </div>

      {/* Daily spend chart */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6 }}>Daily cloud spend — June 2026</div>
        <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 20 }}>Solid line = actual · Dashed line = projected</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DAILY_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--dash-border-light)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }} axisLine={false} tickLine={false} width={48} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ fontSize: 12, border: '1px solid var(--dash-border)', borderRadius: 8, boxShadow: 'none' }} />
            <ReferenceLine y={1613} stroke="var(--dash-border)" strokeDasharray="4 3" label={{ value: 'Budget/day', position: 'right', fontSize: 10, fill: 'var(--dash-text-muted)' }} />
            <Line key="actual" type="monotone" dataKey="actual" stroke="var(--dash-accent)" strokeWidth={2} dot={false} connectNulls={false} />
            <Line key="projected" type="monotone" dataKey="projected" stroke="var(--dash-warning)" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cost drivers */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px 12px' }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>Projection drivers</div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>Services contributing to the forecast change from current spend</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)', borderTop: '1px solid var(--dash-border-light)' }}>
              {['Service', 'Cloud', 'Current', 'Projected', 'Change', 'Reason'].map(h => (
                <th key={h} style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DRIVERS.map((d, i) => (
              <tr key={d.service} style={{ borderBottom: i < DRIVERS.length - 1 ? '1px solid var(--dash-border-light)' : 'none', height: 52 }}>
                <td style={{ padding: '0 20px', fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{d.service}</td>
                <td style={{ padding: '0 20px', fontSize: 12, color: 'var(--dash-text-secondary)' }}>{d.cloud}</td>
                <td style={{ padding: '0 20px', fontSize: 14, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>${d.current.toLocaleString()}</td>
                <td style={{ padding: '0 20px', fontSize: 14, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>${d.projected.toLocaleString()}</td>
                <td style={{ padding: '0 20px' }}>
                  {d.change === 0 ? (
                    <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>—</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 500, color: d.change > 5 ? 'var(--dash-danger)' : 'var(--dash-warning)', fontVariantNumeric: 'tabular-nums' }}>
                      +{d.change}%
                    </span>
                  )}
                </td>
                <td style={{ padding: '0 20px', fontSize: 12, color: 'var(--dash-text-secondary)', maxWidth: 260 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: 'var(--dash-text-secondary)' }}>{label}</span>
    </div>
  );
}
