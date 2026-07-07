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
  /** Reduces padding from 24px to 16px for narrow mobile 2-column grids */
  compact?: boolean;
  onClick?: () => void;
}

export function StatCard({ label, value, trend, badge, icon, valueSize = 28, labelSize = 12, compact = false, onClick }: StatCardProps) {
  const [hovered, setHovered] = useState(false);

  const isGood = trend ? trend.direction === trend.goodDirection : false;
  const trendColor = isGood ? 'var(--dash-success)' : 'var(--dash-danger)';
  const pad = compact ? 16 : 24;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--dash-bg-surface)',
        border: `1px solid ${hovered && onClick ? 'var(--dash-border-strong)' : 'var(--dash-border)'}`,
        borderRadius: 12,
        padding: pad,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        fontFamily: 'var(--dash-font)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 500,
            color: 'var(--dash-text-secondary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.4,
          }}
        >
          {label}
        </span>
        {icon && <span style={{ color: 'var(--dash-text-muted)' }}>{icon}</span>}
      </div>

      <div
        style={{
          fontSize: valueSize,
          fontWeight: 600,
          color: 'var(--dash-text-primary)',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 8,
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {trend.direction === 'up' ? (
            <ChevronUp size={13} color={trendColor} />
          ) : (
            <ChevronDown size={13} color={trendColor} />
          )}
          <span style={{ fontSize: 12, fontWeight: 500, color: trendColor, fontVariantNumeric: 'tabular-nums' }}>
            {trend.percentage}
          </span>
          <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginLeft: 2 }}>
            {trend.label ?? 'vs last month'}
          </span>
        </div>
      )}

      {badge && <div style={{ marginTop: trend ? 6 : 0 }}>{badge}</div>}
    </div>
  );
}
