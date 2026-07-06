import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DATA = [
  { time: '00:00', allowed: 9842,  blocked: 42 },
  { time: '02:00', allowed: 8640,  blocked: 38 },
  { time: '04:00', allowed: 8213,  blocked: 35 },
  { time: '06:00', allowed: 9510,  blocked: 44 },
  { time: '08:00', allowed: 11428, blocked: 55 },
  { time: '10:00', allowed: 13204, blocked: 72 },
  { time: '12:00', allowed: 14215, blocked: 89 },
  { time: '14:00', allowed: 13870, blocked: 81 },
  { time: '16:00', allowed: 12834, blocked: 76 },
  { time: '18:00', allowed: 12100, blocked: 68 },
  { time: '20:00', allowed: 13120, blocked: 62 },
  { time: '22:00', allowed: 11840, blocked: 54 },
  { time: 'Now',   allowed: 11200, blocked: 48 },
];

interface RequestVolumeChartProps {
  chartHeight?: number;
}

export function RequestVolumeChart({ chartHeight = 220 }: RequestVolumeChartProps) {
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
          Request volume
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LegendDot color="var(--dash-accent)" label="Allowed" />
          <LegendDot color="var(--dash-danger)" label="Blocked" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--dash-border-light)" vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            yAxisId="main"
            orientation="left"
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <YAxis
            yAxisId="blocked"
            orientation="right"
            tickFormatter={(v: number) => `${v}`}
            tick={{ fontSize: 11, fill: 'var(--dash-text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              name === 'allowed' ? value.toLocaleString() : value.toString(),
              name === 'allowed' ? 'Allowed' : 'Blocked',
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
          <Line
            key="allowed"
            yAxisId="main"
            type="monotone"
            dataKey="allowed"
            stroke="var(--dash-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
          <Line
            key="blocked"
            yAxisId="blocked"
            type="monotone"
            dataKey="blocked"
            stroke="var(--dash-danger)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
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
