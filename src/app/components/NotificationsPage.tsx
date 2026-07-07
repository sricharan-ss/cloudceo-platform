import { useState } from 'react';
import { Shield, DollarSign, Sparkles, FileText, Cloud, Server, Search, Check, Archive, Bell, Filter, X } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface NotificationsPageProps { breadcrumbs: BreadcrumbItem[] }

type Category = 'all' | 'security' | 'cost' | 'ai' | 'reports' | 'cloud' | 'infrastructure';
type Severity  = 'all' | 'critical' | 'warning' | 'info';

interface Notification {
  id: string; type: Category; severity: 'critical' | 'warning' | 'info';
  title: string; desc: string; time: string; cloud?: 'aws' | 'azure'; read: boolean;
  action?: string;
}

const ALL_NOTIFICATIONS: Notification[] = [
  { id: 'n1',  type: 'security',       severity: 'critical', title: 'SQL injection attempt blocked',          desc: 'WAF blocked a SQL injection payload on /api/checkout from 203.0.113.42.',         time: '2h ago',  cloud: 'aws',   read: false, action: 'View event'           },
  { id: 'n2',  type: 'cost',           severity: 'warning',  title: 'AWS spend at 85% of monthly budget',    desc: '$42,310 of $50,000 monthly budget consumed. On pace to exceed by $2,000.',         time: '5h ago',  cloud: 'aws',   read: false, action: 'View cost breakdown'  },
  { id: 'n3',  type: 'security',       severity: 'critical', title: 'XSS payload detected in query string',  desc: 'Cross-site scripting attempt blocked on /api/search from 198.51.100.17.',           time: '3h ago',  cloud: 'aws',   read: false, action: 'View incident'        },
  { id: 'n4',  type: 'ai',             severity: 'info',     title: 'AI analysis completed',                 desc: 'CloudCEO AI finished analysing your cloud environment. 5 new insights available.', time: '6h ago',              read: false, action: 'View insights'        },
  { id: 'n5',  type: 'cloud',          severity: 'info',     title: 'Azure VM autoscale triggered',           desc: 'East US 2 region — 3 new instances added due to traffic spike.',                    time: '12h ago', cloud: 'azure', read: true,  action: 'View resources'       },
  { id: 'n6',  type: 'security',       severity: 'warning',  title: 'WAF rule set updated',                  desc: 'AWS-AWSManagedRulesSQLiRuleSet updated to v2.1. Review new rule coverage.',          time: '1d ago',  cloud: 'aws',   read: true,  action: 'Review changes'       },
  { id: 'n7',  type: 'reports',        severity: 'info',     title: 'Monthly cost report generated',         desc: 'May 2026 billing summary is ready for download. Total spend: $47,100.',              time: '2d ago',              read: true,  action: 'Download report'      },
  { id: 'n8',  type: 'cost',           severity: 'warning',  title: 'Unusual traffic spike detected',        desc: 'From 198.51.100.17 — 218 requests blocked. May indicate a scraping attempt.',       time: '1d ago',  cloud: 'aws',   read: true,  action: 'View security log'    },
  { id: 'n9',  type: 'cloud',          severity: 'info',     title: 'AWS Cost Explorer sync complete',       desc: 'Billing data refreshed successfully. 346 resources indexed.',                        time: '1d ago',  cloud: 'aws',   read: true,  action: undefined              },
  { id: 'n10', type: 'infrastructure', severity: 'warning',  title: 'EC2 capacity at 78% utilisation',      desc: 'Production cluster approaching limit. Forecast to hit 85% by August 14.',            time: '2d ago',  cloud: 'aws',   read: true,  action: 'View forecast'        },
  { id: 'n11', type: 'ai',             severity: 'info',     title: '3 new recommendations available',      desc: 'CloudCEO AI identified $1,712/month in optimization opportunities.',                   time: '3d ago',              read: true,  action: 'View recommendations' },
  { id: 'n12', type: 'reports',        severity: 'info',     title: 'Security assessment report ready',      desc: 'Q2 2026 security assessment has been generated (8 pages).',                           time: '3d ago',              read: true,  action: 'View report'          },
];

const CAT_ICONS: Record<Category, React.ElementType> = {
  all: Bell, security: Shield, cost: DollarSign, ai: Sparkles,
  reports: FileText, cloud: Cloud, infrastructure: Server,
};

