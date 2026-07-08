import { useState } from 'react';
import {
  Shield, ChevronDown, ChevronUp, Calendar, Sparkles,
  FileText, Cloud, Lightbulb, RefreshCw, Activity,
  TrendingDown, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle2, Server, BarChart2, ArrowRight, Clock,
  Zap, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { SpendTrendChart } from './SpendTrendChart';
import { HorizontalBarChart } from './HorizontalBarChart';
import { TopServicesTable } from './TopServicesTable';
import { SecurityAlertsTable } from './SecurityAlertsTable';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useDateRange } from '../context/DateRangeContext';
import { useProvider } from '../context/ProviderContext';
import { useAi } from '../context/AiContext';
import { PageSkeleton } from './Skeleton';
import { getProviderMocks } from '../mocks';
import type { AppRouteId } from '../routes';

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function AiExecutiveSummary({ isMobile, summary }: { isMobile: boolean; summary: string }) {
  const mocks = getProviderMocks(useProvider().provider);
  const kpi = mocks.kpi;
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
        {getGreeting()}, Srikanth. {summary}
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: `${kpi.healthScore}/100 health`,     color: 'var(--dash-success)',  bg: 'var(--dash-success-tint)' },
          { label: kpi.estimatedSavings + ' savings',   color: 'var(--dash-success)',  bg: 'var(--dash-success-tint)' },
          { label: `${kpi.criticalAlerts} critical risks`, color: 'var(--dash-danger)',   bg: 'var(--dash-danger-tint)'  },
          { label: `${kpi.recommendations} recommendations`, color: 'var(--dash-accent)', bg: 'var(--dash-accent-tint)' },
        ].map((b, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, backgroundColor: b.bg, color: b.color, fontFamily: 'var(--dash-font)' }}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

function AiInsightsWidget({ insights }: { insights: { icon: React.ElementType; text: string; sev: string }[] }) {
  const { openAiPanel } = useAi();
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
        {insights.map((ins, i) => {
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

      <button onClick={() => openAiPanel('insights')} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--dash-font)' }}>
        View all in AI panel <ChevronRight size={12} />
      </button>
    </div>
  );
}

function QuickActionsPanel({ onNavigate, isMobile }: { onNavigate?: (s: AppRouteId) => void; isMobile?: boolean }) {
  const { openAiPanel } = useAi();
  const QUICK_ACTIONS = [
    { icon: FileText,  label: 'Generate report',   desc: 'AI cloud analysis',  accent: 'var(--dash-accent)',   screen: 'reports'   as AppRouteId },
    { icon: Sparkles,  label: 'Open AI assistant', desc: 'Ask anything',       accent: 'var(--dash-accent)',   screen: null, aiTab: 'assistant' as const },
    { icon: Shield,    label: 'Security risks',    desc: '2 critical items',   accent: 'var(--dash-danger)',   screen: 'security'  as AppRouteId },
    { icon: Lightbulb, label: 'Recommendations',   desc: 'Savings identified', accent: 'var(--dash-warning)',  screen: null, aiTab: 'recommendations' as const },
    { icon: Cloud,     label: 'Cloud resources',   desc: 'All resources',      accent: 'var(--dash-success)',  screen: 'resources' as AppRouteId },
  ];
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 14, fontFamily: 'var(--dash-font)' }}>Quick actions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={i}
              onClick={() => {
                if (a.screen) onNavigate?.(a.screen);
                else if (a.aiTab) {
                  openAiPanel(a.aiTab);
                } else toast.success(`${a.label} opened`);
              }}
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

function RecentActivityTimeline({ isMobile, activity }: { isMobile?: boolean; activity: { icon: React.ElementType; text: string; time: string; type: string; cloud?: 'aws' | 'azure'; sev?: 'danger' | 'warning' }[] }) {
  const { preset } = useDateRange();
  const typeColors: Record<string, string> = { security: 'var(--dash-danger)', cost: 'var(--dash-warning)', ai: 'var(--dash-accent)', report: 'var(--dash-success)', infra: 'var(--dash-neutral-chart)', cloud: 'var(--dash-text-muted)' };
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Activity size={14} color="var(--dash-text-secondary)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>Recent activity</span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto', fontFamily: 'var(--dash-font)' }}>{preset}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {activity.map((a, i) => {
          const Icon = a.icon;
          const color = typeColors[a.type] || 'var(--dash-text-muted)';
          return (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, marginBottom: 12, borderBottom: i < activity.length - 1 ? '1px solid var(--dash-border-light)' : 'none', cursor: 'pointer', transition: 'opacity 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={10} color={color} strokeWidth={2} />
                </div>
                {i < activity.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, backgroundColor: 'var(--dash-border-light)', marginTop: 4 }} />}
              </div>
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

