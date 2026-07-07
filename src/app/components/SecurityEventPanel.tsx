import { X, ArrowLeft } from 'lucide-react';
import type { SecurityEvent } from './RecentSecurityEventsTable';
import { useBreakpoint } from '../hooks/useBreakpoint';

const MONO = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';

const SEVERITY_COLORS = {
  danger:  { bg: 'var(--dash-danger-tint)',  text: 'var(--dash-danger-text)',  dot: 'var(--dash-danger)'  },
  warning: { bg: 'var(--dash-warning-tint)', text: 'var(--dash-warning-text)', dot: 'var(--dash-warning)' },
};

interface SecurityEventPanelProps {
  event: SecurityEvent | null;
  onClose: () => void;
}

export function SecurityEventPanel({ event, onClose }: SecurityEventPanelProps) {
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
          {/* Severity badge */}
          <div style={{ marginBottom: 12 }}>
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
              {event.severity === 'danger' ? 'Critical' : 'Warning'}
            </span>
          </div>

          {/* Event title */}
          <div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
            {event.description}
          </div>

          {/* Timestamp */}
          <div style={{ fontSize: 14, color: 'var(--dash-text-secondary)', marginBottom: 20 }}>
            {event.time === '2h ago' ? 'Today at 2:14 PM' :
             event.time === '3h ago' ? 'Today at 1:06 PM' :
             event.time === '5h ago' ? 'Today at 11:22 AM' :
             event.time === '8h ago' ? 'Today at 8:47 AM' :
             event.time === '14h ago' ? 'Today at 2:31 AM' :
             'Yesterday at 4:18 PM'}
          </div>

          <Divider />

          {/* Key-value list */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
            <KVRow label="Source IP" isMobile={isMobile}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--dash-text-primary)', wordBreak: 'break-all' }}>{event.sourceIp}</span>
            </KVRow>
            <KVRow label="Target endpoint" isMobile={isMobile}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--dash-text-primary)', wordBreak: 'break-all' }}>{event.targetEndpoint}</span>
            </KVRow>
            <KVRow label="Rule matched" isMobile={isMobile}>
              <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', wordBreak: 'break-word' }}>{event.ruleMatched}</span>
            </KVRow>
            <KVRow label="Action taken" isMobile={isMobile}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: 'var(--dash-success-tint)',
                  color: 'var(--dash-success-text)',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--dash-success)', display: 'inline-block', flexShrink: 0 }} />
                Blocked
              </span>
            </KVRow>
            <KVRow label="Country" isMobile={isMobile}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-primary)' }}>{event.country}</span>
            </KVRow>
            <KVRow label="Request method" isLast isMobile={isMobile}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-primary)', fontWeight: 500 }}>{event.method}</span>
            </KVRow>
          </div>

          <Divider />

          {/* Request details */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 10 }}>
              Request details
            </div>
            <div
              style={{
                backgroundColor: 'var(--dash-bg-page)',
                borderRadius: 8,
                padding: 12,
                fontFamily: MONO,
                fontSize: 12,
                color: 'var(--dash-text-secondary)',
                lineHeight: 1.7,
                overflowX: 'auto',
                border: '1px solid var(--dash-border-light)',
              }}
            >
              <div>POST {event.targetEndpoint} HTTP/1.1</div>
              <div>Host: api.example.com</div>
              <div>Content-Type: application/json</div>
              <div>X-Forwarded-For: {event.sourceIp}</div>
              <div style={{ color: 'var(--dash-danger)' }}>
                {event.severity === 'danger' && event.description.toLowerCase().includes('sql')
                  ? "Body: {\"id\": \"1' OR '1'='1\"}"
                  : event.description.toLowerCase().includes('xss')
                  ? 'q=<script>alert(document.cookie)</script>'
                  : 'User-Agent: python-requests/2.28.0'}
              </div>
            </div>
          </div>

          {/* Secondary action button */}
          <button
            style={{
              padding: '9px 16px',
              borderRadius: 'var(--dash-radius-button)',
              border: '1px solid var(--dash-border)',
              backgroundColor: 'transparent',
              color: 'var(--dash-text-primary)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.12s ease',
              fontFamily: 'var(--dash-font)',
              minHeight: 'var(--dash-touch-target)',
              width: '100%',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-border-strong)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--dash-border)'; }}
          >
            View full request log
          </button>
        </div>
      </div>
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
