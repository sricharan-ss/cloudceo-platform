interface SectionHeaderProps {
  title: string;
  description?: string;
  marginBottom?: number;
}

export function SectionHeader({ title, description, marginBottom = 20 }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', lineHeight: 1.55 }}>{description}</div>}
    </div>
  );
}
