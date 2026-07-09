import { badgeBaseStyle } from './uiStyles';

type Severity = 'success' | 'warning' | 'danger' | 'info' | string;

const COLORS: Record<Severity, { bg: string; text: string; dot: string }> = {
  success: { bg: 'var(--dash-success-tint)', text: 'var(--dash-success-text)', dot: 'var(--dash-success)' },
  warning: { bg: 'var(--dash-warning-tint)', text: 'var(--dash-warning-text)', dot: 'var(--dash-warning)' },
  danger:  { bg: 'var(--dash-danger-tint)', text: 'var(--dash-danger-text)', dot: 'var(--dash-danger)' },
  info:    { bg: 'var(--dash-info-tint)', text: 'var(--dash-info-text)', dot: 'var(--dash-info)' },
};

const FALLBACK = { bg: 'var(--dash-bg-surface)', text: 'var(--dash-text-secondary)', dot: 'var(--dash-border)' };

interface StatusBadgeProps {
  label: string;
  severity: Severity;
}

export function StatusBadge({ label, severity }: StatusBadgeProps) {
  const c = COLORS[severity] || FALLBACK;
  return (
    <span
      style={{
        ...badgeBaseStyle,
        backgroundColor: c.bg,
        color: c.text,
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
