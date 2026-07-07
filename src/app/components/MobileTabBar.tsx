import { NavLink, useLocation } from 'react-router';
import { LayoutDashboard, BarChart2, Shield, Server, FileText } from 'lucide-react';
import { ROUTE_PATHS, getActiveRootRouteId, type AppRouteId } from '../routes';

const ITEMS: { id: AppRouteId; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Home',      Icon: LayoutDashboard },
  { id: 'cost',      label: 'Cost',      Icon: BarChart2 },
  { id: 'security',  label: 'Security',  Icon: Shield },
  { id: 'resources', label: 'Resources', Icon: Server },
  { id: 'reports',   label: 'Reports',   Icon: FileText },
];

export function MobileTabBar() {
  const location = useLocation();
  const activeRoot = getActiveRootRouteId(location.pathname);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'calc(var(--dash-mobile-tabbar) + env(safe-area-inset-bottom, 0px))',
      backgroundColor: 'var(--dash-bg-surface)',
      borderTop: '1px solid var(--dash-border)',
      display: 'flex', alignItems: 'flex-start', paddingTop: 0,
      zIndex: 10, fontFamily: 'var(--dash-font)',
    }}>
      {ITEMS.map(({ id, label, Icon }) => {
        const active = activeRoot === id;
        return (
          <NavLink
            key={id}
            to={ROUTE_PATHS[id]}
            style={{
              textDecoration: 'none',
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, border: 'none', background: 'none',
              cursor: 'pointer', color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
              minHeight: 44, padding: 0,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: active ? 500 : 400, lineHeight: 1 }}>{label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
