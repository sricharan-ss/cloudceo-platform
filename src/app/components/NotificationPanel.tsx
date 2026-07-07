import { useState } from 'react';
import { X, ArrowLeft, Settings, Check } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useNotifications, Category, Severity } from '../context/NotificationContext';
import { NotificationList } from './notifications/NotificationList';

const FILTERS: { id: Category | 'unread' | 'critical'; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'unread',   label: 'Unread'   },
  { id: 'critical', label: 'Critical' },
  { id: 'cost',     label: 'Cost'  },
  { id: 'security', label: 'Security' },
];

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, isLoading, unreadCount, markRead, markAllRead, archive } = useNotifications();
  const [filter, setFilter] = useState<Category | 'unread' | 'critical'>('all');
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const visible = notifications.filter(n => {
    if (filter === 'unread')   return !n.read;
    if (filter === 'critical') return n.severity === 'critical';
    if (filter === 'all')      return true;
    return n.type === filter;
  });

  const panelStyle: React.CSSProperties = isMobile
    ? { position: 'fixed', inset: 0, backgroundColor: 'var(--dash-bg-surface)', zIndex: 49, display: 'flex', flexDirection: 'column', fontFamily: 'var(--dash-font)' }
    : { position: 'fixed', top: 0, right: 0, bottom: 0, width: isTablet ? '350px' : '420px', backgroundColor: 'var(--dash-bg-surface)', borderLeft: '1px solid var(--dash-border)', zIndex: 49, display: 'flex', flexDirection: 'column', fontFamily: 'var(--dash-font)' };

  return (
    <>
      {/* Overlay (desktop/tablet only) */}
      {!isMobile && <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 48 }} />}

      {/* Panel */}
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ padding: '0 20px', height: 64, borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--dash-text-secondary)', padding: 4 }}>
              {isMobile ? <ArrowLeft size={18} strokeWidth={1.5} /> : <X size={18} strokeWidth={1.5} />}
            </button>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-danger)', backgroundColor: 'var(--dash-danger-tint)', padding: '2px 7px', borderRadius: 999 }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--dash-accent)', cursor: 'pointer', fontFamily: 'var(--dash-font)', fontWeight: 500 }}>
                Mark all read
              </button>
            )}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--dash-text-muted)' }}>
              <Settings size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--dash-border)', flexShrink: 0, paddingLeft: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '0 14px', height: 44, border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: filter === f.id ? 500 : 400, fontFamily: 'var(--dash-font)',
                color: filter === f.id ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                borderBottom: filter === f.id ? '2px solid var(--dash-accent)' : '2px solid transparent',
                whiteSpace: 'nowrap', marginBottom: -1,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <NotificationList
            notifications={visible}
            isLoading={isLoading}
            compact={true}
            onMarkRead={markRead}
            onArchive={archive}
          />
        </div>
      </div>
    </>
  );
}
