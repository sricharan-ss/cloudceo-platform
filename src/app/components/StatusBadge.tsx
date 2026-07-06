type Severity = 'success' | 'warning' | 'danger';

const COLORS: Record<Severity, { bg: string; text: string; dot: string }> = {
  success: { bg: '#EDF3EE', text: '#2D5A3D', dot: '#4D7C5F' },
  warning: { bg: '#FAF1E2', text: '#7A5A1E', dot: '#B8862E' },
  danger:  { bg: '#F8EBEA', text: '#7A2E2A', dot: '#B8473F' },
};

interface StatusBadgeProps {
  label: string;
  severity: Severity;
}

export function StatusBadge({ label, severity }: StatusBadgeProps) {
  const c = COLORS[severity];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        backgroundColor: c.bg,
        color: c.text,
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: c.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
