import { metricLabelStyle, surfaceCardStyle } from './uiStyles';

interface SummaryMetricCardProps {
  label: string;
  value: string;
  valueColor: string;
  backgroundColor?: string;
  padding?: string;
  valueSize?: number;
}

export function SummaryMetricCard({
  label,
  value,
  valueColor,
  backgroundColor = 'var(--dash-bg-surface)',
  padding = '14px 16px',
  valueSize = 22,
}: SummaryMetricCardProps) {
  return (
    <div
      style={{
        ...surfaceCardStyle,
        backgroundColor,
        padding,
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={metricLabelStyle}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 700, color: valueColor, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}
