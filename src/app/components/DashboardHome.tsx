import { useState } from 'react';
import {
  Shield, ChevronDown, ChevronUp, Calendar, Sparkles,
  FileText, Cloud, Lightbulb, RefreshCw, Activity,
  TrendingDown, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle2, Server, BarChart2, ArrowRight, Clock,
  Zap, ChevronRight,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { SpendTrendChart } from './SpendTrendChart';
import { HorizontalBarChart } from './HorizontalBarChart';
import { TopServicesTable, SERVICES } from './TopServicesTable';
import { SecurityAlertsTable } from './SecurityAlertsTable';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { AppRouteId } from '../routes';

/* ─── Data ───────────────────────────────────────────────────────── */
const AWS_VS_AZURE = [
  { label: 'AWS',   value: 27840, cloud: 'aws'   as const },
  { label: 'Azure', value: 14470, cloud: 'azure' as const },
];

const ALERTS_DATA = [
  { description: 'SQL injection attempt blocked',        severity: 'danger'  as const, time: '2h ago' },
  { description: 'Unusual traffic spike from single IP', severity: 'warning' as const, time: '5h ago' },
  { description: 'Rate limit exceeded on /api/checkout', severity: 'warning' as const, time: '1d ago' },
];

const AI_INSIGHTS = [
  { icon: TrendingDown, text: '$1,712/mo in savings identified across 12 items',      sev: 'warning' as const },
  { icon: Shield,       text: '2 critical WAF vulnerabilities require immediate action', sev: 'danger'  as const },
  { icon: Server,       text: 'EC2 fleet averaging 38% CPU — right-sizing recommended', sev: 'warning' as const },
  { icon: TrendingUp,   text: 'EC2 capacity forecast to hit 85% by mid-August',        sev: 'warning' as const },
];

const QUICK_ACTIONS = [
  { icon: FileText,   label: 'Generate report',      desc: 'AI cloud analysis',     accent: 'var(--dash-accent)',   screen: 'reports'   as AppRouteId },
  { icon: Sparkles,   label: 'Open AI assistant',    desc: 'Ask anything',          accent: 'var(--dash-accent)',   screen: null                  },
  { icon: Shield,     label: 'Security risks',       desc: '2 critical items',      accent: 'var(--dash-danger)',   screen: 'security'  as AppRouteId },
  { icon: Lightbulb,  label: 'Recommendations',      desc: '$1,712/mo savings',     accent: 'var(--dash-warning)',  screen: null                  },
  { icon: Cloud,      label: 'Cloud resources',      desc: '12 total resources',    accent: 'var(--dash-success)',  screen: 'resources' as AppRouteId },
];

const ACTIVITY = [
  { icon: Zap,         text: 'EC2 auto-scaling event triggered — 3 instances added',    time: '14:23', type: 'infra',    cloud: 'aws'   as const, sev: 'warning' as const  },
  { icon: Shield,      text: 'SQL injection attempt blocked on /api/checkout',           time: '12:07', type: 'security', cloud: 'aws'   as const, sev: 'danger'  as const  },
  { icon: Sparkles,    text: 'CloudCEO AI analysis completed — 5 new insights',         time: '11:30', type: 'ai',       cloud: undefined,        sev: undefined             },
  { icon: FileText,    text: 'Monthly cost report generated successfully',               time: '10:00', type: 'report',   cloud: undefined,        sev: undefined             },
  { icon: DollarSign,  text: 'AWS budget alert — 85% of monthly limit reached',         time: '09:15', type: 'cost',     cloud: 'aws'   as const, sev: 'warning' as const  },
  { icon: RefreshCw,   text: 'Azure data sync completed — 346 resources updated',       time: '08:00', type: 'cloud',    cloud: 'azure' as const, sev: undefined             },
];

const RESOURCE_HEALTH = {
  healthy:  { aws: 8, azure: 6, total: 14 },
  warning:  { aws: 2, azure: 1, total: 3  },
  critical: { aws: 1, azure: 0, total: 1  },
};

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function AiExecutiveSummary({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{
      backgroundColor: 'var(--dash-bg-surface)',
      border: '1px solid var(--dash-border)',
      borderRadius: 'var(--dash-radius-card)',
      padding: isMobile ? '16px 16px' : '20px 24px',
      marginBottom: isMobile ? 16 : 24,
      transition: 'box-shadow 0.15s ease',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={13} color="var(--dash-accent)" strokeWidth={1.5} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: 'var(--dash-font)' }}>
          AI Executive Summary
        </span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto', fontFamily: 'var(--dash-font)' }}>Updated 5 min ago</span>
      </div>

      <p style={{ fontSize: isMobile ? 13 : 15, color: 'var(--dash-text-primary)', lineHeight: 1.75, marginBottom: 14, fontFamily: 'var(--dash-font)', fontWeight: 400 }}>
        {getGreeting()}, Srikanth. Your cloud infrastructure is operating at <strong>78/100 health</strong> across AWS and Azure today.
        AWS costs increased 14% this week driven by EC2 auto-scaling.{' '}
        <strong style={{ color: 'var(--dash-danger)' }}>2 critical security vulnerabilities</strong> require immediate attention.
        CloudCEO AI has identified <strong style={{ color: 'var(--dash-success)' }}>$1,712/month in optimization savings</strong> across 12 recommendations.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: '78/100 health',        color: 'var(--dash-success)',  bg: 'var(--dash-success-tint)' },
          { label: '$1,712/mo savings',    color: 'var(--dash-success)',  bg: 'var(--dash-success-tint)' },
          { label: '2 critical risks',     color: 'var(--dash-danger)',   bg: 'var(--dash-danger-tint)'  },
          { label: 'EC2 costs +14%',       color: 'var(--dash-warning)',  bg: 'var(--dash-warning-tint)' },
          { label: '12 recommendations',  color: 'var(--dash-accent)',   bg: 'var(--dash-accent-tint)'  },
        ].map((b, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, backgroundColor: b.bg, color: b.color, fontFamily: 'var(--dash-font)' }}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

