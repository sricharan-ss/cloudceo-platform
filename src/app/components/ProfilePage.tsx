import { useState } from 'react';
import { User, Lock, Monitor, Key, Bell, Cloud, Clock, ChevronRight, Check, Camera } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ProfilePageProps {
  breadcrumbs: BreadcrumbItem[];
}

type Section = 'profile' | 'security' | 'sessions' | 'api' | 'notifications' | 'connections' | 'activity';

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Personal info',         icon: User    },
  { id: 'security',      label: 'Password & security',   icon: Lock    },
  { id: 'sessions',      label: 'Active sessions',       icon: Monitor },
  { id: 'api',           label: 'API access',            icon: Key     },
  { id: 'notifications', label: 'Notifications',         icon: Bell    },
  { id: 'connections',   label: 'Cloud connections',     icon: Cloud   },
  { id: 'activity',      label: 'Recent activity',       icon: Clock   },
];

export function ProfilePage({ breadcrumbs }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isCompact = isMobile || isTablet;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const content = (
    <>
      {activeSection === 'profile'       && <ProfileSection  onSave={handleSave} saved={saved} isMobile={isMobile} />}
      {activeSection === 'security'      && <SecuritySection />}
      {activeSection === 'sessions'      && <SessionsSection isMobile={isMobile} />}
      {activeSection === 'api'           && <ApiSection      isMobile={isMobile} />}
      {activeSection === 'notifications' && <NotificationsSection />}
      {activeSection === 'connections'   && <ConnectionsSection isMobile={isMobile} />}
      {activeSection === 'activity'      && <ActivitySection />}
    </>
  );

  /* ── Mobile / Tablet — stacked layout ── */
  if (isCompact) {
    return (
      <div style={{ fontFamily: 'var(--dash-font)' }}>
        <BreadcrumbNav items={breadcrumbs} />

        {/* Profile summary card */}
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: isMobile ? '16px' : '20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 16 : 20, fontWeight: 600, color: 'var(--dash-accent)' }}>JD</div>
            <button style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', border: '2px solid var(--dash-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Camera size={11} color="#FFFFFF" />
            </button>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text-primary)' }}>John Davidson</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginTop: 2 }}>CEO · Acme Corporation</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', marginTop: 1 }}>john.davidson@acmecorp.com</div>
          </div>
        </div>

        {/* Horizontal scrollable section tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--dash-border)', marginBottom: 16, scrollbarWidth: 'none' }}>
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', height: 44,
                  border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0,
                  borderBottom: active ? '2px solid var(--dash-accent)' : '2px solid transparent',
                  color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                  fontSize: 13, fontWeight: active ? 500 : 400, fontFamily: 'var(--dash-font)', marginBottom: -1,
                }}
              >
                <Icon size={13} strokeWidth={1.5} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: isMobile ? 16 : 24 }}>
          {content}
        </div>
      </div>
    );
  }

  /* ── Desktop — two-column ── */
  return (
    <div style={{ fontFamily: 'var(--dash-font)' }}>
      <BreadcrumbNav items={breadcrumbs} />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left nav */}
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', overflow: 'hidden', position: 'sticky', top: 96 }}>
          {/* Profile summary */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--dash-border)', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: 'var(--dash-accent)' }}>JD</div>
              <button style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', border: '2px solid var(--dash-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={11} color="#FFFFFF" />
              </button>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>John Davidson</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginTop: 2 }}>CEO · Acme Corp</div>
          </div>

          {/* Nav items */}
          <nav style={{ padding: '8px 0' }}>
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer',
                    backgroundColor: active ? 'var(--dash-accent-tint)' : 'transparent',
                    color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                    fontSize: 13, fontWeight: active ? 500 : 400, textAlign: 'left',
                    borderLeft: active ? '3px solid var(--dash-accent)' : '3px solid transparent',
                    fontFamily: 'var(--dash-font)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={15} strokeWidth={1.5} />{s.label}
                  </span>
                  {active && <ChevronRight size={13} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content panel */}
        <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: 28 }}>
          {content}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared primitives ────────────────────────────────────────── */

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', lineHeight: 1.55 }}>{desc}</div>}
    </div>
  );
}

