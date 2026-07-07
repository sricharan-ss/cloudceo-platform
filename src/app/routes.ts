export type AppRouteId =
  | 'dashboard'
  | 'cost'
  | 'forecast'
  | 'security'
  | 'security-alerts'
  | 'resources'
  | 'reports'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'onboarding';

export interface AppRouteDefinition {
  id: AppRouteId;
  path: string;
  title: string;
  parentId?: AppRouteId;
}

export const ONBOARDING_STORAGE_KEY = 'cloudceo:onboarding-complete';

export const APP_ROUTES: AppRouteDefinition[] = [
  { id: 'dashboard', path: '/dashboard', title: 'Dashboard' },
  { id: 'cost', path: '/cost', title: 'Cost Analytics' },
  { id: 'forecast', path: '/cost/forecast', title: 'Forecast Details', parentId: 'cost' },
  { id: 'security', path: '/security', title: 'Security' },
  { id: 'security-alerts', path: '/security/alerts', title: 'Security Alerts', parentId: 'security' },
  { id: 'resources', path: '/resources', title: 'Cloud Resources' },
  { id: 'reports', path: '/reports', title: 'Reports' },
  { id: 'notifications', path: '/notifications', title: 'Notifications' },
  { id: 'profile', path: '/profile', title: 'My Profile' },
  { id: 'settings', path: '/settings', title: 'Settings' },
  { id: 'onboarding', path: '/onboarding', title: 'Onboarding' },
];

export const ROOT_NAV_ROUTE_IDS: AppRouteId[] = [
  'dashboard',
  'cost',
  'security',
  'resources',
  'reports',
];

export const ROUTE_PATHS = APP_ROUTES.reduce<Record<AppRouteId, string>>((acc, route) => {
  acc[route.id] = route.path;
  return acc;
}, {} as Record<AppRouteId, string>);

export function getRouteById(id: AppRouteId): AppRouteDefinition {
  const route = APP_ROUTES.find((item) => item.id === id);
  if (!route) {
    throw new Error(`Unknown route id: ${id}`);
  }
  return route;
}

export function getRouteByPathname(pathname: string): AppRouteDefinition {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const route = [...APP_ROUTES]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => normalizedPath === item.path || normalizedPath.startsWith(`${item.path}/`));

  return route ?? getRouteById('dashboard');
}

export function getPageTitle(pathname: string): string {
  return getRouteByPathname(pathname).title;
}

export function getActiveRootRouteId(pathname: string): AppRouteId {
  let route = getRouteByPathname(pathname);

  while (route.parentId) {
    route = getRouteById(route.parentId);
  }

  return ROOT_NAV_ROUTE_IDS.includes(route.id) ? route.id : 'dashboard';
}

export function getBreadcrumbRouteIds(pathname: string): AppRouteId[] {
  const items: AppRouteId[] = [];
  let route: AppRouteDefinition | undefined = getRouteByPathname(pathname);

  while (route) {
    items.unshift(route.id);
    route = route.parentId ? getRouteById(route.parentId) : undefined;
  }

  return items;
}
