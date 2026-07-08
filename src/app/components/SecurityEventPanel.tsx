import { useState } from 'react';
import { X, ArrowLeft, Shield, Box, Server, Activity, ArrowRight, Cloud, Settings, Terminal, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { SecurityEventMock } from '../mocks/types';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { MockModal } from './SharedStates';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const SEVERITY_COLORS: Record<'critical' | 'warning' | 'info', { bg: string; text: string; dot: string }> = {
  critical: { bg: 'var(--dash-danger-tint)',  text: 'var(--dash-danger-text)',  dot: 'var(--dash-danger)'  },
  warning:  { bg: 'var(--dash-warning-tint)', text: 'var(--dash-warning-text)', dot: 'var(--dash-warning)' },
  info:     { bg: 'var(--dash-accent-tint)',  text: 'var(--dash-accent)',       dot: 'var(--dash-accent)'  },
};

export function SecurityEventPanel({ event, onClose }: { event: SecurityEventMock | null; onClose: () => void }) {
  const [modal, setModal] = useState<string | null>(null);
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  if (!event) return null;

  const sev = SEVERITY_COLORS[event.severity];

  /* Panel width and border adapt to breakpoint */
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed', inset: 0,
        backgroundColor: 'var(--dash-bg-surface)',
        zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto',
        fontFamily: 'var(--dash-font)',
      }
    : {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: isTablet ? 400 : 480,
        backgroundColor: 'var(--dash-bg-surface)',
        borderLeft: '1px solid var(--dash-border)',
        zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto',
        fontFamily: 'var(--dash-font)',
      };

  return (
    <>
      {/* Dimmed overlay — desktop/tablet only */}
      {!isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.40)',
            zIndex: 49,
          }}
        />
      )}

      {/* Slide-over / full-screen panel */}
      <div style={panelStyle}>
        {/* Panel header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            borderBottom: '1px solid var(--dash-border)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--dash-text-secondary)',
              borderRadius: 6,
              minWidth: 44,
              minHeight: 44,
              justifyContent: 'center',
            }}
          >
            {isMobile ? <ArrowLeft size={18} strokeWidth={1.5} /> : <X size={18} strokeWidth={1.5} />}
          </button>
          <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Security event</span>
        </div>

        {/* Panel content */}
        <div style={{ padding: isMobile ? '20px 16px' : 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Severity badge and status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: sev.bg,
                color: sev.text,
                fontSize: 14,
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: sev.dot, display: 'inline-block', flexShrink: 0 }} />
              {event.severity === 'critical' ? 'Critical' : event.severity === 'warning' ? 'Warning' : 'Info'}
            </span>

            {event.status === 'blocked' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--dash-success-tint)', color: 'var(--dash-success)', fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 999 }}>
                Blocked
              </span>
            ) : event.status === 'flagged' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--dash-warning-tint)', color: 'var(--dash-warning)', fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 999 }}>
                Flagged
              </span>
            ) : null}
          </div>

          {/* Event title */}
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
            {event.detail}
          </div>

          {/* Timestamp & Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--dash-text-secondary)', marginBottom: 24 }}>
            <span>{event.time}</span>
            <span style={{ color: 'var(--dash-border-strong)' }}>•</span>
            <span>{event.eventType || event.type}</span>
          </div>

          <Divider />

          {/* Key-value list (Metadata) */}
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12 }}>Metadata</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24, backgroundColor: 'var(--dash-bg-page)', padding: '12px 16px', borderRadius: 'var(--dash-radius-card)', border: '1px solid var(--dash-border)' }}>
            <KVRow label="Event ID" isMobile={isMobile}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--dash-text-primary)' }}>{event.id}</span>
            </KVRow>
            <KVRow label="Provider" isMobile={isMobile}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)' }}>
                <Cloud size={14} color="var(--dash-text-secondary)" />
                {event.cloud === 'aws' ? 'AWS' : 'Azure'}
              </span>
            </KVRow>
            <KVRow label="Service" isMobile={isMobile}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--dash-text-primary)' }}>
                <Server size={14} color="var(--dash-text-secondary)" />
                {event.service || 'Unknown'}
              </span>
            </KVRow>
            <KVRow label="Affected Resource" isMobile={isMobile}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--dash-accent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Box size={14} />
                {event.resource || 'Unknown Resource'}
              </span>
            </KVRow>
            {event.ip && event.ip !== 'N/A' && (
              <KVRow label="Source IP" isMobile={isMobile}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--dash-text-primary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {event.ip}
                  {event.country && <span style={{ color: 'var(--dash-text-muted)', fontSize: 12 }}>({event.country})</span>}
                </span>
              </KVRow>
            )}
            <KVRow label="Rule Matched" isLast isMobile={isMobile}>
              <span style={{ fontSize: 13, color: 'var(--dash-text-primary)' }}>{event.rule}</span>
            </KVRow>
          </div>

          {/* Recommended Actions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={16} color="var(--dash-accent)" />
              Recommended actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {event.status === 'blocked' ? (
                <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', fontSize: 13, color: 'var(--dash-text-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--dash-success-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Shield size={14} color="var(--dash-success)" />
                   </div>
                   Threat was automatically blocked by WAF rule. No immediate action required.
                </div>
              ) : (
                <>
                  <button onClick={() => setModal('config')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--dash-accent)', backgroundColor: 'var(--dash-accent-tint)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Settings size={16} color="var(--dash-accent)" />
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Review {event.service} Configuration</span>
                    </div>
                    <ArrowRight size={16} color="var(--dash-text-secondary)" />
                  </button>
                  <button onClick={() => setModal('logs')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Terminal size={16} color="var(--dash-text-secondary)" />
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>View Access Logs</span>
                    </div>
                    <ArrowRight size={16} color="var(--dash-text-secondary)" />
                  </button>
                </>
              )}
            </div>
          </div>

          <Divider />

          {/* Secondary action button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('security-navigate', { detail: { tab: 'activity' } }));
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('security-search', { detail: { search: event.resource || event.ip || '' } }));
              }, 50);
              onClose();
            }}
            style={{
              padding: '9px 16px',
              borderRadius: 'var(--dash-radius-button)',
              border: '1px solid var(--dash-border)',
              backgroundColor: 'var(--dash-bg-surface)',
              color: 'var(--dash-text-primary)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.12s ease',
              fontFamily: 'var(--dash-font)',
              minHeight: 'var(--dash-touch-target)',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-border-strong)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-border)'; }}
          >
            <Search size={16} /> View related events
          </button>
        </div>
      </div>

      {modal === 'config' && (
        <MockModal title={`Review ${event.service} Configuration`} actionLabel="Save changes" onClose={() => setModal(null)} onAction={() => { toast.success('Configuration updated'); setModal(null); }}>
          <pre style={{ backgroundColor: 'var(--dash-bg-page)', padding: 12, borderRadius: 6, fontSize: 11, fontFamily: MONO, overflowX: 'auto', border: '1px solid var(--dash-border)', color: 'var(--dash-text-primary)' }}>
{`{
  "resourceId": "${event.resource || 'unknown'}",
  "publicAccess": true,
  "encryption": "none",
  "recommendedAction": "Disable public access"
}`}
          </pre>
        </MockModal>
      )}
      
      {modal === 'logs' && (
        <MockModal title="Access Logs" actionLabel="Export CSV" onClose={() => setModal(null)} onAction={() => { toast.success('Logs exported'); setModal(null); }}>
          <div style={{ backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead style={{ backgroundColor: 'var(--dash-bg-surface)', borderBottom: '1px solid var(--dash-border)' }}>
                <tr><th style={{ padding: '8px 12px', textAlign: 'left' }}>Time</th><th style={{ padding: '8px 12px', textAlign: 'left' }}>IP</th><th style={{ padding: '8px 12px', textAlign: 'left' }}>Action</th></tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--dash-border-light)' }}><td style={{ padding: '8px 12px' }}>{event.time}</td><td style={{ padding: '8px 12px', fontFamily: MONO }}>{event.ip || '192.168.1.1'}</td><td style={{ padding: '8px 12px' }}>Blocked</td></tr>
                <tr style={{ borderBottom: '1px solid var(--dash-border-light)' }}><td style={{ padding: '8px 12px' }}>-2m</td><td style={{ padding: '8px 12px', fontFamily: MONO }}>{event.ip || '192.168.1.1'}</td><td style={{ padding: '8px 12px' }}>Failed Login</td></tr>
                <tr><td style={{ padding: '8px 12px' }}>-5m</td><td style={{ padding: '8px 12px', fontFamily: MONO }}>10.0.0.45</td><td style={{ padding: '8px 12px' }}>Success</td></tr>
              </tbody>
            </table>
          </div>
        </MockModal>
      )}
    </>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: 'var(--dash-border)', marginBottom: 20 }} />;
}

function KVRow({ label, children, isLast, isMobile }: { label: string; children: React.ReactNode; isLast?: boolean; isMobile?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        minHeight: 36,
        padding: '8px 0',
        borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--dash-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          width: isMobile ? '100%' : 120,
          flexShrink: 0,
          paddingTop: isMobile ? 0 : 2,
          marginBottom: isMobile ? 2 : 0,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
