import { badgeBaseStyle } from './uiStyles';

export type CloudVariant = 'aws' | 'azure';

const CONFIG: Record<CloudVariant, { label: string; bg: string; text: string; dot: string }> = {
  aws:   { label: 'AWS',   bg: 'var(--dash-aws-bg)', text: 'var(--dash-aws-text)', dot: 'var(--dash-aws-dot)' },
  azure: { label: 'Azure', bg: 'var(--dash-azure-bg)', text: 'var(--dash-azure-text)', dot: 'var(--dash-azure-dot)' },
};

interface CloudBadgeProps {
  variant: CloudVariant;
}

export function CloudBadge({ variant }: CloudBadgeProps) {
  const c = CONFIG[variant];
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
      {c.label}
    </span>
  );
}