function Field({ label, value, type = 'text', hint }: { label: string; value: string; type?: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 5, fontFamily: 'var(--dash-font)' }}>{label}</label>
      <input
        type={type}
        defaultValue={value}
        style={{
          width: '100%', maxWidth: 440, height: 36, padding: '0 12px', fontSize: 14,
          fontFamily: 'var(--dash-font)', borderRadius: 'var(--dash-radius-button)',
          border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)',
          color: 'var(--dash-text-primary)', outline: 'none', boxSizing: 'border-box',
        }}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function SaveBtn({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      style={{
        marginTop: 8, padding: '9px 20px', borderRadius: 'var(--dash-radius-button)', border: 'none',
        backgroundColor: saved ? 'var(--dash-success)' : 'var(--dash-accent)',
        color: '#FFFFFF', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)',
        display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 'var(--dash-touch-target)',
        transition: 'background-color 0.2s ease',
      }}
    >
      {saved && <Check size={14} />}{saved ? 'Saved' : 'Save changes'}
    </button>
  );
}

function PrefToggle({ on }: { on: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <div onClick={() => setActive(!active)} style={{ cursor: 'pointer', display: 'inline-flex' }}>
      <div style={{ width: 34, height: 20, borderRadius: 999, backgroundColor: active ? 'var(--dash-accent)' : 'var(--dash-border)', position: 'relative', transition: 'background-color 0.15s ease', flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', top: 3, left: active ? 17 : 3, transition: 'left 0.15s ease' }} />
      </div>
    </div>
  );
}

/* ─── Section components ────────────────────────────────────────── */

function ProfileSection({ onSave, saved, isMobile }: { onSave: () => void; saved: boolean; isMobile: boolean }) {
  return (
    <div>
      <SectionTitle title="Personal information" desc="Update your name, email, and profile details." />
      <Field label="Full name"     value="John Davidson" />
      <Field label="Email address" value="john.davidson@acmecorp.com" type="email" hint="Used for login and notifications" />
      <Field label="Job title"     value="Chief Executive Officer" />
      <Field label="Organization"  value="Acme Corporation" />
      <Field label="Time zone"     value="America/New_York (UTC−5)" />
      <SaveBtn onSave={onSave} saved={saved} />
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <SectionTitle title="Password & security" desc="Manage your password and two-factor authentication." />
      {[
        { title: 'Password', sub: 'Last changed 90 days ago', action: 'Change password', status: null },
        { title: 'Two-factor authentication', sub: 'Add an extra layer of security', action: null, status: 'Enabled' as const },
        { title: 'Single sign-on (SSO)', sub: 'Sign in with your identity provider', action: null, status: 'Not configured' as const },
      ].map((s, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '16px 18px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>{s.sub}</div>
          </div>
          {s.action
            ? <button style={{ padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>{s.action}</button>
            : <StatusBadge label={s.status!} severity={s.status === 'Enabled' ? 'success' : 'warning'} />
          }
        </div>
      ))}
    </div>
  );
}

function SessionsSection({ isMobile }: { isMobile: boolean }) {
  const sessions = [
    { device: 'Chrome on macOS',   location: 'New York, US',  ip: '192.0.2.1',    last: 'Active now',  current: true  },
    { device: 'Safari on iPhone',  location: 'New York, US',  ip: '192.0.2.2',    last: '2h ago',      current: false },
    { device: 'Chrome on Windows', location: 'Chicago, US',   ip: '203.0.113.1',  last: '3 days ago',  current: false },
  ];
  return (
    <div>
      <SectionTitle title="Active sessions" desc="Manage devices currently signed in to your account." />
      {sessions.map((s, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '14px 18px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {s.device}
              {s.current && <StatusBadge label="Current" severity="success" />}
            </div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>
              {isMobile ? s.last : `${s.location} · ${s.ip} · ${s.last}`}
            </div>
          </div>
          {!s.current && <button style={{ fontSize: 12, color: 'var(--dash-danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)', fontWeight: 500, flexShrink: 0 }}>Revoke</button>}
        </div>
      ))}
    </div>
  );
}

function ApiSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div>
      <SectionTitle title="API access" desc="Personal API keys for programmatic access." />
      {[
        { name: 'Production key',        prefix: 'cc_prod_', created: 'Jan 12, 2026', last: '2h ago',      scopes: 'read:billing, read:security' },
        { name: 'Analytics integration', prefix: 'cc_int_',  created: 'Mar 4, 2026',  last: '5 days ago',  scopes: 'read:billing' },
      ].map((k, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '14px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{k.name}</span>
            <button style={{ fontSize: 12, color: 'var(--dash-danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>Revoke</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', fontFamily: 'ui-monospace, monospace', marginBottom: 4 }}>{k.prefix}••••••••••••</div>
          <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>Created {k.created} · Last used {k.last}</div>
          {!isMobile && <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 2 }}>Scopes: {k.scopes}</div>}
        </div>
      ))}
      <button style={{ marginTop: 4, padding: '9px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)' }}>
        + Create API key
      </button>
    </div>
  );
}

