import { useState } from 'react';
import { Server, Database, HardDrive, Globe, Search, RefreshCw, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { EmptyState, EMPTY_STATES } from './SharedStates';
import { PageHeader } from './PageHeader';
import { SummaryMetricCard } from './SummaryMetricCard';
import { inputBaseStyle, secondaryButtonStyle } from './uiStyles';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ResourcesPageProps { breadcrumbs: BreadcrumbItem[] }

type CloudFilter  = 'all' | 'aws' | 'azure';
type TypeFilter   = 'all' | 'compute' | 'database' | 'storage' | 'network';
type StatusFilter = 'all' | 'running' | 'stopped' | 'warning';

interface Resource {
  id: string; name: string; type: string; cloud: 'aws' | 'azure'; region: string;
  status: 'running' | 'stopped' | 'warning'; cost: string; icon: React.ElementType;
  cpu: number; memory: number; owner: string; environment: 'production' | 'staging' | 'dev';
  health: 'healthy' | 'warning' | 'critical'; tags: string[];
}

const RESOURCES: Resource[] = [
  { id: 'r1',  name: 'prod-ec2-api-01',    type: 'compute',  cloud: 'aws',   region: 'us-east-1', status: 'running', cost: '$312/mo', icon: Server,    cpu: 58, memory: 72, owner: 'Platform Team', environment: 'production', health: 'healthy', tags: ['api','critical'] },
  { id: 'r2',  name: 'prod-ec2-api-02',    type: 'compute',  cloud: 'aws',   region: 'us-east-1', status: 'running', cost: '$312/mo', icon: Server,    cpu: 62, memory: 68, owner: 'Platform Team', environment: 'production', health: 'healthy', tags: ['api','critical'] },
  { id: 'r3',  name: 'prod-ec2-worker-01', type: 'compute',  cloud: 'aws',   region: 'us-east-1', status: 'warning', cost: '$156/mo', icon: Server,    cpu: 3,  memory: 8,  owner: 'DevOps',        environment: 'production', health: 'warning', tags: ['worker','idle'] },
  { id: 'r4',  name: 'rds-prod-primary',   type: 'database', cloud: 'aws',   region: 'us-east-1', status: 'running', cost: '$284/mo', icon: Database,  cpu: 12, memory: 34, owner: 'Data Team',     environment: 'production', health: 'healthy', tags: ['db','postgres'] },
  { id: 'r5',  name: 'cloudceo-prod-assets',   type: 'storage',  cloud: 'aws',   region: 'us-east-1', status: 'warning', cost: '$48/mo',  icon: HardDrive, cpu: 0,  memory: 0,  owner: 'Platform Team', environment: 'production', health: 'warning', tags: ['public','static'] },
  { id: 'r6',  name: 'cloudceo-logs',          type: 'storage',  cloud: 'aws',   region: 'us-east-1', status: 'running', cost: '$32/mo',  icon: HardDrive, cpu: 0,  memory: 0,  owner: 'DevOps',        environment: 'production', health: 'healthy', tags: ['logs'] },
  { id: 'r7',  name: 'cloudceo-cdn',           type: 'network',  cloud: 'aws',   region: 'Global',    status: 'running', cost: '$88/mo',  icon: Globe,     cpu: 0,  memory: 0,  owner: 'Platform Team', environment: 'production', health: 'warning', tags: ['cdn','global'] },
  { id: 'r8',  name: 'prod-vm-east-01',    type: 'compute',  cloud: 'azure', region: 'East US',   status: 'running', cost: '$248/mo', icon: Server,    cpu: 44, memory: 61, owner: 'Cloud Team',    environment: 'production', health: 'healthy', tags: ['vm','api'] },
  { id: 'r9',  name: 'prod-vm-east-02',    type: 'compute',  cloud: 'azure', region: 'East US',   status: 'running', cost: '$248/mo', icon: Server,    cpu: 38, memory: 55, owner: 'Cloud Team',    environment: 'production', health: 'healthy', tags: ['vm','api'] },
  { id: 'r10', name: 'cloudceo-cosmos-prod',   type: 'database', cloud: 'azure', region: 'East US',   status: 'running', cost: '$125/mo', icon: Database,  cpu: 8,  memory: 22, owner: 'Data Team',     environment: 'production', health: 'healthy', tags: ['db','nosql'] },
  { id: 'r11', name: 'cloudceo-storage-prod',  type: 'storage',  cloud: 'azure', region: 'East US',   status: 'running', cost: '$72/mo',  icon: HardDrive, cpu: 0,  memory: 0,  owner: 'DevOps',        environment: 'production', health: 'healthy', tags: ['storage'] },
  { id: 'r12', name: 'cloudceo-fn-api',        type: 'compute',  cloud: 'azure', region: 'East US',   status: 'stopped', cost: '$0/mo',   icon: Server,    cpu: 0,  memory: 0,  owner: 'Dev Team',      environment: 'dev',        health: 'critical', tags: ['functions','dev'] },
];

const STATUS_SEV: Record<string, 'success' | 'warning' | 'danger'> = { running: 'success', warning: 'warning', stopped: 'danger' };
const ENV_COLORS: Record<string, { bg: string; color: string }> = {
  production: { bg: 'var(--dash-danger-tint)',  color: 'var(--dash-danger-text)'  },
  staging:    { bg: 'var(--dash-warning-tint)', color: 'var(--dash-warning-text)' },
  dev:        { bg: 'var(--dash-bg-page)',       color: 'var(--dash-text-muted)'   },
};
const HEALTH_SEV: Record<string, 'success' | 'warning' | 'danger'> = { healthy: 'success', warning: 'warning', critical: 'danger' };

function UsageBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, backgroundColor: 'var(--dash-border-light)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 999, transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontVariantNumeric: 'tabular-nums', width: 28, flexShrink: 0 }}>{value}%</span>
    </div>
  );
}

