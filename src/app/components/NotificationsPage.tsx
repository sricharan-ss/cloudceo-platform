import { useState } from 'react';
import { Search, Check, Archive } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useNotifications, Category, Severity } from '../context/NotificationContext';
import { NotificationList } from './notifications/NotificationList';
import { CAT_ICONS } from './notifications/NotificationCard';
import { SEV_COLOR } from './notifications/NotificationCard';

interface NotificationsPageProps { breadcrumbs: BreadcrumbItem[] }

const CAT_LABELS: Record<Category, string> = {
  all: 'All', security: 'Security', cost: 'Cost', ai: 'AI',
  reports: 'Reports', cloud: 'Cloud', infrastructure: 'Infrastructure', system: 'System',
};

const TYPE_COLOR: Record<Category, string> = {
  all: 'var(--dash-accent)', security: 'var(--dash-danger)', cost: 'var(--dash-success)',
  ai: 'var(--dash-accent)', reports: 'var(--dash-success)', cloud: 'var(--dash-neutral-chart)',
  infrastructure: 'var(--dash-warning)', system: 'var(--dash-text-muted)'
};

export function NotificationsPage({ breadcrumbs }: NotificationsPageProps) {
  const { notifications, isLoading, unreadCount, markRead, markAllRead, archive, archiveSelected } = useNotifications();
  const [category, setCategory]           = useState<Category>('all');
  const [severity, setSeverity]           = useState<Severity>('all');
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const toggleSelect = (id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(p => p.size === visible.length ? new Set() : new Set(visible.map(n => n.id)));

  const handleArchiveSelected = () => {
    archiveSelected(selected);
    setSelected(new Set());
  };

  const visible = notifications.filter(n => {
    const matchCat = category === 'all' || n.type === category;
    const matchSev = severity === 'all' || n.severity === severity;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSev && matchSearch;
  });

  const CATEGORIES: Category[] = ['all', 'security', 'cost', 'ai', 'reports', 'cloud', 'infrastructure', 'system'];

  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text-primary)' }}>Notification Center</div>
            {unreadCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: 'var(--dash-danger)', color: '#FFFFFF', borderRadius: 999, padding: '2px 8px' }}>{unreadCount} unread</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>All platform alerts, updates, and AI insights</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 5, transition: 'border-color 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
              <Check size={13} /> Mark all read
            </button>
          )}
          {selected.size > 0 && (
            <button onClick={handleArchiveSelected} style={{ padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Archive size={13} /> Archive {selected.size}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16, alignItems: 'flex-start' }}>

        {/* ── Left filter panel (desktop) / horizontal tabs (mobile) ── */}
        {isMobile ? (
          <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 4, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => {
              const Icon = CAT_ICONS[cat];
              const active = category === cat;
              const count = cat === 'all' ? notifications.length : notifications.filter(n => n.type === cat).length;
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: `1px solid ${active ? 'var(--dash-accent)' : 'var(--dash-border)'}`, backgroundColor: active ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)', color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--dash-font)', transition: 'all 0.12s ease', flexShrink: 0 }}>
                  <Icon size={12} strokeWidth={1.5} />
                  {CAT_LABELS[cat]}
                  {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: active ? 'var(--dash-accent)' : 'var(--dash-border)', color: active ? '#FFFFFF' : 'var(--dash-text-muted)', borderRadius: 999, padding: '1px 5px' }}>{count}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden', position: 'sticky', top: 96 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--dash-border)', fontSize: 11, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Categories</div>
            <nav style={{ padding: '6px 0' }}>
              {CATEGORIES.map(cat => {
                const Icon = CAT_ICONS[cat];
                const active = category === cat;
                const count = cat === 'all' ? notifications.length : notifications.filter(n => n.type === cat).length;
                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', border: 'none', background: active ? 'var(--dash-accent-tint)' : 'none', cursor: 'pointer', color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)', fontSize: 13, fontWeight: active ? 500 : 400, textAlign: 'left', fontFamily: 'var(--dash-font)', borderLeft: active ? '3px solid var(--dash-accent)' : '3px solid transparent', transition: 'background-color 0.1s ease' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} strokeWidth={1.5} style={{ color: TYPE_COLOR[cat] }} />
                      {CAT_LABELS[cat]}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, backgroundColor: active ? 'var(--dash-accent)' : 'var(--dash-border)', color: active ? '#FFFFFF' : 'var(--dash-text-muted)', borderRadius: 999, padding: '1px 6px', minWidth: 20, textAlign: 'center' }}>{count}</span>
                  </button>
                );
              })}
            </nav>

            {/* Severity filter */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--dash-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>Severity</div>
              {(['all', 'critical', 'warning', 'info'] as Severity[]).map(sev => (
                <button key={sev} onClick={() => setSeverity(sev)}
                  style={{ width: '100%', textAlign: 'left', padding: '5px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: severity === sev ? 600 : 400, color: severity === sev ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {sev !== 'all' && <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: SEV_COLOR[sev as keyof typeof SEV_COLOR], display: 'inline-block', flexShrink: 0 }} />}
                  <span style={{ textTransform: 'capitalize' }}>{sev === 'all' ? 'All severities' : sev}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main notification list ── */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <Search size={13} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notifications…"
                style={{ width: '100%', height: 34, padding: '0 10px 0 30px', fontSize: 13, fontFamily: 'var(--dash-font)', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>{visible.length} notification{visible.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Bulk select bar */}
          {visible.length > 0 && !isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 8, marginBottom: 10 }}>
              <input type="checkbox" checked={selected.size === visible.length && visible.length > 0} onChange={toggleAll}
                style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--dash-accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>
                {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
              </span>
              {selected.size > 0 && (
                <button onClick={handleArchiveSelected} style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 11, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Archive size={11} /> Archive selected
                </button>
              )}
            </div>
          )}

          <NotificationList
            notifications={visible}
            isLoading={isLoading}
            compact={false}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
            onMarkRead={markRead}
            onArchive={archive}
          />
        </div>
      </div>
    </div>
  );
}
