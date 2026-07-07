import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { LayoutDashboard, BarChart2, Shield, Server, FileText } from 'lucide-react';
import { ROUTE_PATHS, getActiveRootRouteId, type AppRouteId } from '../routes';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavItemProps {
  id: AppRouteId;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
  collapsed: boolean;
}

const NAV_ITEMS: { id: AppRouteId; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard',       Icon: LayoutDashboard },
  { id: 'cost',      label: 'Cost Analytics',  Icon: BarChart2 },
  { id: 'security',  label: 'Security',        Icon: Shield },
  { id: 'resources', label: 'Cloud Resources', Icon: Server },
  { id: 'reports',   label: 'Reports',         Icon: FileText },
];

function NavItem({ id, label, Icon, isActive, collapsed }: NavItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={ROUTE_PATHS[id]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? label : undefined}
      style={{
        textDecoration: 'none',
        width: '100%',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? 0 : '0 12px',
        borderRadius: 8,
        marginBottom: 2,
        backgroundColor: isActive ? 'var(--dash-accent-tint)' : hovered ? 'var(--dash-bg-page)' : 'transparent',
        color: isActive ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.12s ease',
        fontFamily: 'var(--dash-font)',
      }}
    >
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, backgroundColor: 'var(--dash-accent)', borderRadius: 0 }} />
      )}
      <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
      {!collapsed && <span style={{ fontSize: 14, fontWeight: isActive ? 500 : 400 }}>{label}</span>}
    </NavLink>
  );
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const activeRoot = getActiveRootRouteId(location.pathname);
  const w = collapsed ? 64 : 240;

  return (
    <div style={{
      width: w, backgroundColor: 'var(--dash-bg-surface)', borderRight: '1px solid var(--dash-border)',
      position: 'fixed', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10,
      transition: 'width 0.2s ease',
    }}>
      <div style={{ height: 64, borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 9 }}>
          <div style={{ width: 28, height: 28, backgroundColor: 'var(--dash-accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12L7.5 3L13 12H2Z" fill="white" /></svg>
          </div>
          {!collapsed && (
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)', letterSpacing: '-0.01em' }}>CloudCEO</span>
              <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--dash-text-muted)', letterSpacing: '0.04em', marginTop: -1 }}>Cloud Management</div>
            </div>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px' }}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            label={item.label}
            Icon={item.Icon}
            isActive={activeRoot === item.id}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {!collapsed && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--dash-border)' }}>
          <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>CloudCEO Cloud Management Platform</div>
          <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', marginTop: 2 }}>Enterprise v2.0</div>
        </div>
      )}
    </div>
  );
}
