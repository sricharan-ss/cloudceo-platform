import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import { Skeleton } from '../Skeleton';
import type { Notification } from '../../context/NotificationContext';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  compact?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export function NotificationList({
  notifications, isLoading, compact = false, selectedIds = new Set(), onToggleSelect, onMarkRead, onArchive
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div style={{ padding: compact ? 20 : 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Skeleton height={80} borderRadius={compact ? 0 : 10} />
        <Skeleton height={80} borderRadius={compact ? 0 : 10} />
        <Skeleton height={80} borderRadius={compact ? 0 : 10} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div style={{ backgroundColor: compact ? 'transparent' : 'var(--dash-bg-surface)', border: compact ? 'none' : '1px solid var(--dash-border)', borderRadius: compact ? 0 : 'var(--dash-radius-card)', padding: '48px 24px', textAlign: 'center' }}>
        <Bell size={28} color="var(--dash-text-muted)" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6 }}>You're all caught up.</div>
        <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>No new notifications to display.</div>
      </div>
    );
  }

  const grouped = notifications.reduce((acc, n) => {
    const key = n.dateStr || 'Earlier';
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ['Today', 'Yesterday', 'Earlier'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 0 : 24 }}>
      {groupOrder.map(group => {
        const items = grouped[group];
        if (!items || items.length === 0) return null;

        return (
          <div key={group}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: compact ? 0 : 12, padding: compact ? '16px 20px 8px' : 0, fontFamily: 'var(--dash-font)' }}>
              {group}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 0 : 8 }}>
              {items.map(n => (
                <NotificationCard
                  key={n.id}
                  n={n}
                  compact={compact}
                  isSelected={selectedIds.has(n.id)}
                  showCheckbox={!compact}
                  onToggleSelect={() => onToggleSelect?.(n.id)}
                  onMarkRead={() => onMarkRead(n.id)}
                  onArchive={() => onArchive(n.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
