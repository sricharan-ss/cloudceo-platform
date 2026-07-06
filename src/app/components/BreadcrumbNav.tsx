import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  if (items.length <= 1) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginBottom: 'var(--dash-space-xl)',
        fontFamily: 'var(--dash-font)',
        flexWrap: 'wrap',
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <ChevronRight size={12} color="var(--dash-text-muted)" />}
            {isLast ? (
              <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', fontWeight: 500 }}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: 13,
                  color: 'var(--dash-text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--dash-font)',
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-accent)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-secondary)'; }}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