function ResourceHealthOverview({ health, isMobile, onNavigate }: { health: { healthy: number; warning: number; critical: number }; isMobile?: boolean; onNavigate?: (s: AppRouteId) => void }) {
  const total = health.healthy + health.warning + health.critical;
  const healthPct  = total ? (health.healthy  / total) * 100 : 0;
  const warningPct = total ? (health.warning  / total) * 100 : 0;
  const critPct    = total ? (health.critical / total) * 100 : 0;

  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Server size={14} color="var(--dash-text-secondary)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>Resource health</span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto', fontFamily: 'var(--dash-font)' }}>{total} total</span>
      </div>

      <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
        <div style={{ width: `${healthPct}%`, backgroundColor: 'var(--dash-success)', transition: 'width 0.4s ease' }} />
        <div style={{ width: `${warningPct}%`, backgroundColor: 'var(--dash-warning)', transition: 'width 0.4s ease' }} />
        <div style={{ width: `${critPct}%`, backgroundColor: 'var(--dash-danger)', transition: 'width 0.4s ease' }} />
      </div>

      {[
        { label: 'Healthy',  count: health.healthy,  color: 'var(--dash-success)', sev: 'success' as const },
        { label: 'Warning',  count: health.warning,  color: 'var(--dash-warning)', sev: 'warning' as const },
        { label: 'Critical', count: health.critical, color: 'var(--dash-danger)',  sev: 'danger'  as const },
      ].map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 2 ? '1px solid var(--dash-border-light)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: row.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{row.label}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: row.color, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--dash-font)' }}>{row.count}</div>
        </div>
      ))}

      <button onClick={() => onNavigate?.('resources')} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--dash-font)' }}>
        View all resources <ChevronRight size={12} />
      </button>
    </div>
  );
}

