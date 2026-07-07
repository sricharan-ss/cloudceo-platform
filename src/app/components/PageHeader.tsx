import type { ReactNode } from 'react';
import { pageDescriptionStyle, pageTitleStyle } from './uiStyles';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  marginBottom?: number;
}

export function PageHeader({ title, description, actions, marginBottom = 24 }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom, flexWrap: 'wrap', gap: 'var(--dash-space-md)' }}>
      <div>
        <div style={pageTitleStyle}>{title}</div>
        {description && <div style={pageDescriptionStyle}>{description}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 'var(--dash-space-sm)' }}>{actions}</div>}
    </div>
  );
}