function NotificationsSection() {
  const prefs = [
    { label: 'Critical security alerts', email: true, slack: true, push: true   },
    { label: 'Budget warnings',          email: true, slack: false, push: false },
    { label: 'Monthly cost reports',     email: true, slack: false, push: false },
    { label: 'WAF rule updates',         email: false, slack: false, push: false },
    { label: 'Cloud sync status',        email: false, slack: false, push: false },
  ];
  return (
    <div>
      <SectionTitle title="Notification preferences" desc="Choose how and when CloudCEO contacts you." />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Alert type', 'Email', 'Slack', 'Push'].map(h => (
                <th key={h} style={{ padding: '8px 0', textAlign: h === 'Alert type' ? 'left' : 'center', fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prefs.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--dash-border-light)' }}>
                <td style={{ padding: '11px 0', fontSize: 13, color: 'var(--dash-text-primary)' }}>{p.label}</td>
                {[p.email, p.slack, p.push].map((on, j) => <td key={j} style={{ textAlign: 'center', padding: '11px 0' }}><PrefToggle on={on} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConnectionsSection({ isMobile }: { isMobile: boolean }) {
  return (
    <div>
      <SectionTitle title="Connected cloud accounts" desc="Manage your AWS and Azure account connections." />
      {[
        { variant: 'aws' as const, name: 'Amazon Web Services', account: '123456789012', status: 'connected', sync: '2 min ago' },
        { variant: 'azure' as const, name: 'Microsoft Azure', account: 'acme-prod-001', status: 'connected', sync: '4 min ago' },
      ].map((c, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '16px 18px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CloudBadge variant={c.variant} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', fontFamily: 'ui-monospace, monospace' }}>{c.variant === 'aws' ? `Account: ${c.account}` : `Sub: ${c.account}`}</div>
              <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginTop: 2 }}>Last sync: {c.sync}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StatusBadge label="Connected" severity="success" />
            <button style={{ fontSize: 12, color: 'var(--dash-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>Configure</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivitySection() {
  const events = [
    { action: 'Signed in',                   detail: 'Chrome on macOS · New York, US',     time: '2h ago'  },
    { action: 'Exported cost report',         detail: 'May 2026 Billing Summary PDF',        time: '5h ago'  },
    { action: 'Acknowledged security alert',  detail: 'SQL injection attempt #841',          time: '1d ago'  },
    { action: 'Changed notification settings', detail: 'Enabled Slack for critical alerts',  time: '3d ago'  },
    { action: 'Connected Azure account',      detail: 'Subscription acme-prod-001',          time: '4d ago'  },
    { action: 'Created API key',              detail: 'Analytics integration key',           time: '14d ago' },
  ];
  return (
    <div>
      <SectionTitle title="Recent activity" desc="A log of recent account actions." />
      {events.map((e, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 0', borderBottom: i < events.length - 1 ? '1px solid var(--dash-border-light)' : 'none', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{e.action}</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', marginTop: 2 }}>{e.detail}</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{e.time}</span>
        </div>
      ))}
    </div>
  );
}
