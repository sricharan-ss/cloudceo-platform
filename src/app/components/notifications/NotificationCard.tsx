import { useState } from 'react';
import { Shield, DollarSign, Sparkles, FileText, Cloud, Server, Bell, X } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { CloudBadge } from '../CloudBadge';
import type { Notification, Category } from '../../context/NotificationContext';
import { useNavigate } from 'react-router';

export const CAT_ICONS: Record<Category, React.ElementType> = {
  all: Bell, security: Shield, cost: DollarSign, ai: Sparkles,
  reports: FileText, cloud: Cloud, infrastructure: Server, system: Server,
};

export const SEV_COLOR = { critical: 'var(--dash-danger)', warning: 'var(--dash-warning)', info: 'var(--dash-accent)' };
export const SEV_BG    = { critical: 'var(--dash-danger-tint)', warning: 'var(--dash-warning-tint)', info: 'var(--dash-accent-tint)' };

interface NotificationCardProps {
  n: Notification;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onToggleSelect?: () => void;
  onMarkRead: () => void;
  onArchive: () => void;
  compact?: boolean; // True for panel, false for full page
}

export function NotificationCard({
  n, isSelected, showCheckbox, onToggleSelect, onMarkRead, onArchive, compact = false
}: NotificationCardProps) {
  const Icon = CAT_ICONS[n.type] || Bell;
  const navigate = useNavigate();
  
  return (
    <div
      style={{
        backgroundColor: n.read ? 'var(--dash-bg-surface)' : 'var(--dash-accent-tint)',
        border: compact
          ? `1px solid ${isSelected ? 'var(--dash-accent)' : 'var(--dash-border-light)'}`
          : `1px solid ${isSelected ? 'var(--dash-accent)' : n.read ? 'var(--dash-border)' : 'var(--dash-accent)25'}`,
        borderRadius: compact ? 0 : 10,
        padding: compact ? '14px 20px' : '14px 16px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: 'pointer', transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
        borderBottom: compact ? '1px solid var(--dash-border-light)' : undefined,
      }}
      onMouseEnter={e => { if (!compact) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
      onMouseLeave={e => { if (!compact) (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
      onClick={() => { if (!n.read) onMarkRead(); }}
    >
      {/* Checkbox for full page */}
      {showCheckbox && (
        <input type="checkbox" checked={isSelected} onChange={onToggleSelect} onClick={e => e.stopPropagation()}
          style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'var(--dash-accent)', flexShrink: 0, marginTop: 3 }} />
      )}

      {/* Category icon */}
      <div style={{ width: compact ? 32 : 34, height: compact ? 32 : 34, borderRadius: '50%', backgroundColor: SEV_BG[n.severity], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color={SEV_COLOR[n.severity]} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: n.read ? (compact ? 400 : 500) : 600, color: 'var(--dash-text-primary)', lineHeight: 1.35, fontFamily: 'var(--dash-font)' }}>{n.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', display: 'inline-block' }} />}
            <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--dash-font)' }}>{n.time}</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.55, marginBottom: compact ? 4 : 8, fontFamily: 'var(--dash-font)' }}>{n.desc}</div>
        
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {!compact && (
             <StatusBadge label={n.severity.charAt(0).toUpperCase() + n.severity.slice(1)} severity={n.severity === 'critical' ? 'danger' : n.severity === 'warning' ? 'warning' : 'success'} />
          )}
          {n.cloud && <CloudBadge variant={n.cloud} />}
          {n.action && (
            <button onClick={e => {
              e.stopPropagation();
              onMarkRead();
              if (n.type === 'security') navigate('/security');
              else if (n.type === 'cost') navigate('/cost');
              else if (n.type === 'reports') navigate('/reports');
              else if (n.type === 'cloud' || n.type === 'infrastructure') navigate('/resources');
            }}
              style={{ marginLeft: compact ? 0 : 'auto', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 11, fontWeight: 500, color: 'var(--dash-accent)', cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'border-color 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
              {n.action} →
            </button>
          )}
          {!compact && (
            <button onClick={e => { e.stopPropagation(); onArchive(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', padding: '3px 4px', display: 'flex', alignItems: 'center' }}>
              <X size={13} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
