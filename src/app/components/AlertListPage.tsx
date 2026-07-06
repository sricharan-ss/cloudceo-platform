import { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { SecurityEventPanel, } from './SecurityEventPanel';
import { FilterChip } from './FilterChip';
import { SECURITY_EVENTS, type SecurityEvent } from './RecentSecurityEventsTable';

// Extend with more events for the full list
const ALL_EVENTS: SecurityEvent[] = [
  ...SECURITY_EVENTS,
  {
    id: '7',  description: 'Rate limit threshold exceeded',         severity: 'warning', time: '15h ago', sourceIp: '203.0.113.77',  targetEndpoint: '/api/cart',      ruleMatched: 'RateLimitRule-Cart',                     country: 'Brazil',        method: 'POST',
  },
  {
    id: '8',  description: 'Malformed request body detected',       severity: 'warning', time: '18h ago', sourceIp: '198.51.100.44',  targetEndpoint: '/api/products',  ruleMatched: 'AWS-AWSManagedRulesCommonRuleSet',       country: 'France',        method: 'PUT',
  },
  {
    id: '9',  description: 'Scanner/probe pattern identified',       severity: 'warning', time: '22h ago', sourceIp: '192.0.2.200',    targetEndpoint: '/.env',          ruleMatched: 'AWS-AWSManagedRulesCommonRuleSet',       country: 'Netherlands',   method: 'GET',
  },
  {
    id: '10', description: 'Credential stuffing attempt blocked',   severity: 'danger',  time: '2d ago',  sourceIp: '203.0.113.15',   targetEndpoint: '/api/login',     ruleMatched: 'AWS-AWSManagedRulesBotControlRuleSet',   country: 'Russia',        method: 'POST',
  },
];

type SortKey = 'description' | 'severity' | 'time';
type SortDir = 'asc' | 'desc';
type SevFilter = 'all' | 'critical' | 'warning';

interface AlertListPageProps {
  breadcrumbs: BreadcrumbItem[];
}

export function AlertListPage({ breadcrumbs }: AlertListPageProps) {
  const [search, setSearch]               = useState('');
  const [sevFilter, setSevFilter]         = useState<SevFilter>('all');
  const [sortKey, setSortKey]             = useState<SortKey>('time');
  const [sortDir, setSortDir]             = useState<SortDir>('desc');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = ALL_EVENTS
    .filter(e => {
      const matchSearch = search === '' || e.description.toLowerCase().includes(search.toLowerCase()) || e.sourceIp.includes(search) || e.targetEndpoint.toLowerCase().includes(search);
      const matchSev = sevFilter === 'all' || (sevFilter === 'critical' ? e.severity === 'danger' : e.severity === 'warning');
      return matchSearch && matchSev;
    })
    .sort((a, b) => {
      let v = 0;
      if (sortKey === 'description') v = a.description.localeCompare(b.description);
      if (sortKey === 'severity')    v = a.severity.localeCompare(b.severity);
      if (sortKey === 'time')        v = ALL_EVENTS.indexOf(a) - ALL_EVENTS.indexOf(b);
      return sortDir === 'asc' ? v : -v;
    });

  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={14} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search alerts, IPs, endpoints…"
            style={{
              width: '100%', height: 36, padding: '0 12px 0 32px', fontSize: 13,
              fontFamily: 'var(--dash-font)', borderRadius: 'var(--dash-radius-button)',
              border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)',
              color: 'var(--dash-text-primary)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Severity filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'critical', 'warning'] as SevFilter[]).map(f => (
            <FilterChip key={f} label={f === 'all' ? 'All' : f === 'critical' ? 'Critical' : 'Warning'} active={sevFilter === f} onClick={() => setSevFilter(f)} />
          ))}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--dash-text-muted)' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              <SortTh label="Alert description" sortKey="description" current={sortKey} dir={sortDir} onSort={sort} align="left" />
              <SortTh label="Severity"          sortKey="severity"    current={sortKey} dir={sortDir} onSort={sort} align="left" />
              <th style={{ padding: '0 20px', height: 44, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Source IP</th>
              <th style={{ padding: '0 20px', height: 44, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Endpoint</th>
              <SortTh label="Time" sortKey="time" current={sortKey} dir={sortDir} onSort={sort} align="right" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((event, i) => (
              <AlertRow key={event.id} event={event} isLast={i === filtered.length - 1} onClick={() => setSelectedEvent(event)} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: 14 }}>
                  No alerts match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Security detail panel */}
      <SecurityEventPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

function SortTh({ label, sortKey, current, dir, onSort, align }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void; align: 'left' | 'right';
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{ padding: '0 20px', height: 44, fontSize: 11, fontWeight: 600, color: active ? 'var(--dash-accent)' : 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: align, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        {active ? (dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
      </span>
    </th>
  );
}

function AlertRow({ event, isLast, onClick }: { event: SecurityEvent; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)', backgroundColor: hovered ? 'var(--dash-bg-page)' : 'transparent', cursor: 'pointer', transition: 'background-color 0.1s ease', height: 48 }}
    >
      <td style={{ padding: '0 20px', fontSize: 14, color: 'var(--dash-text-primary)', maxWidth: 300 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.description}</span>
      </td>
      <td style={{ padding: '0 20px' }}>
        <StatusBadge label={event.severity === 'danger' ? 'Critical' : 'Warning'} severity={event.severity} />
      </td>
      <td style={{ padding: '0 20px', fontSize: 13, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace' }}>{event.sourceIp}</td>
      <td style={{ padding: '0 20px', fontSize: 13, color: 'var(--dash-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>{event.targetEndpoint}</td>
      <td style={{ padding: '0 20px', fontSize: 13, color: 'var(--dash-text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>{event.time}</td>
    </tr>
  );
}
