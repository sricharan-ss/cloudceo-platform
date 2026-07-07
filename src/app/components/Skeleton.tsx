import React from 'react';

export function Skeleton({ width = '100%', height = 20, borderRadius = 'var(--dash-radius-card)', style }: { width?: number | string, height?: number | string, borderRadius?: number | string, style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--dash-border)',
        opacity: 0.6,
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style
      }}
    />
  );
}

export function PageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 0', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Skeleton height={300} style={{ flex: 2, minWidth: 300 }} />
        <Skeleton height={300} style={{ flex: 1, minWidth: 300 }} />
      </div>
      <Skeleton height={400} />
    </div>
  );
}

// Add keyframes to a style tag if not present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
}
