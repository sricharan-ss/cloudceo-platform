import { useState } from 'react';
import { Sidebar, SIDEBAR_ROOTS, type Screen } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileTabBar } from './components/MobileTabBar';
import { DashboardHome } from './components/DashboardHome';
import { BillingOverview } from './components/BillingOverview';
import { SecurityOverview } from './components/SecurityOverview';
import { ResourcesPage } from './components/ResourcesPage';
import { ReportsPage } from './components/ReportsPage';
import { OnboardingPage } from './components/OnboardingPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { AlertListPage } from './components/AlertListPage';
import { ForecastPage } from './components/ForecastPage';
import { NotificationPanel } from './components/NotificationPanel';
import { NotificationsPage } from './components/NotificationsPage';
import { FloatingAiButton } from './components/FloatingAiButton';
import { useBreakpoint } from './hooks/useBreakpoint';
import type { BreadcrumbItem } from './components/BreadcrumbNav';

/* ── Page titles ── */
const PAGE_TITLES: Record<Screen, string> = {
  home:            'Dashboard',
  cost:            'Cost Analytics',
  security:        'Security',
  resources:       'Cloud Resources',
  reports:         'Reports',
  profile:         'My Profile',
  settings:        'Settings',
  'alert-list':    'Security Alerts',
  forecast:        'Forecast Details',
};

/* ── Root screens ── */
const ROOT_SCREENS: Screen[] = ['home', 'cost', 'security', 'resources', 'reports'];

export default function App() {
  /* ── Navigation stack ── */
  const [screenStack, setScreenStack] = useState<Screen[]>(['home']);
  const screen = screenStack[screenStack.length - 1];

  const navigateRoot = (s: Screen) => setScreenStack([s]);
  const pushScreen   = (s: Screen) => setScreenStack(prev => [...prev, s]);

  /* ── Breadcrumbs ── */
  const breadcrumbs: BreadcrumbItem[] = screenStack.map((s, i) => ({
    label: PAGE_TITLES[s],
    onClick: i < screenStack.length - 1 ? () => setScreenStack(screenStack.slice(0, i + 1)) : undefined,
  }));

  /* ── Onboarding ── */
  const [onboardingDone, setOnboardingDone] = useState(false);

  /* ── Panels ── */
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dateRange, setDateRange]               = useState('This month');
  const unreadCount = 3;

  /* ── Breakpoint ── */
  const bp       = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  const sidebarWidth   = isMobile ? 0 : isTablet ? 64 : 240;
  const contentPadding = isMobile ? '24px 16px' : '32px';

  const sidebarActive: Screen = SIDEBAR_ROOTS.includes(screen)
    ? screen
    : screen === 'alert-list' ? 'security'
    : screen === 'forecast'   ? 'cost'
    : 'home';

  /* ── Show onboarding for new users ── */
  if (!onboardingDone) {
    return <OnboardingPage onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <div style={{ fontFamily: 'var(--dash-font)', backgroundColor: 'var(--dash-bg-page)', minHeight: '100vh' }}>
      {/* Sidebar */}
      {!isMobile && (
        <Sidebar currentScreen={sidebarActive} onNavigate={navigateRoot} collapsed={isTablet} />
      )}

      {/* Top bar */}
      <TopBar
        title={PAGE_TITLES[screen]}
        hasAlerts
        unreadCount={unreadCount}
        leftOffset={sidebarWidth}
        simplified={isMobile}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onBellClick={() => setNotificationOpen(true)}
        onNavigate={pushScreen}
        onSignOut={() => { setScreenStack(['home']); setOnboardingDone(false); }}
      />

      {/* Main content */}
      <main style={{
        marginLeft: sidebarWidth, paddingTop: 64,
        paddingBottom: isMobile ? 'calc(var(--dash-mobile-tabbar) + env(safe-area-inset-bottom, 8px))' : 0,
        minHeight: '100vh', backgroundColor: 'var(--dash-bg-page)',
      }}>
        <div style={{ maxWidth: bp === 'desktop' ? 1280 : 'none', margin: '0 auto', padding: contentPadding }}>
          {screen === 'home'       && <DashboardHome onNavigate={pushScreen} />}
          {screen === 'cost'       && <BillingOverview />}
          {screen === 'security'   && <SecurityOverview />}
          {screen === 'resources'  && <ResourcesPage breadcrumbs={breadcrumbs} />}
          {screen === 'reports'    && <ReportsPage breadcrumbs={breadcrumbs} />}
          {screen === 'profile'    && <ProfilePage breadcrumbs={breadcrumbs} />}
          {screen === 'settings'   && <SettingsPage breadcrumbs={breadcrumbs} />}
          {screen === 'alert-list' && <AlertListPage breadcrumbs={breadcrumbs} />}
          {screen === 'forecast'   && <ForecastPage breadcrumbs={breadcrumbs} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <MobileTabBar currentScreen={sidebarActive} onNavigate={navigateRoot} />
      )}

      {/* Notification panel slide-over */}
      {notificationOpen && (
        <NotificationPanel onClose={() => setNotificationOpen(false)} />
      )}

      {/* Floating CloudCEO AI */}
      <FloatingAiButton />
    </div>
  );
}