export function ResourcesPage({ breadcrumbs }: ResourcesPageProps) {
  const [search, setSearch]    = useState('');
  const [cloud, setCloud]      = useState<CloudFilter>('all');
  const [type, setType]        = useState<TypeFilter>('all');
  const [status, setStatus]    = useState<StatusFilter>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const toggleExpanded = (id: string) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = RESOURCES.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.owner.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.includes(search.toLowerCase()));
    return matchSearch && (cloud === 'all' || r.cloud === cloud) && (type === 'all' || r.type === type) && (status === 'all' || r.status === status);
  });

  const running = RESOURCES.filter(r => r.status === 'running').length;
  const stopped = RESOURCES.filter(r => r.status === 'stopped').length;
  const warnings = RESOURCES.filter(r => r.status === 'warning').length;

  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />
      {/* Header */}
      <PageHeader
        title="Cloud Resources"
        description={<>AWS + Azure inventory {' ? '} Synced 2 min ago</>}
        actions={<button style={{ ...secondaryButtonStyle, display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', color: 'var(--dash-text-secondary)', minHeight: undefined, transition: 'border-color 0.15s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
          <RefreshCw size={13} /> Sync now
        </button>}
      />


      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16, marginBottom: 20 }}>
        {[
          { label: 'Total resources', value: RESOURCES.length.toString(), color: 'var(--dash-text-primary)', bg: 'var(--dash-bg-surface)' },
          { label: 'Running', value: running.toString(), color: 'var(--dash-success)', bg: 'var(--dash-success-tint)' },
          { label: 'Warnings', value: warnings.toString(), color: 'var(--dash-warning)', bg: 'var(--dash-warning-tint)' },
          { label: 'Stopped', value: stopped.toString(), color: 'var(--dash-danger)', bg: 'var(--dash-danger-tint)' },
        ].map(s => (
          <SummaryMetricCard
            key={s.label}
            label={s.label}
            value={s.value}
            valueColor={s.color}
            backgroundColor={s.bg}
            padding={isMobile ? '12px 14px' : '14px 18px'}
            valueSize={24}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={13} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources, owners, tags…"
            style={{ ...inputBaseStyle, width: '100%', height: 34, padding: '0 10px 0 30px', backgroundColor: 'var(--dash-bg-page)', transition: 'border-color 0.15s ease' }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-accent)'; }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }} />
        </div>
        {[
          { options: [['all','All clouds'],['aws','AWS'],['azure','Azure']], value: cloud, set: setCloud },
          { options: [['all','All types'],['compute','Compute'],['database','Database'],['storage','Storage'],['network','Network']], value: type, set: setType },
          { options: [['all','All status'],['running','Running'],['warning','Warning'],['stopped','Stopped']], value: status, set: setStatus },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={e => (f.set as any)(e.target.value)}
            style={{ height: 34, padding: '0 24px 0 10px', fontSize: 12, fontFamily: 'var(--dash-font)', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)', color: 'var(--dash-text-primary)', cursor: 'pointer', appearance: 'none' }}>
            {f.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginLeft: 'auto' }}>{filtered.length} resources</span>
      </div>

      {/* Resource list */}
      {filtered.length === 0 ? (
        <EmptyState {...EMPTY_STATES.noSearch} actionLabel="Clear filters" onAction={() => { setSearch(''); setCloud('all'); setType('all'); setStatus('all'); }} />
      ) : isMobile ? (
        /* Mobile: expandable cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const Icon = r.icon;
            const isExp = expanded.has(r.id);
            return (
              <div key={r.id} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden', transition: 'border-color 0.15s ease' }}>
                <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }} onClick={() => toggleExpanded(r.id)}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="var(--dash-text-secondary)" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                      {isExp ? <ChevronUp size={14} color="var(--dash-text-muted)" style={{ flexShrink: 0 }} /> : <ChevronDown size={14} color="var(--dash-text-muted)" style={{ flexShrink: 0 }} />}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <CloudBadge variant={r.cloud} />
                      <StatusBadge label={r.status} severity={STATUS_SEV[r.status]} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', marginLeft: 'auto' }}>{r.cost}</span>
                    </div>
                  </div>
                </div>
                {isExp && (
                  <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--dash-border-light)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { label: 'Region',      value: r.region },
                        { label: 'Environment', value: r.environment },
                        { label: 'Owner',       value: r.owner },
                        { label: 'Health',      value: r.health },
                      ].map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{f.label}</div>
                          {f.label === 'Environment' ? (
                            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 999, backgroundColor: ENV_COLORS[r.environment].bg, color: ENV_COLORS[r.environment].color }}>{r.environment}</span>
                          ) : f.label === 'Health' ? (
                            <StatusBadge label={r.health} severity={HEALTH_SEV[r.health]} />
                          ) : (
                            <div style={{ fontSize: 12, color: 'var(--dash-text-primary)' }}>{f.value}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {r.type === 'compute' && (
                      <>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>CPU Usage</div>
                          <UsageBar value={r.cpu} color={r.cpu > 80 ? 'var(--dash-danger)' : r.cpu > 60 ? 'var(--dash-warning)' : 'var(--dash-success)'} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Memory Usage</div>
                          <UsageBar value={r.memory} color={r.memory > 80 ? 'var(--dash-danger)' : r.memory > 60 ? 'var(--dash-warning)' : 'var(--dash-accent)'} />
                        </div>
                      </>
                    )}
                    {r.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {r.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 999, backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', color: 'var(--dash-text-muted)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop/Tablet: rich table */
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                {[
                  { label: 'Resource', align: 'left' },
                  { label: 'Cloud', align: 'left' },
                  { label: 'Region', align: 'left' },
                  { label: 'Status', align: 'left' },
                  ...(isTablet ? [] : [
                    { label: 'CPU', align: 'left' },
                    { label: 'Memory', align: 'left' },
                    { label: 'Owner', align: 'left' },
                    { label: 'Env', align: 'left' },
                    { label: 'Health', align: 'left' },
                  ]),
                  { label: 'Cost/mo', align: 'right' },
                  { label: '', align: 'right' },
                ].map((h, i) => (
                  <th key={i} style={{ padding: '0 14px', height: 44, fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: h.align as 'left' | 'right', whiteSpace: 'nowrap' }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const Icon = r.icon;
                return (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--dash-border-light)' : 'none', height: 56, cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-page)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                    <td style={{ padding: '0 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={13} color="var(--dash-text-secondary)" strokeWidth={1.5} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace' }}>{r.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0 14px' }}><CloudBadge variant={r.cloud} /></td>
                    <td style={{ padding: '0 14px', fontSize: 12, color: 'var(--dash-text-secondary)' }}>{r.region}</td>
                    <td style={{ padding: '0 14px' }}><StatusBadge label={r.status} severity={STATUS_SEV[r.status]} /></td>
                    {!isTablet && <>
                      <td style={{ padding: '0 14px', minWidth: 100 }}>
                        {r.type === 'compute' ? <UsageBar value={r.cpu} color={r.cpu > 80 ? 'var(--dash-danger)' : r.cpu > 60 ? 'var(--dash-warning)' : 'var(--dash-success)'} /> : <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0 14px', minWidth: 100 }}>
                        {r.type === 'compute' ? <UsageBar value={r.memory} color={r.memory > 80 ? 'var(--dash-danger)' : r.memory > 60 ? 'var(--dash-warning)' : 'var(--dash-accent)'} /> : <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0 14px', fontSize: 12, color: 'var(--dash-text-secondary)', whiteSpace: 'nowrap' }}>{r.owner}</td>
                      <td style={{ padding: '0 14px' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 999, backgroundColor: ENV_COLORS[r.environment].bg, color: ENV_COLORS[r.environment].color, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{r.environment}</span>
                      </td>
                      <td style={{ padding: '0 14px' }}><StatusBadge label={r.health} severity={HEALTH_SEV[r.health]} /></td>
                    </>}
                    <td style={{ padding: '0 14px', fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.cost}</td>
                    <td style={{ padding: '0 14px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6, transition: 'color 0.12s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-muted)'; }}>
                        <MoreHorizontal size={15} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
