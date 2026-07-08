import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import type { SecurityEventMock } from '../mocks/types';
import { getProviderMocks } from '../mocks';
import { useProvider } from '../context/ProviderContext';

export type SecurityEvent = SecurityEventMock;

export function RecentSecurityEventsTable({ onSelectEvent }: { onSelectEvent?: (e: SecurityEvent) => void }) {
  const { provider } = useProvider();
  const mocks = getProviderMocks(provider);
  const events = mocks.securityEvents;

  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dash-border)' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Recent security events</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
            {['Time', 'Event', 'Severity', 'Source IP', 'Rule', 'Cloud'].map((h) => (
              <th key={h} style={{ padding: '0 24px', height: 44, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 5).map((event, i) => (
            <SecurityEventRow
              key={event.id}
              event={event}
              isLast={i === events.slice(0, 5).length - 1}
              onClick={() => onSelectEvent?.(event)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecurityEventRow({ event, isLast, onClick }: { event: SecurityEvent; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isAws = event.cloud === 'aws';
  const severityLabel = event.severity === 'critical' ? 'Critical' : event.severity === 'warning' ? 'Warning' : 'Info';
  const severityType = event.severity === 'critical' ? 'danger' : 'warning';

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)',
        backgroundColor: hovered ? 'var(--dash-bg-page)' : 'transparent',
        cursor: 'pointer',
        height: 52,
      }}
    >
      <td style={{ padding: '0 24px', fontSize: 13, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>{event.time}</td>
      <td style={{ padding: '0 24px', fontSize: 14, color: 'var(--dash-text-primary)', maxWidth: 240 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.detail}</span>
      </td>
      <td style={{ padding: '0 24px' }}>
        <StatusBadge label={severityLabel} severity={severityType as any} />
      </td>
      <td style={{ padding: '0 24px', fontSize: 13, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace' }}>
        {event.ip}
      </td>
      <td style={{ padding: '0 24px', fontSize: 13, color: 'var(--dash-text-secondary)', fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace', maxWidth: 200 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.rule}</span>
      </td>
      <td style={{ padding: '0 24px' }}>
        <CloudBadge variant={isAws ? 'aws' : 'azure'} />
      </td>
    </tr>
  );
}
