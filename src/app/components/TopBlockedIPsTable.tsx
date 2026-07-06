import { useState } from 'react';

export interface IpRow {
  ip: string;
  blocked: number;
  lastSeen: string;
  country: string;
}

export const BLOCKED_IPS: IpRow[] = [
  { ip: '203.0.113.42',  blocked: 342, lastSeen: '5 min ago',  country: 'United States' },
  { ip: '198.51.100.17', blocked: 218, lastSeen: '12 min ago', country: 'Germany'       },
  { ip: '192.0.2.89',    blocked: 187, lastSeen: '28 min ago', country: 'Singapore'     },
  { ip: '203.0.113.105', blocked: 143, lastSeen: '1h ago',     country: 'Brazil'        },
  { ip: '198.51.100.63', blocked: 98,  lastSeen: '2h ago',     country: 'United States' },
  { ip: '192.0.2.14',    blocked: 76,  lastSeen: '3h ago',     country: 'Germany'       },
];

export function TopBlockedIPsTable() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Top blocked IPs</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E3DE' }}>
            <Th align="left">IP address</Th>
            <Th align="right">Requests blocked</Th>
            <Th align="right">Last seen</Th>
            <Th align="left">Country</Th>
          </tr>
        </thead>
        <tbody>
          {BLOCKED_IPS.map((row, i) => (
            <IpRowItem key={row.ip} row={row} isLast={i === BLOCKED_IPS.length - 1} />
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
        padding: '0 20px',
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

function IpRowItem({ row, isLast }: { row: IpRow; isLast: boolean }) {
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
      }}
    >
      <td style={{ padding: '0 20px' }}>
        <span style={{ fontSize: 13, color: '#1C1B19', fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace' }}>
          {row.ip}
        </span>
      </td>
      <td style={{ padding: '0 20px', fontSize: 14, color: '#1C1B19', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
        {row.blocked.toLocaleString()}
      </td>
      <td style={{ padding: '0 20px', fontSize: 14, color: '#9C9A92', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {row.lastSeen}
      </td>
      <td style={{ padding: '0 20px', fontSize: 14, color: '#6B6A64' }}>
        {row.country}
      </td>
    </tr>
  );
}
