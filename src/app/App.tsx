import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
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
import { NotificationsPage } from './components/NotificationsPage';
import { AppShell } from './components/AppShell';
import { ONBOARDING_STORAGE_KEY, ROUTE_PATHS, getBreadcrumbRouteIds, getRouteById, type AppRouteId } from './routes';
import type { BreadcrumbItem } from './components/BreadcrumbNav';
import { DateRangeProvider } from './context/DateRangeContext';
import { NotificationProvider } from './context/NotificationContext';

function useOnboardingState() {
  const [complete, setComplete] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, complete ? 'true' : 'false');
  }, [complete]);

  return [complete, setComplete] as const;
}

function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const navigate = useNavigate();

  return getBreadcrumbRouteIds(location.pathname).map((routeId, index, items) => {
    const route = getRouteById(routeId);
    return {
      label: route.title,
      onClick: index < items.length - 1 ? () => navigate(route.path) : undefined,
    };
  });
}

function DashboardRoute() {
  const navigate = useNavigate();

  return (
    <DashboardHome onNavigate={(routeId: AppRouteId) => navigate(ROUTE_PATHS[routeId])} />
  );
}

function BreadcrumbPage({ children }: { children: (breadcrumbs: BreadcrumbItem[]) => ReactNode }) {
  const breadcrumbs = useBreadcrumbs();
  return <>{children(breadcrumbs)}</>;
}

function OnboardingRoute({ onComplete }: { onComplete: () => void }) {
  const navigate = useNavigate();

  return (
    <OnboardingPage
      onComplete={() => {
        onComplete();
        navigate(ROUTE_PATHS.dashboard, { replace: true });
      }}
    />
  );
}

function ProtectedShell({ onboardingComplete, onSignOut }: { onboardingComplete: boolean; onSignOut: () => void }) {
  const location = useLocation();

  if (!onboardingComplete) {
    return <Navigate to={ROUTE_PATHS.onboarding} replace state={{ from: location }} />;
  }

  return <AppShell onSignOut={onSignOut} />;
}

function OnboardingGate({ onboardingComplete, onComplete }: { onboardingComplete: boolean; onComplete: () => void }) {
  if (onboardingComplete) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />;
  }

  return <OnboardingRoute onComplete={onComplete} />;
}

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useOnboardingState();

  return (
    <NotificationProvider>
      <DateRangeProvider>
        <Routes>
          <Route
            path={ROUTE_PATHS.onboarding}
            element={
              <OnboardingGate
                onboardingComplete={onboardingComplete}
                onComplete={() => setOnboardingComplete(true)}
              />
            }
          />

          <Route
            element={
              <ProtectedShell
                onboardingComplete={onboardingComplete}
                onSignOut={() => setOnboardingComplete(false)}
              />
            }
          >
            <Route index element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />
            <Route path={ROUTE_PATHS.dashboard} element={<DashboardRoute />} />
            <Route path={ROUTE_PATHS.cost} element={<BillingOverview />} />
            <Route path={ROUTE_PATHS.security} element={<SecurityOverview />} />
            <Route
              path={ROUTE_PATHS.resources}
              element={<BreadcrumbPage>{(breadcrumbs) => <ResourcesPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS.reports}
              element={<BreadcrumbPage>{(breadcrumbs) => <ReportsPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS.notifications}
              element={<BreadcrumbPage>{(breadcrumbs) => <NotificationsPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS.profile}
              element={<BreadcrumbPage>{(breadcrumbs) => <ProfilePage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS.settings}
              element={<BreadcrumbPage>{(breadcrumbs) => <SettingsPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS['security-alerts']}
              element={<BreadcrumbPage>{(breadcrumbs) => <AlertListPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
            <Route
              path={ROUTE_PATHS.forecast}
              element={<BreadcrumbPage>{(breadcrumbs) => <ForecastPage breadcrumbs={breadcrumbs} />}</BreadcrumbPage>}
            />
          </Route>

          <Route path="*" element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />
        </Routes>
      </DateRangeProvider>
    </NotificationProvider>
  );
}
