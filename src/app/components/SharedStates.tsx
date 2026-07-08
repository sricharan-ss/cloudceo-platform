import { Cloud, FileText, Sparkles, Lightbulb, Search, Server, AlertTriangle, WifiOff, RefreshCw, ShieldAlert, Unplug, X } from 'lucide-react';

/* ─── Utilities ──────────────────────────────────────────────────── */
export function downloadMockFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Mock Modal ─────────────────────────────────────────────────── */
export function MockModal({ title, children, onClose, onAction, actionLabel }: { title: string; children: React.ReactNode; onClose: () => void; onAction?: () => void; actionLabel?: string }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', width: '90%', maxWidth: 420, zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontFamily: 'var(--dash-font)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text-primary)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', display: 'flex' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
            {children}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
              Cancel
            </button>
            {onAction && (
              <button onClick={onAction} style={{ padding: '8px 16px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
                {actionLabel || 'Confirm'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Empty State ────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  subtle?: boolean;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, secondaryLabel, onSecondary, subtle = false }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: subtle ? '32px 24px' : '56px 24px', textAlign: 'center',
      backgroundColor: subtle ? 'transparent' : 'var(--dash-bg-surface)',
      border: subtle ? 'none' : '1px solid var(--dash-border)',
      borderRadius: 'var(--dash-radius-card)',
      fontFamily: 'var(--dash-font)',
    }}>
      <div style={{ width: subtle ? 44 : 56, height: subtle ? 44 : 56, borderRadius: '50%', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={subtle ? 22 : 28} color="var(--dash-text-muted)" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: subtle ? 15 : 17, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', maxWidth: 340, lineHeight: 1.65, marginBottom: actionLabel ? 20 : 0 }}>{description}</div>
      {(actionLabel || secondaryLabel) && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionLabel && (
            <button onClick={onAction} style={{ padding: '8px 20px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)', transition: 'background-color 0.15s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2F4DC4'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-accent)'; }}>
              {actionLabel}
            </button>
          )}
          {secondaryLabel && (
            <button onClick={onSecondary} style={{ padding: '8px 20px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)' }}>
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Pre-built empty states ─────────────────────────────────────── */
export const EMPTY_STATES = {
  noReports:     { icon: FileText,  title: 'No reports yet',             description: 'Generate your first AI cloud analysis report to see cost breakdowns, security assessments, and optimisation recommendations.' },
  noResources:   { icon: Server,    title: 'No resources found',         description: 'Connect your AWS or Azure account to begin syncing your cloud inventory.' },
  noHistory:     { icon: Sparkles,  title: 'No conversation history',    description: 'Start a conversation with CloudCEO AI to get intelligent insights about your cloud environment.' },
  noRecs:        { icon: Lightbulb, title: 'All recommendations applied', description: 'Great work! CloudCEO AI has no pending optimisation recommendations for the current filter.' },
  noSearch:      { icon: Search,    title: 'No results found',           description: 'Try different search terms or clear your filters to see all items.' },
  noAws:         { icon: Cloud,     title: 'AWS not connected',          description: 'Connect your Amazon Web Services account to unlock cost analytics, resource inventory, and security monitoring.' },
  noAzure:       { icon: Cloud,     title: 'Azure not connected',        description: 'Connect your Microsoft Azure subscription to see cloud costs, resources, and WAF security data.' },
};

/* ─── Loading Skeleton ───────────────────────────────────────────── */
export function Skeleton({ width = '100%', height = 16, radius = 6, style = {} }: {
  width?: string | number; height?: number; radius?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      backgroundColor: 'var(--dash-border-light)',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style,
    }}>
      <style>{`@keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton width="60%" height={12} />
      <Skeleton width="40%" height={24} />
      <Skeleton width="80%" height={10} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--dash-border)', display: 'flex', gap: 16 }}>
        <Skeleton width="25%" height={10} />
        <Skeleton width="15%" height={10} />
        <Skeleton width="15%" height={10} />
        <Skeleton width="15%" height={10} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '14px 20px', borderBottom: i < rows - 1 ? '1px solid var(--dash-border-light)' : 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
          <Skeleton width="25%" height={12} />
          <Skeleton width="12%" height={20} radius={10} />
          <Skeleton width="15%" height={10} />
          <Skeleton width="10%" height={10} />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--dash-font)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 20, height: 280 }}><Skeleton height={8} width="40%" style={{ marginBottom: 20 }} /><Skeleton height={200} /></div>
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 20, height: 280 }}><Skeleton height={8} width="60%" style={{ marginBottom: 20 }} />{[0,1,2,3,4].map(i => <Skeleton key={i} height={28} style={{ marginBottom: 8 }} />)}</div>
      </div>
    </div>
  );
}

/* ─── Error State ────────────────────────────────────────────────── */
export type ErrorKind = 'aws-expired' | 'azure-failed' | 'metrics-unavailable' | 'ai-unavailable' | 'network-lost';

const ERROR_CONFIGS: Record<ErrorKind, { icon: React.ElementType; title: string; desc: string; action: string; severity: 'danger' | 'warning' }> = {
  'aws-expired':          { icon: ShieldAlert,  title: 'AWS connection expired',          desc: 'Your AWS session token has expired. Reconnect to resume syncing billing and resource data.',               action: 'Reconnect AWS',             severity: 'danger'  },
  'azure-failed':         { icon: Unplug,      title: 'Azure authentication failed',     desc: 'CloudCEO cannot reach your Azure subscription. Your access token may have been revoked.',                action: 'Re-authenticate Azure',      severity: 'danger'  },
  'metrics-unavailable':  { icon: AlertTriangle, title: 'Unable to retrieve cloud metrics', desc: 'Cloud metrics are temporarily unavailable. Data shown may be up to 15 minutes old.',                    action: 'Retry',                      severity: 'warning' },
  'ai-unavailable':       { icon: Sparkles,     title: 'AI service temporarily unavailable', desc: 'CloudCEO AI is experiencing high load. Insights and recommendations may be delayed.',                  action: 'Retry',                      severity: 'warning' },
  'network-lost':         { icon: WifiOff,      title: 'Network connection lost',         desc: 'Check your internet connection and try again. Changes made while offline will sync when you reconnect.', action: 'Retry connection',            severity: 'danger'  },
};

export function ErrorState({ kind, onRetry }: { kind: ErrorKind; onRetry?: () => void }) {
  const cfg = ERROR_CONFIGS[kind];
  const Icon = cfg.icon;
  const borderColor = cfg.severity === 'danger' ? 'var(--dash-danger)' : 'var(--dash-warning)';
  const bgColor     = cfg.severity === 'danger' ? 'var(--dash-danger-tint)' : 'var(--dash-warning-tint)';
  const iconColor   = cfg.severity === 'danger' ? 'var(--dash-danger)' : 'var(--dash-warning)';
  const textColor   = cfg.severity === 'danger' ? 'var(--dash-danger-text)' : 'var(--dash-warning-text)';

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 'var(--dash-radius-card)', backgroundColor: bgColor, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', fontFamily: 'var(--dash-font)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--dash-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={iconColor} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 4 }}>{cfg.title}</div>
        <div style={{ fontSize: 13, color: textColor, lineHeight: 1.65, opacity: 0.85, marginBottom: 14 }}>{cfg.desc}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: iconColor, color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'opacity 0.15s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
            <RefreshCw size={13} /> {cfg.action}
          </button>
          <button style={{ padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: `1px solid ${borderColor}`, backgroundColor: 'var(--dash-bg-surface)', color: textColor, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
}
