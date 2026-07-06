import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DATA_6M = [
  { month: 'Jan', aws: 24200, azure: 12100 },
  { month: 'Feb', aws: 25500, azure: 13200 },
  { month: 'Mar', aws: 26100, azure: 13800 },
  { month: 'Apr', aws: 28400, azure: 14100 },
  { month: 'May', aws: 31200, azure: 15900 },
  { month: 'Jun', aws: 27840, azure: 14470 },
];

const DATA_12M = [
  { month: "Jul '25", aws: 22100, azure: 11200 },
  { month: "Aug '25", aws: 23400, azure: 11800 },
  { month: "Sep '25", aws: 24100, azure: 12300 },
  { month: "Oct '25", aws: 25800, azure: 12900 },
  { month: "Nov '25", aws: 28200, azure: 13400 },
  { month: "Dec '25", aws: 31500, azure: 14800 },
  { month: "Jan '26", aws: 24200, azure: 12100 },
  { month: "Feb '26", aws: 25500, azure: 13200 },
  { month: "Mar '26", aws: 26100, azure: 13800 },
  { month: "Apr '26", aws: 28400, azure: 14100 },
  { month: "May '26", aws: 31200, azure: 15900 },
  { month: "Jun '26", aws: 27840, azure: 14470 },
];

type View = 'combined' | 'aws' | 'azure';

interface SpendTrendChartProps {
  months?: 6 | 12;
  view?: View;
  rightSlot?: React.ReactNode;
  chartHeight?: number;
}

function formatY(v: number) {
  return `$${(v / 1000).toFixed(0)}k`;
}

export function SpendTrendChart({ months = 6, view = 'combined', rightSlot, chartHeight = 220 }: SpendTrendChartProps) {
  const data = months === 12 ? DATA_12M : DATA_6M;

  return (
    <div
      style={{
        backgroundColor: 'var(--dash-bg-surface)',
        border: '1px solid var(--dash-border)',
        borderRadius: 'var(--dash-radius-card)',
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>
          {months === 12 ? '12-month cost trend' : 'Cloud spend trend'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {(view === 'combined' || view === 'aws') && (
              <LegendDot color="var(--dash-accent)" label="AWS" />
            )}
            {(view === 'combined' || view === 'azure') && (
              <LegendDot color="var(--dash-neutral-chart)" label="Azure" />
            )}
          </div>
          {rightSlot}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--dash-border-light)" vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval={months === 12 ? 1 : 0}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `$${(value as number).toLocaleString()}`,
              name === 'aws' ? 'AWS' : 'Azure',
            ]}
            contentStyle={{
              fontSize: 12,
              border: '1px solid var(--dash-border)',
              borderRadius: 8,
              boxShadow: 'none',
              color: 'var(--dash-text-primary)',
              fontFamily: 'var(--dash-font)',
            }}
            cursor={{ stroke: 'var(--dash-border)', strokeWidth: 1 }}
          />
          {(view === 'combined' || view === 'aws') && (
            <Line
              key="aws"
              type="monotone"
              dataKey="aws"
              stroke="var(--dash-accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          )}
          {(view === 'combined' || view === 'azure') && (
            <Line
              key="azure"
              type="monotone"
              dataKey="azure"
              stroke="var(--dash-neutral-chart)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
      <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>{label}</span>
    </div>
  );
}