function AiInsightsWidget() {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles size={14} color="var(--dash-accent)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>CloudCEO AI Observations</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--dash-success)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
          <span style={{ fontSize: 10, color: 'var(--dash-success)', fontFamily: 'var(--dash-font)' }}>Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {AI_INSIGHTS.map((ins, i) => {
          const Icon = ins.icon;
          const sevColor = ins.sev === 'danger' ? 'var(--dash-danger)' : 'var(--dash-warning)';
          const sevBg    = ins.sev === 'danger' ? 'var(--dash-danger-tint)' : 'var(--dash-warning-tint)';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', backgroundColor: sevBg, borderRadius: 8, border: `1px solid ${sevColor}20`, transition: 'transform 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
              <Icon size={14} color={sevColor} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: 'var(--dash-text-primary)', lineHeight: 1.5, fontFamily: 'var(--dash-font)' }}>{ins.text}</span>
            </div>
          );
        })}
      </div>

      <button style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--dash-font)' }}>
        View all in AI panel <ChevronRight size={12} />
      </button>
    </div>
  );
}

function QuickActionsPanel({ onNavigate, isMobile }: { onNavigate?: (s: AppRouteId) => void; isMobile?: boolean }) {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 14, fontFamily: 'var(--dash-font)' }}>Quick actions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={i}
              onClick={() => a.screen && onNavigate?.(a.screen)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '11px 12px', borderRadius: 10, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--dash-font)', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = a.accent; el.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--dash-border)'; el.style.transform = 'none'; }}
            >
              <div style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: `${a.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color={a.accent} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-primary)', lineHeight: 1.3 }}>{a.label}</div>
                <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', marginTop: 1 }}>{a.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivityTimeline({ isMobile }: { isMobile?: boolean }) {
  const typeColors: Record<string, string> = { security: 'var(--dash-danger)', cost: 'var(--dash-warning)', ai: 'var(--dash-accent)', report: 'var(--dash-success)', infra: 'var(--dash-neutral-chart)', cloud: 'var(--dash-text-muted)' };
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Activity size={14} color="var(--dash-text-secondary)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>Recent activity</span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto', fontFamily: 'var(--dash-font)' }}>Today · Jun 28, 2026</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ACTIVITY.map((a, i) => {
          const Icon = a.icon;
          const color = typeColors[a.type] || 'var(--dash-text-muted)';
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, marginBottom: 12, borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--dash-border-light)' : 'none', cursor: 'pointer', transition: 'opacity 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
              {/* Timeline dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={10} color={color} strokeWidth={2} />
                </div>
                {i < ACTIVITY.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, backgroundColor: 'var(--dash-border-light)', marginTop: 4 }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--dash-text-primary)', lineHeight: 1.4, fontFamily: 'var(--dash-font)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.text}</span>
                  <span style={{ fontSize: 10, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'var(--dash-font)' }}>{a.time}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
                  {a.sev && <StatusBadge label={a.sev === 'danger' ? 'Critical' : 'Warning'} severity={a.sev} />}
                  {a.cloud && <CloudBadge variant={a.cloud} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResourceHealthOverview({ isMobile }: { isMobile?: boolean }) {
  const total = RESOURCE_HEALTH.healthy.total + RESOURCE_HEALTH.warning.total + RESOURCE_HEALTH.critical.total;
  const healthPct  = (RESOURCE_HEALTH.healthy.total / total) * 100;
  const warningPct = (RESOURCE_HEALTH.warning.total / total) * 100;
  const critPct    = (RESOURCE_HEALTH.critical.total / total) * 100;

  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Server size={14} color="var(--dash-text-secondary)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>Resource health</span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto', fontFamily: 'var(--dash-font)' }}>{total} total</span>
      </div>

      {/* Stacked bar */}
      <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
        <div style={{ width: `${healthPct}%`, backgroundColor: 'var(--dash-success)', transition: 'width 0.4s ease' }} />
        <div style={{ width: `${warningPct}%`, backgroundColor: 'var(--dash-warning)', transition: 'width 0.4s ease' }} />
        <div style={{ width: `${critPct}%`, backgroundColor: 'var(--dash-danger)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Legend rows */}
      {[
        { label: 'Healthy',  count: RESOURCE_HEALTH.healthy,  color: 'var(--dash-success)', sev: 'success' as const },
        { label: 'Warning',  count: RESOURCE_HEALTH.warning,  color: 'var(--dash-warning)', sev: 'warning' as const },
        { label: 'Critical', count: RESOURCE_HEALTH.critical, color: 'var(--dash-danger)',  sev: 'danger'  as const },
      ].map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 2 ? '1px solid var(--dash-border-light)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: row.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{row.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontFamily: 'var(--dash-font)' }}>AWS <strong style={{ color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.count.aws}</strong></span>
              <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontFamily: 'var(--dash-font)' }}>Azure <strong style={{ color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.count.azure}</strong></span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: row.color, width: 24, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--dash-font)' }}>{row.count.total}</div>
          </div>
        </div>
      ))}

      <button style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--dash-font)' }}>
        View all resources <ChevronRight size={12} />
      </button>
    </div>
  );
}

function AwsVsAzureChart() {
  return (
    <HorizontalBarChart
      title="AWS vs Azure"
      items={AWS_VS_AZURE}
      labelWidth={50}
      summaryLine={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>Combined: $42.3k this month</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <ChevronDown size={12} color="var(--dash-success)" />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-success)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--dash-font)' }}>10.2%</span>
            <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', fontFamily: 'var(--dash-font)' }}>vs last month</span>
          </div>
        </div>
      }
    />
  );
}

/* ─── Desktop layout ─────────────────────────────────────────────── */
function DashboardDesktop({ onNavigate }: { onNavigate?: (s: AppRouteId) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AiExecutiveSummary isMobile={false} />

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Total cloud spend"    value="$42,310" trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard label="Projected month-end"  value="$48,900" badge={<StatusBadge label="On track" severity="success" />} onClick={() => onNavigate?.('forecast')} />
        <StatCard label="Blocked threats (7d)" value="1,284"   trend={{ direction: 'down', percentage: '6.8%', label: 'vs prev 7 days', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard label="Open security alerts" value="3"       valueSize={32} badge={<StatusBadge label="1 critical" severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      {/* AI assistant highlights + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <AiInsightsWidget />
        <QuickActionsPanel onNavigate={onNavigate} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <SpendTrendChart months={6} view="combined" />
        <AwsVsAzureChart />
      </div>

      {/* Activity + Resource Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <RecentActivityTimeline />
        <ResourceHealthOverview />
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TopServicesTable />
        <SecurityAlertsTable />
      </div>
    </div>
  );
}

/* ─── Tablet layout ──────────────────────────────────────────────── */
function DashboardTablet({ onNavigate }: { onNavigate?: (s: AppRouteId) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AiExecutiveSummary isMobile={false} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <StatCard label="Total cloud spend"    value="$42,310" trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard label="Projected month-end"  value="$48,900" badge={<StatusBadge label="On track" severity="success" />} />
        <StatCard label="Blocked threats (7d)" value="1,284"   trend={{ direction: 'down', percentage: '6.8%', label: 'vs prev 7d', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard label="Open security alerts" value="3"       valueSize={32} badge={<StatusBadge label="1 critical" severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      <AiInsightsWidget />
      <QuickActionsPanel onNavigate={onNavigate} />
      <SpendTrendChart months={6} view="combined" />
      <AwsVsAzureChart />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <RecentActivityTimeline />
        <ResourceHealthOverview />
      </div>

      <TopServicesTable compact />
      <SecurityAlertsTable />
    </div>
  );
}

/* ─── Mobile layout ──────────────────────────────────────────────── */
function DashboardMobile({ onNavigate }: { onNavigate?: (s: AppRouteId) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-space-2xl)' }}>
      {/* Date picker */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
          <Calendar size={13} color="var(--dash-text-secondary)" />
          This month
          <ChevronDown size={12} color="var(--dash-text-secondary)" />
        </button>
      </div>

      <AiExecutiveSummary isMobile />

      {/* KPI 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--dash-mobile-card-gap)' }}>
        <StatCard labelSize={11} label="Total cloud spend"    value="$42,310" trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard labelSize={11} label="Projected month-end"  value="$48,900" badge={<StatusBadge label="On track" severity="success" />} />
        <StatCard labelSize={11} label="Blocked threats (7d)" value="1,284"   trend={{ direction: 'down', percentage: '6.8%', label: 'vs prev 7d', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard labelSize={11} label="Open security alerts" value="3"       valueSize={32} badge={<StatusBadge label="1 critical" severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      {/* Quick Actions 2x3 */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12, fontFamily: 'var(--dash-font)' }}>Quick actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {QUICK_ACTIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} onClick={() => a.screen && onNavigate?.(a.screen)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: 10, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)', transition: 'border-color 0.12s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: `${a.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={11} color={a.accent} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)', lineHeight: 1.3 }}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SpendTrendChart months={6} view="combined" chartHeight={180} />
      <AwsVsAzureChart />
      <AiInsightsWidget />
      <RecentActivityTimeline isMobile />
      <ResourceHealthOverview isMobile />

      {/* Top services — stacked cards */}
      <section>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text-primary)', display: 'block', marginBottom: 'var(--dash-space-md)', fontFamily: 'var(--dash-font)' }}>Top 5 services by cost</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-space-sm)' }}>
          {SERVICES.map((row) => {
            const trendDown = row.trend < 0;
            const trendColor = trendDown ? 'var(--dash-success)' : 'var(--dash-danger)';
            return (
              <div key={row.name} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 'var(--dash-space-md)', minHeight: 'var(--dash-touch-target)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{row.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--dash-font)' }}>${row.monthlyCost.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <CloudBadge variant={row.cloud === 'AWS' ? 'aws' : 'azure'} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {trendDown ? <ChevronDown size={12} color={trendColor} /> : <ChevronUp size={12} color={trendColor} />}
                    <span style={{ fontSize: 12, fontWeight: 500, color: trendColor, fontFamily: 'var(--dash-font)' }}>{Math.abs(row.trend)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alerts stacked */}
      <section>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text-primary)', display: 'block', marginBottom: 'var(--dash-space-md)', fontFamily: 'var(--dash-font)' }}>Recent security alerts</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-space-sm)' }}>
          {ALERTS_DATA.map((alert, i) => (
            <div key={i} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 'var(--dash-space-md)', minHeight: 'var(--dash-touch-target)', cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6, lineHeight: 1.4, fontFamily: 'var(--dash-font)' }}>{alert.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusBadge label={alert.severity === 'danger' ? 'Critical' : 'Warning'} severity={alert.severity} />
                <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', fontFamily: 'var(--dash-font)' }}>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────────────── */
interface DashboardHomeProps { onNavigate?: (screen: AppRouteId) => void }

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const bp = useBreakpoint();
  if (bp === 'mobile') return <DashboardMobile onNavigate={onNavigate} />;
  if (bp === 'tablet') return <DashboardTablet onNavigate={onNavigate} />;
  return <DashboardDesktop onNavigate={onNavigate} />;
}

