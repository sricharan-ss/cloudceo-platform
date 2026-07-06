export type CloudVariant = 'aws' | 'azure';

const CONFIG: Record<CloudVariant, { label: string; bg: string; text: string; dot: string }> = {
  aws:   { label: 'AWS',   bg: '#EDF3EE', text: '#2D5A3D', dot: '#4D7C5F' },
  azure: { label: 'Azure', bg: '#FAF1E2', text: '#7A5A1E', dot: '#B8862E' },
};

interface CloudBadgeProps {
  variant: CloudVariant;
}

export function CloudBadge({ variant }: CloudBadgeProps) {
  const c = CONFIG[variant];
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
      {c.label}
    </span>
  );
}
