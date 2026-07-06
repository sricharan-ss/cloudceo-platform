import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TrendProps {
  direction: 'up' | 'down';
  percentage: string;
  label?: string;
  /** For cost metrics, down = good (green). For threat count, down = good too. */
  goodDirection: 'up' | 'down';
}

interface StatCardProps {
  label: string;
  value: string;
  trend?: TrendProps;
  badge?: ReactNode;
  icon?: ReactNode;
  valueSize?: number;
  labelSize?: number;
  onClick?: () => void;
}

export function StatCard({ label, value, trend, badge, icon, valueSize = 28, labelSize = 12, onClick }: StatCardProps) {
  const [hovered, setHovered] = useState(false);

  const isGood = trend ? trend.direction === trend.goodDirection : false;
  const trendColor = isGood ? '#4D7C5F' : '#B8473F';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid ${hovered && onClick ? '#D1CFC8' : '#E5E3DE'}`,
        borderRadius: 12,
        padding: 24,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 500,
            color: '#6B6A64',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        {icon && <span style={{ color: '#9C9A92' }}>{icon}</span>}
      </div>

      <div
        style={{
          fontSize: valueSize,
          fontWeight: 600,
          color: '#1C1B19',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 8,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {trend.direction === 'up' ? (
            <ChevronUp size={13} color={trendColor} />
          ) : (
            <ChevronDown size={13} color={trendColor} />
          )}
          <span style={{ fontSize: 12, fontWeight: 500, color: trendColor, fontVariantNumeric: 'tabular-nums' }}>
            {trend.percentage}
          </span>
          <span style={{ fontSize: 12, color: '#9C9A92', marginLeft: 2 }}>
            {trend.label ?? 'vs last month'}
          </span>
        </div>
      )}

      {badge && <div style={{ marginTop: trend ? 6 : 0 }}>{badge}</div>}
    </div>
  );
}
