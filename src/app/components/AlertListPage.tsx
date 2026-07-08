import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Shield, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { SecurityEventPanel } from './SecurityEventPanel';
import { FilterChip } from './FilterChip';
import { inputBaseStyle } from './uiStyles';
import type { SecurityEventMock } from '../mocks/types';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useProvider } from '../context/ProviderContext';
import { getProviderMocks } from '../mocks';

export type SecurityEvent = SecurityEventMock;

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
  const bp = useBreakpoint();
  const { provider } = useProvider();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const mocks = getProviderMocks(provider);
  const allEvents = mocks.securityEvents;

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = allEvents
    .filter(e => {
      const matchSearch = search === '' || e.detail.toLowerCase().includes(search.toLowerCase()) || e.ip.includes(search) || (e.resource && e.resource.toLowerCase().includes(search));
      const matchSev = sevFilter === 'all' || (sevFilter === 'critical' ? e.severity === 'critical' : e.severity === 'warning');
      return matchSearch && matchSev;
    })
    .sort((a, b) => {
      let v = 0;
      if (sortKey === 'description') v = a.detail.localeCompare(b.detail);
      if (sortKey === 'severity')    v = a.severity.localeCompare(b.severity);
      if (sortKey === 'time')        v = allEvents.indexOf(a) - allEvents.indexOf(b);
      return sortDir === 'asc' ? v : -v;
    });

  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap', rowGap: 10 }}>
        {/* Search — minWidth reduced so it can shrink on narrow screens */}
        <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
          <Search size={14} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isMobile ? 'Search alerts…' : 'Search alerts, IPs, endpoints…'}
            style={{
              ...inputBaseStyle, width: '100%', height: 36, padding: '0 12px 0 32px',
              backgroundColor: 'var(--dash-bg-surface)',
            }}
          />
        </div>

        {/* Severity filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'critical', 'warning'] as SevFilter[]).map(f => (
            <FilterChip key={f} label={f === 'all' ? 'All' : f === 'critical' ? 'Critical' : 'Warning'} active={sevFilter === f} onClick={() => setSevFilter(f)} />
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Mobile: card list ── */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '40px 20px', textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: 14 }}>
              No alerts match your search
            </div>
          ) : filtered.map(event => {
            const Icon = event.severity === 'critical' ? Shield : AlertTriangle;
            const iconColor = event.severity === 'critical' ? 'var(--dash-danger)' : 'var(--dash-warning)';
            const iconBg    = event.severity === 'critical' ? 'var(--dash-danger-tint)' : 'var(--dash-warning-tint)';
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.12s ease', minHeight: 'var(--dash-touch-target)' }}
                onTouchStart={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
                onTouchEnd={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={iconColor} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', lineHeight: 1.4, marginBottom: 6 }}>
                      {event.detail}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <StatusBadge label={event.severity === 'critical' ? 'Critical' : 'Warning'} severity={event.severity === 'critical' ? 'danger' : 'warning'} />
                      <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>{event.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--dash-text-secondary)', fontFamily: 'ui-monospace, monospace', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.ip} → {event.resource}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tablet: compact 3-column table (drops Source IP + Endpoint) ── */}
      {isTablet && (
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                <SortTh label="Alert description" sortKey="description" current={sortKey} dir={sortDir} onSort={sort} align="left" />
                <SortTh label="Severity" sortKey="severity" current={sortKey} dir={sortDir} onSort={sort} align="left" />
                <SortTh label="Time" sortKey="time" current={sortKey} dir={sortDir} onSort={sort} align="right" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, i) => (
                <AlertRowCompact key={event.id} event={event} isLast={i === filtered.length - 1} onClick={() => setSelectedEvent(event)} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: 14 }}>
                    No alerts match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Desktop: full 5-column table (unchanged) ── */}
      {!isMobile && !isTablet && (
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
      )}

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
      style={{ padding: '0 16px', height: 44, fontSize: 11, fontWeight: 600, color: active ? 'var(--dash-accent)' : 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: align, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        {active ? (dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
      </span>
    </th>
  );
}

/* Full desktop row */
function AlertRow({ event, isLast, onClick }: { event: SecurityEvent; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)', backgroundColor: hovered ? 'var(--dash-bg-page)' : 'transparent', cursor: 'pointer', transition: 'background-color 0.1s ease', height: 48 }}
    >
      <td style={{ padding: '0 16px', fontSize: 13, color: 'var(--dash-text-primary)', maxWidth: 280 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.detail}</span>
      </td>
      <td style={{ padding: '0 16px' }}>
        <StatusBadge label={event.severity === 'critical' ? 'Critical' : 'Warning'} severity={event.severity === 'critical' ? 'danger' : 'warning'} />
      </td>
      <td style={{ padding: '0 16px', fontSize: 13, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace' }}>{event.ip}</td>
      <td style={{ padding: '0 16px', fontSize: 13, color: 'var(--dash-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>{event.resource}</td>
      <td style={{ padding: '0 16px', fontSize: 13, color: 'var(--dash-text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>{event.time}</td>
    </tr>
  );
}

/* Compact tablet row — 3 columns */
function AlertRowCompact({ event, isLast, onClick }: { event: SecurityEvent; isLast: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)', backgroundColor: hovered ? 'var(--dash-bg-page)' : 'transparent', cursor: 'pointer', transition: 'background-color 0.1s ease', height: 52 }}
    >
      <td style={{ padding: '0 16px', maxWidth: 260 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{event.detail}</div>
        <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.ip} → {event.resource}</div>
      </td>
      <td style={{ padding: '0 16px' }}>
        <StatusBadge label={event.severity === 'critical' ? 'Critical' : 'Warning'} severity={event.severity === 'critical' ? 'danger' : 'warning'} />
      </td>
      <td style={{ padding: '0 16px', fontSize: 12, color: 'var(--dash-text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>{event.time}</td>
    </tr>
  );
}
