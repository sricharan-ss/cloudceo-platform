import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, User, Building, Settings, LogOut, Shield, Sliders, ChevronDown } from 'lucide-react';
import { ROUTE_PATHS } from '../routes';
import { DateRangePicker } from './DateRangePicker';
import { useProvider, type Provider } from '../context/ProviderContext';

export interface TopBarBreadcrumb {
  label: string;
  onClick: () => void;
}

interface TopBarProps {
  title: string;
  hasAlerts?: boolean;
  unreadCount?: number;
  leftOffset?: number;
  simplified?: boolean;
  onBellClick?: () => void;
  onSignOut?: () => void;
}

const PROVIDER_LABELS: Record<Provider, string> = {
  combined: 'All Clouds',
  aws:      'AWS',
  azure:    'Azure',
};

const PROVIDER_COLORS: Record<Provider, string> = {
  combined: 'var(--dash-accent)',
  aws:      '#FF9900',
  azure:    '#0078D4',
};

function ProviderSelector() {
  const { provider, setProvider } = useProvider();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const color = PROVIDER_COLORS[provider];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Select cloud provider"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 8,
          border: `1px solid ${color}40`,
          backgroundColor: `${color}10`,
          cursor: 'pointer', fontFamily: 'var(--dash-font)',
          transition: 'border-color 0.15s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; }}
      >
        {/* Cloud icon pill */}
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.01em' }}>
          {provider === 'combined' ? '☁' : provider === 'aws' ? '⬡' : '◆'}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: 'var(--dash-font)', userSelect: 'none' }}>
          {PROVIDER_LABELS[provider]}
        </span>
        <ChevronDown size={11} color={color} strokeWidth={2} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 160,
          backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden',
          padding: '6px 0',
        }}>
          <div style={{ padding: '6px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            Cloud Provider
          </div>
          {(['combined', 'aws', 'azure'] as Provider[]).map(p => (
            <button
              key={p}
              onClick={() => { setProvider(p); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--dash-font)',
                backgroundColor: provider === p ? `${PROVIDER_COLORS[p]}12` : 'transparent',
                color: provider === p ? PROVIDER_COLORS[p] : 'var(--dash-text-primary)',
                fontSize: 13, fontWeight: provider === p ? 600 : 400,
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={e => { if (provider !== p) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-page)'; }}
              onMouseLeave={e => { if (provider !== p) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <span style={{ fontSize: 12 }}>{p === 'combined' ? '☁' : p === 'aws' ? '⬡' : '◆'}</span>
              {PROVIDER_LABELS[p]}
              {provider === p && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', backgroundColor: PROVIDER_COLORS[p], display: 'inline-block' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopBar({
  title, hasAlerts = true, unreadCount = 0, leftOffset = 240, simplified = false,
  onBellClick, onSignOut,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      style={{
        height: 64,
        backgroundColor: 'var(--dash-bg-surface)',
        borderBottom: '1px solid var(--dash-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px 0 24px',
        position: 'fixed',
        left: leftOffset,
        right: 0,
        top: 0,
        zIndex: 9,
        fontFamily: 'var(--dash-font)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: simplified ? 10 : 0 }}>
        {simplified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 26, height: 26, backgroundColor: 'var(--dash-accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M2 12L7.5 3L13 12H2Z" fill="white" /></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--dash-text-primary)', letterSpacing: '-0.01em' }}>CloudCEO</span>
          </div>
        )}
        {simplified && <div style={{ width: 1, height: 16, backgroundColor: 'var(--dash-border)', flexShrink: 0 }} />}
        <span style={{ fontSize: simplified ? 14 : 20, fontWeight: simplified ? 500 : 600, color: 'var(--dash-text-primary)' }}>
          {title}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {!simplified && (
          <DateRangePicker onOpenChange={(open) => { if (open) setProfileOpen(false); }} />
        )}

        {!simplified && <Divider />}

        {/* Provider Selector — desktop/tablet only */}
        {!simplified && <ProviderSelector />}

        {!simplified && <Divider />}

        <button
          onClick={() => { onBellClick?.(); setProfileOpen(false); }}
          aria-label="View notifications"
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', borderRadius: 6 }}
        >
          <Bell size={simplified ? 18 : 20} color="var(--dash-text-secondary)" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2, minWidth: 14, height: 14,
              borderRadius: 999, backgroundColor: 'var(--dash-danger)', border: '1.5px solid var(--dash-bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#FFFFFF', padding: '0 3px',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <Divider />

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen((o) => !o); }}
            aria-label="User profile menu"
            aria-expanded={profileOpen}
            style={{
              width: simplified ? 28 : 32, height: simplified ? 28 : 32, borderRadius: '50%',
              backgroundColor: 'var(--dash-accent-tint)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: simplified ? 11 : 12, fontWeight: 600, color: 'var(--dash-accent)',
              userSelect: 'none',
            }}
          >
            SG
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 230,
              backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)',
              borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--dash-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--dash-accent)', flexShrink: 0 }}>SG</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)' }}>Srikanth Ganesan</div>
                    <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>CEO - CloudCEO</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                <ProfileMenuItem Icon={User} label="My profile" onClick={() => { navigate(ROUTE_PATHS.profile); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={Building} label="Organization" onClick={() => { navigate(ROUTE_PATHS.settings); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={Sliders} label="Preferences" onClick={() => { navigate(ROUTE_PATHS.settings); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={Shield} label="Security" onClick={() => { navigate(ROUTE_PATHS.settings); setProfileOpen(false); }} />
              </div>

              <div style={{ height: 1, backgroundColor: 'var(--dash-border-light)' }} />

              <div style={{ padding: '6px 0' }}>
                <ProfileMenuItem Icon={Settings} label="Settings" onClick={() => { navigate(ROUTE_PATHS.settings); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={LogOut} label="Sign out" onClick={() => { onSignOut?.(); setProfileOpen(false); }} danger />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, backgroundColor: 'var(--dash-border)' }} />;
}

function ProfileMenuItem({ Icon, label, onClick, danger }: { Icon: React.ElementType; label: string; onClick: () => void; danger?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '8px 16px', border: 'none', background: hovered ? 'var(--dash-bg-page)' : 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        color: danger ? 'var(--dash-danger)' : 'var(--dash-text-primary)',
        fontSize: 13, fontWeight: 400, textAlign: 'left', fontFamily: 'var(--dash-font)',
        transition: 'background-color 0.1s ease',
      }}
    >
      <Icon size={15} strokeWidth={1.5} />
      {label}
    </button>
  );
}
