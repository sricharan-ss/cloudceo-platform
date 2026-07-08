import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, RefreshCw, Loader2, Filter, Trash2 } from 'lucide-react';
import { useProvider } from '../context/ProviderContext';
import { getProviderMocks } from '../mocks';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { SecurityEventMock } from '../mocks/types';
import { useDateRange } from '../context/DateRangeContext';
import { downloadMockFile } from './SharedStates';

const MONO = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';
const PAGE_SIZE = 10;

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        border: `1px solid ${active ? "var(--dash-accent)" : "var(--dash-border)"}`,
        backgroundColor: active ? "var(--dash-accent-tint)" : "var(--dash-bg-surface)",
        color: active ? "var(--dash-accent)" : "var(--dash-text-secondary)",
        fontFamily: "var(--dash-font)",
        transition: "all 0.12s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

export function ActivityLogTab({ onSelectEvent }: { onSelectEvent: (e: SecurityEventMock) => void }) {
  const bp = useBreakpoint();
  const { provider } = useProvider();
  const { range } = useDateRange();

  const mocks = getProviderMocks(provider);
  const events = mocks.securityEvents;

  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'blocked' | 'flagged' | 'allowed'>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | string>('all');
  const [cloud, setCloud] = useState<'all' | 'aws' | 'azure'>(provider === 'combined' ? 'all' : provider);
  
  const [sort, setSort] = useState<'newest' | 'oldest' | 'severity-high' | 'severity-low'>('newest');
  const [page, setPage] = useState(1);
  const [mobilePageLimit, setMobilePageLimit] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEvents = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      // Mock timestamp variations on refresh
      events.forEach(e => {
        if (e.time === 'Just now') e.time = '1m ago';
        else if (e.time === '1m ago') e.time = '2m ago';
      });
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    const handleSearch = (e: CustomEvent<{ search?: string; status?: string; ip?: string }>) => {
      if (e.detail?.search !== undefined) setSearch(e.detail.search);
      if (e.detail?.status !== undefined) setStatusFilter(e.detail.status as any);
      if (e.detail?.ip !== undefined) setSearch(e.detail.ip);
    };
    window.addEventListener('security-search', handleSearch as EventListener);
    return () => window.removeEventListener('security-search', handleSearch as EventListener);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [provider]);

  const uniqueEventTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach(e => { if (e.eventType) types.add(e.eventType); });
    return Array.from(types);
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !search || 
        e.detail.toLowerCase().includes(search.toLowerCase()) || 
        e.ip.includes(search) || 
        (e.resource && e.resource.toLowerCase().includes(search.toLowerCase())) || 
        (e.service && e.service.toLowerCase().includes(search.toLowerCase())) ||
        e.id.toLowerCase().includes(search.toLowerCase());

      const matchSev = severity === 'all' || e.severity === severity;
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchType = eventTypeFilter === 'all' || e.eventType === eventTypeFilter;
      const matchCloud = cloud === 'all' || e.cloud === cloud;

      return matchSearch && matchSev && matchStatus && matchType && matchCloud;
    }).sort((a, b) => {
      if (sort === 'newest') return -1; 
      if (sort === 'oldest') return 1;
      const sevMap = { 'critical': 3, 'warning': 2, 'info': 1 };
      if (sort === 'severity-high') return (sevMap[b.severity as any] || 0) - (sevMap[a.severity as any] || 0);
      if (sort === 'severity-low') return (sevMap[a.severity as any] || 0) - (sevMap[b.severity as any] || 0);
      return 0;
    });
  }, [events, search, severity, statusFilter, eventTypeFilter, cloud, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const isMobile = bp === 'mobile';
  
  const visible = useMemo(() => {
    if (isMobile) {
      return filtered.slice(0, mobilePageLimit * PAGE_SIZE);
    }
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page, mobilePageLimit, isMobile]);

  const groupedVisible = useMemo(() => {
    const today: SecurityEventMock[] = [];
    const yesterday: SecurityEventMock[] = [];
    visible.forEach(e => {
      if (e.time.includes('h ago') || e.time.includes(':')) today.push(e);
      else yesterday.push(e);
    });
    return { today, yesterday };
  }, [visible]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      downloadMockFile('security-events.csv', 'Time,Severity,Cloud,Service,Resource,Action,Status,IP\nMock Data\n');
    }, 1200);
  };

  const clearFilters = () => {
    setSearch('');
    setSeverity('all');
    setStatusFilter('all');
    setEventTypeFilter('all');
    setCloud(provider === 'combined' ? 'all' : provider);
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--dash-font)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: 'var(--dash-bg-surface)', padding: 16, borderRadius: 'var(--dash-radius-card)', border: '1px solid var(--dash-border)' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={14} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); setMobilePageLimit(1); }}
              placeholder="Search by ID, resource, service, IP..."
              style={{
                width: '100%', height: 36, padding: '0 12px 0 34px', fontSize: 13,
                borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)',
                backgroundColor: 'var(--dash-bg-page)', color: 'var(--dash-text-primary)', outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button
              onClick={fetchEvents}
              style={{
                background: 'none', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--dash-text-secondary)', transition: 'color 0.12s ease'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-secondary)'; }}
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </button>
            <select 
              value={sort} onChange={(e) => setSort(e.target.value as any)}
              style={{
                height: 36, padding: '0 12px', fontSize: 13, borderRadius: 'var(--dash-radius-button)',
                border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)',
                cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity-high">Highest severity</option>
              <option value="severity-low">Lowest severity</option>
            </select>
            <button
              onClick={handleExport}
              disabled={exporting || filtered.length === 0}
              style={{
                padding: '0 14px', height: 36, borderRadius: 'var(--dash-radius-button)',
                border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)',
                fontSize: 13, fontWeight: 500, color: 'var(--dash-text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: exporting || filtered.length === 0 ? 0.6 : 1
              }}
            >
              {exporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
              {isMobile ? '' : 'Export'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Filter size={12} /> Filters
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'var(--dash-border)' }} />
          <FilterPill label="All Severity" active={severity === 'all'} onClick={() => { setSeverity('all'); setPage(1); }} />
          <FilterPill label="Critical" active={severity === 'critical'} onClick={() => { setSeverity('critical'); setPage(1); }} />
          <FilterPill label="Warning" active={severity === 'warning'} onClick={() => { setSeverity('warning'); setPage(1); }} />
          <div style={{ width: 1, height: 16, backgroundColor: 'var(--dash-border)' }} />
          <FilterPill label="All Status" active={statusFilter === 'all'} onClick={() => { setStatusFilter('all'); setPage(1); }} />
          <FilterPill label="Blocked" active={statusFilter === 'blocked'} onClick={() => { setStatusFilter('blocked'); setPage(1); }} />
          <FilterPill label="Flagged" active={statusFilter === 'flagged'} onClick={() => { setStatusFilter('flagged'); setPage(1); }} />
          <div style={{ width: 1, height: 16, backgroundColor: 'var(--dash-border)' }} />
          <select 
            value={eventTypeFilter} onChange={(e) => { setEventTypeFilter(e.target.value); setPage(1); }}
            style={{
              padding: '4px 10px', fontSize: 12, borderRadius: 999, border: '1px solid var(--dash-border)',
              backgroundColor: eventTypeFilter === 'all' ? 'var(--dash-bg-surface)' : 'var(--dash-accent-tint)',
              color: eventTypeFilter === 'all' ? 'var(--dash-text-secondary)' : 'var(--dash-accent)',
              cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="all">All Event Types</option>
            {uniqueEventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {provider === 'combined' && (
            <>
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--dash-border)' }} />
              <FilterPill label="AWS" active={cloud === 'aws'} onClick={() => { setCloud(cloud === 'aws' ? 'all' : 'aws'); setPage(1); }} />
              <FilterPill label="Azure" active={cloud === 'azure'} onClick={() => { setCloud(cloud === 'azure' ? 'all' : 'azure'); setPage(1); }} />
            </>
          )}
          {(search || severity !== 'all' || statusFilter !== 'all' || eventTypeFilter !== 'all' || cloud !== (provider === 'combined' ? 'all' : provider)) && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--dash-text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              <Trash2 size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--dash-text-muted)' }}>
        <span>Showing {filtered.length} event{filtered.length !== 1 ? 's' : ''} for {range}</span>
        {!isMobile && totalPages > 0 && <span>Page {page} of {totalPages}</span>}
      </div>

      {isError ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', backgroundColor: 'var(--dash-bg-surface)' }}>
          <div style={{ color: 'var(--dash-danger)', marginBottom: 8 }}>Failed to load security events.</div>
          <button onClick={fetchEvents} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dash-border)', background: 'var(--dash-bg-page)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ height: 64, backgroundColor: 'var(--dash-bg-surface)', borderRadius: 8, border: '1px solid var(--dash-border)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', backgroundColor: 'var(--dash-bg-surface)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--dash-bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search size={20} color="var(--dash-text-muted)" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 8 }}>No events found</div>
          <div style={{ fontSize: 14, color: 'var(--dash-text-secondary)', marginBottom: 16 }}>Try adjusting your filters or search query.</div>
          <button onClick={clearFilters} style={{ padding: '8px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-page)', cursor: 'pointer', fontSize: 13 }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groupedVisible.today.length > 0 && (
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--dash-accent)' }} /> Today
              </h4>
              <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  {!isMobile && (
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                        {['Time', 'Event', 'Severity', 'Service', 'Resource', 'Source IP', 'Cloud'].map((h) => (
                          <th key={h} style={{ padding: '0 16px', height: 40, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {groupedVisible.today.map((event, i) => (
                      <ActivityLogRow key={event.id} event={event} isLast={i === groupedVisible.today.length - 1} onClick={() => onSelectEvent(event)} isMobile={isMobile} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {groupedVisible.yesterday.length > 0 && (
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--dash-text-muted)' }} /> Yesterday & Earlier
              </h4>
              <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  {!isMobile && (
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                        {['Time', 'Event', 'Severity', 'Service', 'Resource', 'Source IP', 'Cloud'].map((h) => (
                          <th key={h} style={{ padding: '0 16px', height: 40, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {groupedVisible.yesterday.map((event, i) => (
                      <ActivityLogRow key={event.id} event={event} isLast={i === groupedVisible.yesterday.length - 1} onClick={() => onSelectEvent(event)} isMobile={isMobile} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        isMobile ? (
          mobilePageLimit * PAGE_SIZE < filtered.length && (
            <button onClick={() => setMobilePageLimit(l => l + 1)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', cursor: 'pointer' }}>
              Load more
            </button>
          )
        ) : (
          totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 12px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, cursor: page === 1 ? 'not-allowed' : 'pointer', color: 'var(--dash-text-secondary)', opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: p === page ? 'var(--dash-accent)' : 'var(--dash-bg-surface)', color: p === page ? '#FFFFFF' : 'var(--dash-text-primary)', fontSize: 13, cursor: 'pointer' }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 12px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, cursor: page === totalPages ? 'not-allowed' : 'pointer', color: 'var(--dash-text-secondary)', opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
            </div>
          )
        )
      )}

      {showToast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--dash-success)', color: '#fff', padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideUp 0.2s ease-out' }}>
          <Check size={16} /> Export completed successfully
        </div>
      )}
    </div>
  );
}

function ActivityLogRow({ event, isLast, onClick, isMobile }: { event: SecurityEventMock; isLast: boolean; onClick: () => void; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isAws = event.cloud === 'aws';
  
  if (isMobile) {
    return (
      <tr onClick={onClick} style={{ borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)', backgroundColor: 'transparent', cursor: 'pointer' }}>
        <td style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <StatusBadge label={event.severity === 'critical' ? 'Critical' : event.severity === 'warning' ? 'Warning' : 'Info'} severity={event.severity as any} />
            <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>{event.time}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{event.detail}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{event.service}</span>
            <CloudBadge variant={isAws ? 'aws' : 'azure'} />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--dash-border-light)',
        backgroundColor: hovered ? 'var(--dash-bg-page)' : 'transparent',
        cursor: 'pointer', height: 52,
      }}
    >
      <td style={{ padding: '0 16px', fontSize: 12, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>{event.time}</td>
      <td style={{ padding: '0 16px', fontSize: 13, color: 'var(--dash-text-primary)', maxWidth: 220 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.detail}</span>
      </td>
      <td style={{ padding: '0 16px' }}>
        <StatusBadge label={event.severity === 'critical' ? 'Critical' : event.severity === 'warning' ? 'Warning' : 'Info'} severity={event.severity as any} />
      </td>
      <td style={{ padding: '0 16px', fontSize: 12, color: 'var(--dash-text-secondary)', whiteSpace: 'nowrap' }}>{event.service || '—'}</td>
      <td style={{ padding: '0 16px', fontSize: 12, color: 'var(--dash-text-primary)', fontFamily: MONO, maxWidth: 150 }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.resource || '—'}</span>
      </td>
      <td style={{ padding: '0 16px', fontSize: 12, color: 'var(--dash-text-primary)', fontFamily: MONO }}>{event.ip && event.ip !== 'N/A' ? event.ip : '—'}</td>
      <td style={{ padding: '0 16px' }}>
        <CloudBadge variant={isAws ? 'aws' : 'azure'} />
      </td>
    </tr>
  );
}
