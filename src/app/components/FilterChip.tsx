interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${active ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
        backgroundColor: active ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)',
        color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
        fontFamily: 'var(--dash-font)',
        transition: 'all 0.12s ease',
      }}
    >
      {label}
    </button>
  );
}
