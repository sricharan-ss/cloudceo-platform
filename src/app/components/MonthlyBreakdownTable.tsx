import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MonthRow {
  month: string;
  aws: number;
  azure: number;
  total: number;
  change: number;
}

const ROWS: MonthRow[] = [
  { month: 'Jun 2026', aws: 27840, azure: 14470, total: 42310, change: -10.2 },
  { month: 'May 2026', aws: 31200, azure: 15900, total: 47100, change: 10.8  },
  { month: 'Apr 2026', aws: 28400, azure: 14100, total: 42500, change: 6.5   },
  { month: 'Mar 2026', aws: 26100, azure: 13800, total: 39900, change: 3.1   },
  { month: 'Feb 2026', aws: 25500, azure: 13200, total: 38700, change: 6.6   },
  { month: 'Jan 2026', aws: 24200, azure: 12100, total: 36300, change: -21.6 },
];

function fmt(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

interface MonthlyBreakdownTableProps {
  /** Tablet: drop the Change column to reduce crowding at narrower widths */
  compact?: boolean;
}

export function MonthlyBreakdownTable({ compact = false }: MonthlyBreakdownTableProps) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E3DE', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19' }}>Monthly breakdown</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E3DE' }}>
            <Th align="left">Month</Th>
            <Th align="right">AWS</Th>
            <Th align="right">Azure</Th>
            <Th align="right">Total</Th>
            {!compact && <Th align="right">Change</Th>}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <MonthRowItem key={row.month} row={row} isLast={i === ROWS.length - 1} isFirst={i === 0} compact={compact} />
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
        padding: '0 16px',
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

function MonthRowItem({ row, isLast, isFirst, compact }: { row: MonthRow; isLast: boolean; isFirst: boolean; compact: boolean }) {
  const [hovered, setHovered] = useState(false);
  const down = row.change < 0;
  const trendColor = down ? '#4D7C5F' : '#B8473F';

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
      <td style={{ padding: '0 16px', fontSize: 14, color: '#1C1B19', fontWeight: isFirst ? 500 : 400, whiteSpace: 'nowrap' }}>
        {row.month}
        {isFirst && <span style={{ marginLeft: 6, fontSize: 11, color: '#9C9A92' }}>(current)</span>}
      </td>
      <td style={{ padding: '0 16px', fontSize: 14, color: '#1C1B19', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(row.aws)}
      </td>
      <td style={{ padding: '0 16px', fontSize: 14, color: '#1C1B19', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(row.azure)}
      </td>
      <td style={{ padding: '0 16px', fontSize: 14, color: '#1C1B19', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
        {fmt(row.total)}
      </td>
      {!compact && (
        <td style={{ padding: '0 16px', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            {down ? <ChevronDown size={12} color={trendColor} /> : <ChevronUp size={12} color={trendColor} />}
            <span style={{ fontSize: 12, fontWeight: 500, color: trendColor, fontVariantNumeric: 'tabular-nums' }}>
              {Math.abs(row.change)}%
            </span>
          </div>
        </td>
      )}
    </tr>
  );
}
