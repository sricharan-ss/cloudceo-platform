import { sectionDescriptionStyle, sectionHeadingStyle } from './uiStyles';

interface SectionHeaderProps {
  title: string;
  description?: string;
  marginBottom?: number;
}

export function SectionHeader({ title, description, marginBottom = 20 }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom }}>
      <div style={sectionHeadingStyle}>{title}</div>
      {description && <div style={sectionDescriptionStyle}>{description}</div>}
    </div>
  );
}
