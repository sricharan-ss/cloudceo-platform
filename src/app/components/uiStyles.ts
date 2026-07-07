import type { CSSProperties } from 'react';

export const surfaceCardStyle: CSSProperties = {
  backgroundColor: 'var(--dash-bg-surface)',
  border: '1px solid var(--dash-border)',
  borderRadius: 'var(--dash-radius-card)',
};

export const sectionHeadingStyle: CSSProperties = {
  fontSize: 'var(--dash-text-2xl)',
  fontWeight: 600,
  color: 'var(--dash-text-primary)',
  marginBottom: 'var(--dash-space-xs)',
};

export const sectionDescriptionStyle: CSSProperties = {
  fontSize: 'var(--dash-text-md)',
  color: 'var(--dash-text-secondary)',
  lineHeight: 1.55,
};

export const pageTitleStyle: CSSProperties = {
  fontSize: 'var(--dash-text-4xl)',
  fontWeight: 700,
  color: 'var(--dash-text-primary)',
  marginBottom: 'var(--dash-space-xs)',
};

export const pageDescriptionStyle: CSSProperties = {
  fontSize: 'var(--dash-text-md)',
  color: 'var(--dash-text-secondary)',
};

export const primaryButtonStyle: CSSProperties = {
  border: 'none',
  borderRadius: 'var(--dash-radius-button)',
  backgroundColor: 'var(--dash-accent)',
  color: '#FFFFFF',
  fontSize: 'var(--dash-text-md)',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'var(--dash-font)',
  transition: 'background-color 0.15s ease',
  minHeight: 'var(--dash-touch-target)',
};

export const secondaryButtonStyle: CSSProperties = {
  border: '1px solid var(--dash-border)',
  borderRadius: 'var(--dash-radius-button)',
  background: 'var(--dash-bg-surface)',
  color: 'var(--dash-text-primary)',
  fontSize: 'var(--dash-text-md)',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'var(--dash-font)',
  minHeight: 'var(--dash-touch-target)',
};

export const iconButtonStyle: CSSProperties = {
  border: '1px solid var(--dash-border)',
  borderRadius: 'var(--dash-radius-button)',
  background: 'var(--dash-bg-surface)',
  color: 'var(--dash-text-secondary)',
  fontSize: 'var(--dash-text-md)',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'var(--dash-font)',
};

export const inputBaseStyle: CSSProperties = {
  fontSize: 'var(--dash-text-md)',
  fontFamily: 'var(--dash-font)',
  borderRadius: 'var(--dash-radius-button)',
  border: '1px solid var(--dash-border)',
  color: 'var(--dash-text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

export const badgeBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 'var(--dash-text-sm)',
  fontWeight: 500,
  padding: '3px 8px',
  borderRadius: 'var(--dash-radius-pill)',
  whiteSpace: 'nowrap',
};

export const filterChipStyle: CSSProperties = {
  ...badgeBaseStyle,
  cursor: 'pointer',
  border: '1px solid var(--dash-border)',
  backgroundColor: 'var(--dash-bg-surface)',
  color: 'var(--dash-text-secondary)',
  transition: 'all 0.12s ease',
};

export const metricLabelStyle: CSSProperties = {
  fontSize: 'var(--dash-text-2xs)',
  fontWeight: 600,
  color: 'var(--dash-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: 6,
};