function SpendBreakdownChart({ serviceCosts, spendVsLabel, spendVsValue }: { serviceCosts: { label: string; value: number; cloud: 'aws' | 'azure' }[]; spendVsLabel: string; spendVsValue: string }) {
  return (
    <HorizontalBarChart
      title={spendVsLabel}
      items={serviceCosts}
      labelWidth={90}
      summaryLine={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>{spendVsValue}</span>
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
function DashboardDesktop({ onNavigate, mocks }: { onNavigate?: (s: AppRouteId) => void; mocks: ReturnType<typeof getProviderMocks> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AiExecutiveSummary isMobile={false} summary={mocks.executiveSummary} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Total cloud spend"    value={mocks.kpi.totalSpend}      trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard label="Projected month-end"  value={mocks.kpi.projectedMonthEnd} badge={<StatusBadge label="On track" severity="success" />} onClick={() => onNavigate?.('forecast')} />
        <StatCard label="Blocked threats (7d)" value={mocks.kpi.blockedThreats}  trend={{ direction: 'down', percentage: mocks.kpi.blockedThreatsTrend, label: 'vs prev 7 days', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard label="Open security alerts" value={String(mocks.kpi.openAlerts)} valueSize={32} badge={<StatusBadge label={`${mocks.kpi.criticalAlerts} critical`} severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <AiInsightsWidget insights={mocks.aiInsights} />
        <QuickActionsPanel onNavigate={onNavigate} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <SpendTrendChart months={6} view="combined" />
        <SpendBreakdownChart serviceCosts={mocks.serviceCosts} spendVsLabel={mocks.spendVsLabel} spendVsValue={mocks.spendVsValue} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <RecentActivityTimeline activity={mocks.activity} />
        <ResourceHealthOverview health={mocks.resourceHealth} onNavigate={onNavigate} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TopServicesTable />
        <SecurityAlertsTable />
      </div>
    </div>
  );
}

/* ─── Tablet layout ──────────────────────────────────────────────── */
function DashboardTablet({ onNavigate, mocks }: { onNavigate?: (s: AppRouteId) => void; mocks: ReturnType<typeof getProviderMocks> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AiExecutiveSummary isMobile={false} summary={mocks.executiveSummary} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <StatCard label="Total cloud spend"    value={mocks.kpi.totalSpend}      trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard label="Projected month-end"  value={mocks.kpi.projectedMonthEnd} badge={<StatusBadge label="On track" severity="success" />} />
        <StatCard label="Blocked threats (7d)" value={mocks.kpi.blockedThreats}  trend={{ direction: 'down', percentage: mocks.kpi.blockedThreatsTrend, label: 'vs prev 7d', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard label="Open security alerts" value={String(mocks.kpi.openAlerts)} valueSize={32} badge={<StatusBadge label={`${mocks.kpi.criticalAlerts} critical`} severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      <AiInsightsWidget insights={mocks.aiInsights} />
      <QuickActionsPanel onNavigate={onNavigate} />
      <SpendTrendChart months={6} view="combined" />
      <SpendBreakdownChart serviceCosts={mocks.serviceCosts} spendVsLabel={mocks.spendVsLabel} spendVsValue={mocks.spendVsValue} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <RecentActivityTimeline activity={mocks.activity} />
        <ResourceHealthOverview health={mocks.resourceHealth} onNavigate={onNavigate} />
      </div>

      <TopServicesTable compact />
      <SecurityAlertsTable />
    </div>
  );
}

/* ─── Mobile layout ──────────────────────────────────────────────── */
function DashboardMobile({ onNavigate, mocks }: { onNavigate?: (s: AppRouteId) => void; mocks: ReturnType<typeof getProviderMocks> }) {
  const { preset } = useDateRange();
  const { openAiPanel } = useAi();
  const QUICK_ACTIONS = [
    { icon: FileText,  label: 'Generate report',   accent: 'var(--dash-accent)',   screen: 'reports'   as AppRouteId },
    { icon: Sparkles,  label: 'Open AI assistant', accent: 'var(--dash-accent)',   screen: null, aiTab: 'assistant' as const },
    { icon: Shield,    label: 'Security risks',    accent: 'var(--dash-danger)',   screen: 'security'  as AppRouteId },
    { icon: Lightbulb, label: 'Recommendations',   accent: 'var(--dash-warning)',  screen: null, aiTab: 'recommendations' as const },
    { icon: Cloud,     label: 'Cloud resources',   accent: 'var(--dash-success)',  screen: 'resources' as AppRouteId },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dash-space-2xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', fontSize: 13, fontWeight: 500, cursor: 'default', fontFamily: 'var(--dash-font)' }}>
          <Calendar size={13} color="var(--dash-text-secondary)" />
          {preset}
        </div>
      </div>

      <AiExecutiveSummary isMobile summary={mocks.executiveSummary} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--dash-mobile-card-gap)' }}>
        <StatCard labelSize={11} label="Total cloud spend"    value={mocks.kpi.totalSpend}      trend={{ direction: 'down', percentage: '10.2%', goodDirection: 'down' }} onClick={() => onNavigate?.('cost')} />
        <StatCard labelSize={11} label="Projected month-end"  value={mocks.kpi.projectedMonthEnd} badge={<StatusBadge label="On track" severity="success" />} />
        <StatCard labelSize={11} label="Blocked threats (7d)" value={mocks.kpi.blockedThreats}  trend={{ direction: 'down', percentage: mocks.kpi.blockedThreatsTrend, label: 'vs prev 7d', goodDirection: 'down' }} icon={<Shield size={16} strokeWidth={1.5} />} onClick={() => onNavigate?.('security')} />
        <StatCard labelSize={11} label="Open security alerts" value={String(mocks.kpi.openAlerts)} valueSize={32} badge={<StatusBadge label={`${mocks.kpi.criticalAlerts} critical`} severity="danger" />} onClick={() => onNavigate?.('security')} />
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12, fontFamily: 'var(--dash-font)' }}>Quick actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {QUICK_ACTIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} onClick={() => {
                if (a.screen) onNavigate?.(a.screen);
                else if (a.aiTab) openAiPanel(a.aiTab);
              }}
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
      <SpendBreakdownChart serviceCosts={mocks.serviceCosts} spendVsLabel={mocks.spendVsLabel} spendVsValue={mocks.spendVsValue} />
      <AiInsightsWidget insights={mocks.aiInsights} />
      <RecentActivityTimeline isMobile activity={mocks.activity} />
      <ResourceHealthOverview health={mocks.resourceHealth} isMobile onNavigate={onNavigate} />
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────────────── */
interface DashboardHomeProps { onNavigate?: (screen: AppRouteId) => void }

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const bp = useBreakpoint();
  const { isLoading } = useDateRange();
  const { provider } = useProvider();
  const mocks = getProviderMocks(provider);

  if (isLoading) return <PageSkeleton />;
  if (bp === 'mobile') return <DashboardMobile onNavigate={onNavigate} mocks={mocks} />;
  if (bp === 'tablet') return <DashboardTablet onNavigate={onNavigate} mocks={mocks} />;
  return <DashboardDesktop onNavigate={onNavigate} mocks={mocks} />;
}
