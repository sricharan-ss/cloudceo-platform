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
        backgroundColor,
        border: '1px solid var(--dash-border)',
        borderRadius: 'var(--dash-radius-card)',
        padding,
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: valueSize, fontWeight: 700, color: valueColor, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}
