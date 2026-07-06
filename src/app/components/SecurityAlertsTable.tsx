import { useState } from 'react';
import { StatusBadge } from './StatusBadge';

interface AlertRow {
  description: string;
  severity: 'danger' | 'warning';
  time: string;
}

const ALERTS: AlertRow[] = [
  { description: 'SQL injection attempt blocked',          severity: 'danger',  time: '2h ago'  },
  { description: 'Unusual traffic spike from single IP',   severity: 'warning', time: '5h ago'  },
  { description: 'Rate limit exceeded on /api/checkout',   severity: 'warning', time: '1d ago'  },
];

export function SecurityAlertsTable() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Recent security alerts</span>
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
          {ALERTS.map((row, i) => (
            <AlertRowItem key={i} row={row} isLast={i === ALERTS.length - 1} />
          ))}
        </tbody>
      </table>
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

function AlertRowItem({ row, isLast }: { row: AlertRow; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
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
      <td style={{ padding: '0 24px', fontSize: 14, color: '#1C1B19', maxWidth: 260 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.description}
        </span>
      </td>
      <td style={{ padding: '0 24px' }}>
        <StatusBadge
          label={row.severity === 'danger' ? 'Critical' : 'Warning'}
          severity={row.severity}
        />
      </td>
      <td style={{ padding: '0 24px', fontSize: 14, color: '#9C9A92', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {row.time}
      </td>
    </tr>
  );
}