const CAT_LABELS: Record<Category, string> = {
  all: 'All', security: 'Security', cost: 'Cost', ai: 'AI',
  reports: 'Reports', cloud: 'Cloud', infrastructure: 'Infrastructure',
};

const SEV_COLOR = { critical: 'var(--dash-danger)', warning: 'var(--dash-warning)', info: 'var(--dash-accent)' };
const SEV_BG    = { critical: 'var(--dash-danger-tint)', warning: 'var(--dash-warning-tint)', info: 'var(--dash-accent-tint)' };
const TYPE_COLOR: Record<Category, string> = {
  all: 'var(--dash-accent)', security: 'var(--dash-danger)', cost: 'var(--dash-success)',
  ai: 'var(--dash-accent)', reports: 'var(--dash-success)', cloud: 'var(--dash-neutral-chart)', infrastructure: 'var(--dash-warning)',
};

export function NotificationsPage({ breadcrumbs }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [category, setCategory]           = useState<Category>('all');
  const [severity, setSeverity]           = useState<Severity>('all');
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  const markRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const archive = (id: string) => setNotifications(n => n.filter(x => x.id !== id));
  const archiveSelected = () => { setNotifications(n => n.filter(x => !selected.has(x.id))); setSelected(new Set()); };
  const toggleSelect = (id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(p => p.size === visible.length ? new Set() : new Set(visible.map(n => n.id)));

  const visible = notifications.filter(n => {
    const matchCat = category === 'all' || n.type === category;
    const matchSev = severity === 'all' || n.severity === severity;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSev && matchSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const CATEGORIES: Category[] = ['all', 'security', 'cost', 'ai', 'reports', 'cloud', 'infrastructure'];

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
            <button onClick={archiveSelected} style={{ padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 5 }}>
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
          {visible.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 8, marginBottom: 10 }}>
              <input type="checkbox" checked={selected.size === visible.length && visible.length > 0} onChange={toggleAll}
                style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--dash-accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>
                {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
              </span>
              {selected.size > 0 && (
                <button onClick={archiveSelected} style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 11, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Archive size={11} /> Archive selected
                </button>
              )}
            </div>
          )}

          {/* Notification cards */}
          {visible.length === 0 ? (
            <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '40px 24px', textAlign: 'center' }}>
              <Bell size={28} color="var(--dash-text-muted)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6 }}>No notifications</div>
              <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>No notifications match the current filters.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.map(n => {
                const Icon = CAT_ICONS[n.type];
                const isSelected = selected.has(n.id);
                return (
                  <div key={n.id}
                    style={{
                      backgroundColor: n.read ? 'var(--dash-bg-surface)' : 'var(--dash-accent-tint)',
                      border: `1px solid ${isSelected ? 'var(--dash-accent)' : n.read ? 'var(--dash-border)' : 'var(--dash-accent)25'}`,
                      borderRadius: 10, padding: '14px 16px',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      cursor: 'pointer', transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Checkbox */}
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(n.id)} onClick={e => e.stopPropagation()}
                      style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'var(--dash-accent)', flexShrink: 0, marginTop: 3 }} />

                    {/* Category icon */}
                    <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: SEV_BG[n.severity], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={SEV_COLOR[n.severity]} strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 600, color: 'var(--dash-text-primary)', lineHeight: 1.35, fontFamily: 'var(--dash-font)' }}>{n.title}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', display: 'inline-block' }} />}
                          <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--dash-font)' }}>{n.time}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.55, marginBottom: 8, fontFamily: 'var(--dash-font)' }}>{n.desc}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <StatusBadge label={n.severity.charAt(0).toUpperCase() + n.severity.slice(1)} severity={n.severity === 'critical' ? 'danger' : n.severity === 'warning' ? 'warning' : 'success'} />
                        {n.cloud && <CloudBadge variant={n.cloud} />}
                        {n.action && (
                          <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                            style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 11, fontWeight: 500, color: 'var(--dash-accent)', cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'border-color 0.12s ease' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-accent)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
                            {n.action} →
                          </button>
                        )}
                        <button onClick={e => { e.stopPropagation(); archive(n.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', padding: '3px 4px', display: 'flex', alignItems: 'center' }}>
                          <X size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
