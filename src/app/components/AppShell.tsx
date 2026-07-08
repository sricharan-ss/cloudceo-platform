import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileTabBar } from './MobileTabBar';
import { NotificationPanel } from './NotificationPanel';
import { FloatingAiButton } from './FloatingAiButton';
import { Toaster } from 'sonner';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { getPageTitle, ROUTE_PATHS } from '../routes';
import { DateRangeProvider } from '../context/DateRangeContext';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';

interface AppShellProps {
  onSignOut: () => void;
}

export function AppShell({ onSignOut }: AppShellProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dateRange, setDateRange] = useState('This month');
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const location = useLocation();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 240;
  const contentPadding = isMobile ? '24px 16px' : '32px';

  return (
    <div style={{ fontFamily: 'var(--dash-font)', backgroundColor: 'var(--dash-bg-page)', minHeight: '100vh' }}>
      {!isMobile && <Sidebar collapsed={isTablet} />}

      <TopBar
        title={getPageTitle(location.pathname)}
        hasAlerts
        unreadCount={unreadCount}
        leftOffset={sidebarWidth}
        simplified={isMobile}
        onBellClick={() => {
          if (isMobile) {
            navigate(ROUTE_PATHS.notifications);
          } else {
            setNotificationOpen(true);
          }
        }}
        onSignOut={onSignOut}
      />

      <main
        style={{
          marginLeft: sidebarWidth,
          paddingTop: 64,
          paddingBottom: isMobile ? 'calc(var(--dash-mobile-tabbar) + env(safe-area-inset-bottom, 8px))' : 0,
          minHeight: '100vh',
          backgroundColor: 'var(--dash-bg-page)',
        }}
      >
        <div style={{ maxWidth: bp === 'desktop' ? 1280 : 'none', margin: '0 auto', padding: contentPadding }}>
          <Outlet />
        </div>
      </main>

      {isMobile && <MobileTabBar />}

      {notificationOpen && (
        <NotificationPanel onClose={() => setNotificationOpen(false)} />
      )}

      <FloatingAiButton />
      
      <Toaster position="bottom-right" />
    </div>
  );
}
