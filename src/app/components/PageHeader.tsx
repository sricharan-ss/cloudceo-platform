import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  marginBottom?: number;
}

export function PageHeader({ title, description, actions, marginBottom = 24 }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{title}</div>
        {description && <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>{description}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}
