interface BarItem {
  label: string;
  value: number;
  cloud?: 'aws' | 'azure';
}

interface HorizontalBarChartProps {
  title: string;
  items: BarItem[];
  labelWidth?: number;
  summaryLine?: React.ReactNode;
  barColor?: string;
  valueFormatter?: (v: number) => string;
}

function defaultFormat(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v}`;
}

export function HorizontalBarChart({ title, items, labelWidth = 110, summaryLine, barColor, valueFormatter }: HorizontalBarChartProps) {
  const fmt = valueFormatter ?? defaultFormat;
  const maxValue = Math.max(...items.map((i) => i.value));

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E3DE',
        borderRadius: 12,
        padding: 24,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 500, color: '#1C1B19', display: 'block', marginBottom: 20 }}>
        {title}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => {
          const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = barColor ?? (item.cloud === 'azure' ? '#8B85B8' : '#3B5BDB');
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 14,
                  color: '#1C1B19',
                  width: labelWidth,
                  flexShrink: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 28,
                  backgroundColor: '#F5F4F1',
                  borderRadius: '0 4px 4px 0',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '0 4px 4px 0',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1C1B19',
                  width: 52,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}
              >
                {fmt(item.value)}
              </span>
            </div>
          );
        })}
      </div>

      {summaryLine && (
        <>
          <div style={{ height: 1, backgroundColor: '#F0EFEB', margin: '16px 0 12px' }} />
          {summaryLine}
        </>
      )}
    </div>
  );
}
