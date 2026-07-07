import { filterChipStyle } from './uiStyles';

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
        ...filterChipStyle,
        border: `1px solid ${active ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
        backgroundColor: active ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)',
        color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
      }}
    >
      {label}
    </button>
  );
}
