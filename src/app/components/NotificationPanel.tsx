import { useState } from 'react';
import { X, Shield, DollarSign, Cloud, Info, AlertTriangle, Check, Settings, ArrowLeft } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

export interface Notification {
  id: string;
  type: 'security' | 'billing' | 'cloud-sync' | 'system';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const INITIAL: Notification[] = [
  { id: '1', type: 'security',   severity: 'critical', title: 'SQL injection attempt blocked',    desc: 'On /api/checkout from 203.0.113.42',         time: '2h ago',  read: false },
  { id: '2', type: 'billing',    severity: 'warning',  title: 'AWS spend at 85% of budget',       desc: '$42,310 of $50,000 monthly budget used',     time: '5h ago',  read: false },
  { id: '3', type: 'security',   severity: 'critical', title: 'XSS payload detected',             desc: 'In query string on /api/search',             time: '3h ago',  read: false },
  { id: '4', type: 'cloud-sync', severity: 'info',     title: 'Azure VM autoscale triggered',     desc: 'East US 2 region — 3 instances added',       time: '12h ago', read: true  },
  { id: '5', type: 'security',   severity: 'warning',  title: 'WAF rule set updated',             desc: 'AWS-AWSManagedRulesSQLiRuleSet → v2.1',      time: '1d ago',  read: true  },
  { id: '6', type: 'billing',    severity: 'info',     title: 'Monthly cost report ready',        desc: 'May 2026 billing summary is available',      time: '2d ago',  read: true  },
  { id: '7', type: 'security',   severity: 'warning',  title: 'Unusual traffic spike',            desc: 'From 198.51.100.17 — 218 requests blocked',  time: '1d ago',  read: true  },
  { id: '8', type: 'cloud-sync', severity: 'info',     title: 'AWS Cost Explorer sync complete',  desc: 'Billing data refreshed successfully',        time: '1d ago',  read: true  },
];

type Filter = 'all' | 'unread' | 'critical' | 'billing' | 'security';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'unread',   label: 'Unread'   },
  { id: 'critical', label: 'Critical' },
  { id: 'billing',  label: 'Billing'  },
  { id: 'security', label: 'Security' },
];

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<Filter>('all');
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const markRead    = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const visible = notifications.filter(n => {
    if (filter === 'unread')   return !n.read;
    if (filter === 'critical') return n.severity === 'critical';
    if (filter === 'billing')  return n.type === 'billing';
    if (filter === 'security') return n.type === 'security';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mobile: full-screen (no overlay, no slide-over)
  const panelStyle: React.CSSProperties = isMobile
    ? { position: 'fixed', inset: 0, backgroundColor: 'var(--dash-bg-surface)', zIndex: 49, display: 'flex', flexDirection: 'column', fontFamily: 'var(--dash-font)' }
    : { position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, backgroundColor: 'var(--dash-bg-surface)', borderLeft: '1px solid var(--dash-border)', zIndex: 49, display: 'flex', flexDirection: 'column', fontFamily: 'var(--dash-font)' };

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
        <div style={{ display: 'flex', borderBottom: '1px solid var(--dash-border)', flexShrink: 0, paddingLeft: 4, overflowX: 'auto' }}>
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
          {visible.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: 14 }}>
              No notifications in this category
            </div>
          ) : (
            visible.map(n => <NotificationRow key={n.id} n={n} onMarkRead={() => markRead(n.id)} />)
          )}
        </div>
      </div>
    </>
  );
}

function NotificationRow({ n, onMarkRead }: { n: Notification; onMarkRead: () => void }) {
  const [hovered, setHovered] = useState(false);

  const icon = n.type === 'security' ? <Shield size={16} strokeWidth={1.5} /> :
               n.type === 'billing'  ? <DollarSign size={16} strokeWidth={1.5} /> :
               n.type === 'cloud-sync' ? <Cloud size={16} strokeWidth={1.5} /> :
               <Info size={16} strokeWidth={1.5} />;

  const iconColor = n.severity === 'critical' ? 'var(--dash-danger)' :
                    n.severity === 'warning'  ? 'var(--dash-warning)' : 'var(--dash-accent)';

  const iconBg = n.severity === 'critical' ? 'var(--dash-danger-tint)' :
                 n.severity === 'warning'  ? 'var(--dash-warning-tint)' : 'var(--dash-accent-tint)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--dash-border-light)',
        backgroundColor: n.read ? 'transparent' : 'var(--dash-accent-tint)',
        display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
        transition: 'background-color 0.1s',
      }}
      onClick={() => { if (!n.read) onMarkRead(); }}
    >
      {/* Icon */}
      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: iconColor }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: n.read ? 400 : 500, color: 'var(--dash-text-primary)', lineHeight: 1.4 }}>
            {n.title}
          </span>
          <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', marginTop: 3, lineHeight: 1.5 }}>{n.desc}</div>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', flexShrink: 0, marginTop: 6 }} />
      )}
    </div>
  );
}

export function getUnreadCount() {
  return INITIAL.filter(n => !n.read).length;
}
