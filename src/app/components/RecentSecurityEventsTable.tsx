import { useState } from 'react';
import { StatusBadge } from './StatusBadge';

export interface SecurityEvent {
  id: string;
  description: string;
  severity: 'danger' | 'warning';
  time: string;
  sourceIp: string;
  targetEndpoint: string;
  ruleMatched: string;
  country: string;
  method: string;
}

export const SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: '1',
    description: 'SQL injection attempt blocked',
    severity: 'danger',
    time: '2h ago',
    sourceIp: '203.0.113.42',
    targetEndpoint: '/api/checkout',
    ruleMatched: 'AWS-AWSManagedRulesSQLiRuleSet',
    country: 'United States',
    method: 'POST',
  },
  {
    id: '2',
    description: 'XSS payload detected in query string',
    severity: 'danger',
    time: '3h ago',
    sourceIp: '198.51.100.17',
    targetEndpoint: '/api/search',
    ruleMatched: 'AWS-AWSManagedRulesCommonRuleSet',
    country: 'Germany',
    method: 'GET',
  },
  {
    id: '3',
    description: 'Unusual traffic spike from single IP',
    severity: 'warning',
    time: '5h ago',
    sourceIp: '192.0.2.89',
    targetEndpoint: '/api/login',
    ruleMatched: 'RateLimitRule-Global',
    country: 'Singapore',
    method: 'POST',
  },
  {
    id: '4',
    description: 'Bot pattern matched on /api/login',
    severity: 'warning',
    time: '8h ago',
    sourceIp: '203.0.113.105',
    targetEndpoint: '/api/login',
    ruleMatched: 'AWS-AWSManagedRulesBotControlRuleSet',
    country: 'Brazil',
    method: 'POST',
  },
  {
    id: '5',
    description: 'Rate limit exceeded on /api/checkout',
    severity: 'warning',
    time: '14h ago',
    sourceIp: '198.51.100.63',
    targetEndpoint: '/api/checkout',
    ruleMatched: 'RateLimitRule-Checkout',
    country: 'United States',
    method: 'POST',
  },
  {
    id: '6',
    description: 'Path traversal attempt blocked',
    severity: 'warning',
    time: '1d ago',
    sourceIp: '192.0.2.14',
    targetEndpoint: '/api/files',
    ruleMatched: 'AWS-AWSManagedRulesCommonRuleSet',
    country: 'Germany',
    method: 'GET',
  },
];

interface RecentSecurityEventsTableProps {
  onSelectEvent: (event: SecurityEvent) => void;
}

export function RecentSecurityEventsTable({ onSelectEvent }: RecentSecurityEventsTableProps) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Recent security events</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E3DE' }}>
            <Th align="left">Alert</Th>
            <Th align="left">Severity</Th>
            <Th align="right">Time</Th>
          </tr>
        </thead>
        <tbody>
          {SECURITY_EVENTS.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              isLast={i === SECURITY_EVENTS.length - 1}
              onClick={() => onSelectEvent(event)}
            />
          ))}
        </tbody>
      </table>

      <div style={{ padding: '12px 24px', borderTop: '1px solid #F0EFEB' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 14,
            color: '#3B5BDB',
            cursor: 'pointer',
            fontWeight: 400,
          }}
        >
          View all
        </button>
      </div>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align: 'left' | 'right' }) {
  return (
    <th
      style={{
        padding: '0 24px',
        height: 44,
        fontSize: 12,
        fontWeight: 500,
        color: '#6B6A64',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}

function EventRow({ event, isLast, onClick }: { event: SecurityEvent; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid #F0EFEB',
        backgroundColor: hovered ? '#FAFAF9' : 'transparent',
        transition: 'background-color 0.1s ease',
        height: 48,
        cursor: 'pointer',
      }}
    >
      <td style={{ padding: '0 24px', fontSize: 14, color: '#1C1B19', maxWidth: 240 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.description}
        </span>
      </td>
      <td style={{ padding: '0 24px' }}>
        <StatusBadge
          label={event.severity === 'danger' ? 'Critical' : 'Warning'}
          severity={event.severity}
        />
      </td>
      <td style={{ padding: '0 24px', fontSize: 14, color: '#9C9A92', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {event.time}
      </td>
    </tr>
  );
}
