import { X } from 'lucide-react';
import type { SecurityEvent } from './RecentSecurityEventsTable';

const MONO = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';

const SEVERITY_COLORS = {
  danger:  { bg: '#F8EBEA', text: '#7A2E2A', dot: '#B8473F' },
  warning: { bg: '#FAF1E2', text: '#7A5A1E', dot: '#B8862E' },
};

interface SecurityEventPanelProps {
  event: SecurityEvent | null;
  onClose: () => void;
}

export function SecurityEventPanel({ event, onClose }: SecurityEventPanelProps) {
  if (!event) return null;

  const sev = SEVERITY_COLORS[event.severity];

  return (
    <>
      {/* Dimmed overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.40)',
          zIndex: 49,
        }}
      />

      {/* Slide-over panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 480,
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid #E5E3DE',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Panel header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            borderBottom: '1px solid #E5E3DE',
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
              color: '#6B6A64',
              borderRadius: 6,
            }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Security event</span>
        </div>

        {/* Panel content */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Severity badge (14px, larger than table) */}
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
          <div style={{ fontSize: 20, fontWeight: 500, color: '#1C1B19', marginBottom: 6, lineHeight: 1.3 }}>
            {event.description}
          </div>

          {/* Timestamp */}
          <div style={{ fontSize: 14, color: '#6B6A64', marginBottom: 20 }}>
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
            <KVRow label="Source IP">
              <span style={{ fontFamily: MONO, fontSize: 13, color: '#1C1B19' }}>{event.sourceIp}</span>
            </KVRow>
            <KVRow label="Target endpoint">
              <span style={{ fontFamily: MONO, fontSize: 13, color: '#1C1B19' }}>{event.targetEndpoint}</span>
            </KVRow>
            <KVRow label="Rule matched">
              <span style={{ fontSize: 14, color: '#1C1B19', wordBreak: 'break-all' }}>{event.ruleMatched}</span>
            </KVRow>
            <KVRow label="Action taken">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#EDF3EE',
                  color: '#2D5A3D',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 999,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4D7C5F', display: 'inline-block', flexShrink: 0 }} />
                Blocked
              </span>
            </KVRow>
            <KVRow label="Country">
              <span style={{ fontSize: 14, color: '#1C1B19' }}>{event.country}</span>
            </KVRow>
            <KVRow label="Request method" isLast>
              <span style={{ fontSize: 14, color: '#1C1B19', fontWeight: 500 }}>{event.method}</span>
            </KVRow>
          </div>

          <Divider />

          {/* Request details */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1C1B19', marginBottom: 10 }}>
              Request details
            </div>
            <div
              style={{
                backgroundColor: '#F5F4F1',
                borderRadius: 8,
                padding: 12,
                fontFamily: MONO,
                fontSize: 12,
                color: '#6B6A64',
                lineHeight: 1.7,
                overflowX: 'auto',
              }}
            >
              <div>POST {event.targetEndpoint} HTTP/1.1</div>
              <div>Host: api.example.com</div>
              <div>Content-Type: application/json</div>
              <div>X-Forwarded-For: {event.sourceIp}</div>
              <div style={{ color: '#B8473F' }}>
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
              borderRadius: 8,
              border: '1px solid #E5E3DE',
              backgroundColor: 'transparent',
              color: '#1C1B19',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.12s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1CFC8'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E3DE'; }}
          >
            View full request log
          </button>
        </div>
      </div>
    </>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#E5E3DE', marginBottom: 20 }} />;
}

function KVRow({ label, children, isLast }: { label: string; children: React.ReactNode; isLast?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        minHeight: 36,
        padding: '8px 0',
        borderBottom: isLast ? 'none' : '1px solid #F0EFEB',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: '#6B6A64',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          width: 130,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
