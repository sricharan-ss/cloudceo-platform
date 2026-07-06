import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { CloudBadge } from './CloudBadge';

export interface ServiceRow {
  name: string;
  cloud: 'AWS' | 'Azure';
  monthlyCost: number;
  trend: number;
}

export const SERVICES: ServiceRow[] = [
  { name: 'EC2',           cloud: 'AWS',   monthlyCost: 12450, trend: 8.2  },
  { name: 'Azure VM',      cloud: 'Azure', monthlyCost: 7340,  trend: -3.1 },
  { name: 'RDS',           cloud: 'AWS',   monthlyCost: 6820,  trend: 12.4 },
  { name: 'Azure Storage', cloud: 'Azure', monthlyCost: 4120,  trend: 1.5  },
  { name: 'S3',            cloud: 'AWS',   monthlyCost: 3210,  trend: -5.8 },
];

function fmt(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

interface TopServicesTableProps {
  /** Tablet: drop Cloud column, show badge inline; Mobile: use stacked cards instead (handled externally) */
  compact?: boolean;
}

export function TopServicesTable({ compact = false }: TopServicesTableProps) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Top 5 services by cost</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E3DE' }}>
            <Th align="left">Service</Th>
            {!compact && <Th align="left">Cloud</Th>}
            <Th align="right">Monthly cost</Th>
            <Th align="right">Trend</Th>
          </tr>
        </thead>
        <tbody>
          {SERVICES.map((row, i) => (
            <ServiceRowItem key={row.name} row={row} isLast={i === SERVICES.length - 1} compact={compact} />
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

function ServiceRowItem({ row, isLast, compact }: { row: ServiceRow; isLast: boolean; compact: boolean }) {
  const [hovered, setHovered] = useState(false);
  const trendDown = row.trend < 0;
  const trendColor = trendDown ? '#4D7C5F' : '#B8473F';

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
      <td style={{ padding: '0 24px', fontSize: 14, color: '#1C1B19' }}>
        {compact ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloudBadge variant={row.cloud === 'AWS' ? 'aws' : 'azure'} />
            {row.name}
          </div>
        ) : (
          row.name
        )}
      </td>
      {!compact && (
        <td style={{ padding: '0 24px' }}>
          <CloudBadge variant={row.cloud === 'AWS' ? 'aws' : 'azure'} />
        </td>
      )}
      <td style={{ padding: '0 24px', fontSize: 14, color: '#1C1B19', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(row.monthlyCost)}
      </td>
      <td style={{ padding: '0 24px', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
          {trendDown ? <ChevronDown size={12} color={trendColor} /> : <ChevronUp size={12} color={trendColor} />}
          <span style={{ fontSize: 12, fontWeight: 500, color: trendColor, fontVariantNumeric: 'tabular-nums' }}>
            {Math.abs(row.trend)}%
          </span>
        </div>
      </td>
    </tr>
  );
}
