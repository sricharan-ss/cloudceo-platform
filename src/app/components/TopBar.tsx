import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Calendar, ChevronDown, Check, User, Building, Settings, LogOut, Shield, Sliders } from 'lucide-react';
import { ROUTE_PATHS } from '../routes';

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
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  onBellClick?: () => void;
  onSignOut?: () => void;
}

const DATE_OPTIONS = [
  'Today', 'Yesterday', 'Last 7 days', 'Last 30 days',
  'This month', 'Last month', 'Last quarter', 'This year',
];

export function TopBar({
  title, hasAlerts = true, unreadCount = 0, leftOffset = 240, simplified = false,
  dateRange = 'This month', onDateRangeChange, onBellClick, onSignOut,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDatePickerOpen(false);
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
          <div ref={dateRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setDatePickerOpen((o) => !o); setProfileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 999, border: '1px solid var(--dash-border)',
                backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)',
              }}
            >
              <Calendar size={14} color="var(--dash-text-secondary)" />
              <span>{dateRange}</span>
              <ChevronDown size={13} color="var(--dash-text-secondary)" />
            </button>

            {datePickerOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 200,
                backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden', padding: '6px 0',
              }}>
                {DATE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onDateRangeChange?.(opt); setDatePickerOpen(false); }}
                    style={{
                      width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      fontSize: 13, color: opt === dateRange ? 'var(--dash-accent)' : 'var(--dash-text-primary)',
                      fontWeight: opt === dateRange ? 500 : 400, fontFamily: 'var(--dash-font)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-page)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    {opt}
                    {opt === dateRange && <Check size={13} color="var(--dash-accent)" />}
                  </button>
                ))}
                <div style={{ height: 1, backgroundColor: 'var(--dash-border-light)', margin: '6px 0' }} />
                <button
                  onClick={() => setDatePickerOpen(false)}
                  style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--dash-accent)', fontWeight: 500, textAlign: 'left', fontFamily: 'var(--dash-font)' }}
                >
                  Custom range...
                </button>
              </div>
            )}
          </div>
        )}

        {!simplified && <Divider />}

        <button
          onClick={() => { onBellClick?.(); setProfileOpen(false); setDatePickerOpen(false); }}
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
            onClick={() => { setProfileOpen((o) => !o); setDatePickerOpen(false); }}
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
                    <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>CEO · CloudCEO</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                <ProfileMenuItem Icon={User} label="My profile" onClick={() => { navigate(ROUTE_PATHS.profile); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={Building} label="Organization" onClick={() => { navigate(ROUTE_PATHS.settings); setProfileOpen(false); }} />
                <ProfileMenuItem Icon={Sliders} label="Preferences" onClick={() => { setProfileOpen(false); }} />
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
