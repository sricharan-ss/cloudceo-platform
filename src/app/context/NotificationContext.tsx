import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Category = 'all' | 'security' | 'cost' | 'ai' | 'reports' | 'cloud' | 'infrastructure' | 'system';
export type Severity = 'all' | 'critical' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: Category;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
  cloud?: 'aws' | 'azure';
  read: boolean;
  action?: string;
  dateStr?: string; // used for grouping: "Today", "Yesterday", "Earlier"
}

const ALL_NOTIFICATIONS: Notification[] = [
  { id: 'n1',  type: 'security',       severity: 'critical', title: 'SQL injection attempt blocked',          desc: 'WAF blocked a SQL injection payload on /api/checkout from 203.0.113.42.',         time: '2h ago',  cloud: 'aws',   read: false, action: 'View event', dateStr: 'Today' },
  { id: 'n2',  type: 'cost',           severity: 'warning',  title: 'AWS spend at 85% of monthly budget',    desc: '$42,310 of $50,000 monthly budget consumed. On pace to exceed by $2,000.',         time: '5h ago',  cloud: 'aws',   read: false, action: 'View cost breakdown', dateStr: 'Today' },
  { id: 'n3',  type: 'security',       severity: 'critical', title: 'XSS payload detected in query string',  desc: 'Cross-site scripting attempt blocked on /api/search from 198.51.100.17.',           time: '3h ago',  cloud: 'aws',   read: false, action: 'View incident', dateStr: 'Today' },
  { id: 'n4',  type: 'ai',             severity: 'info',     title: 'AI analysis completed',                 desc: 'CloudCEO AI finished analysing your cloud environment. 5 new insights available.', time: '6h ago',              read: false, action: 'View insights', dateStr: 'Today' },
  { id: 'n5',  type: 'cloud',          severity: 'info',     title: 'Azure VM autoscale triggered',           desc: 'East US 2 region — 3 new instances added due to traffic spike.',                    time: '12h ago', cloud: 'azure', read: true,  action: 'View resources', dateStr: 'Today' },
  { id: 'n6',  type: 'security',       severity: 'warning',  title: 'WAF rule set updated',                  desc: 'AWS-AWSManagedRulesSQLiRuleSet updated to v2.1. Review new rule coverage.',          time: '1d ago',  cloud: 'aws',   read: true,  action: 'Review changes', dateStr: 'Yesterday' },
  { id: 'n7',  type: 'reports',        severity: 'info',     title: 'Monthly cost report generated',         desc: 'May 2026 billing summary is ready for download. Total spend: $47,100.',              time: '2d ago',              read: true,  action: 'Download report', dateStr: 'Earlier' },
  { id: 'n8',  type: 'cost',           severity: 'warning',  title: 'Unusual traffic spike detected',        desc: 'From 198.51.100.17 — 218 requests blocked. May indicate a scraping attempt.',       time: '1d ago',  cloud: 'aws',   read: true,  action: 'View security log', dateStr: 'Yesterday' },
  { id: 'n9',  type: 'cloud',          severity: 'info',     title: 'AWS Cost Explorer sync complete',       desc: 'Billing data refreshed successfully. 346 resources indexed.',                        time: '1d ago',  cloud: 'aws',   read: true,  action: undefined, dateStr: 'Yesterday' },
  { id: 'n10', type: 'infrastructure', severity: 'warning',  title: 'EC2 capacity at 78% utilisation',      desc: 'Production cluster approaching limit. Forecast to hit 85% by August 14.',            time: '2d ago',  cloud: 'aws',   read: true,  action: 'View forecast', dateStr: 'Earlier' },
  { id: 'n11', type: 'ai',             severity: 'info',     title: '3 new recommendations available',      desc: 'CloudCEO AI identified $1,712/month in optimization opportunities.',                   time: '3d ago',              read: true,  action: 'View recommendations', dateStr: 'Earlier' },
  { id: 'n12', type: 'reports',        severity: 'info',     title: 'Security assessment report ready',      desc: 'Q2 2026 security assessment has been generated (8 pages).',                           time: '3d ago',              read: true,  action: 'View report', dateStr: 'Earlier' },
];

interface NotificationContextValue {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  archive: (id: string) => void;
  archiveAllRead: () => void;
  archiveSelected: (ids: Set<string>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const markRead = (id: string) => {
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const markAllRead = () => {
    simulateLoading();
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };

  const archive = (id: string) => {
    setNotifications(n => n.filter(x => x.id !== id));
  };

  const archiveAllRead = () => {
    simulateLoading();
    setNotifications(n => n.filter(x => !x.read));
  };

  const archiveSelected = (ids: Set<string>) => {
    simulateLoading();
    setNotifications(n => n.filter(x => !ids.has(x.id)));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, isLoading, unreadCount,
      markRead, markAllRead, archive, archiveAllRead, archiveSelected
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
