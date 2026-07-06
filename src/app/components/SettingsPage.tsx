import { useState } from 'react';
import { Globe, Cloud, Bell, Lock, Key, Users, CreditCard, Check, ChevronRight } from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface SettingsPageProps {
  breadcrumbs: BreadcrumbItem[];
}

type Tab = 'general' | 'connections' | 'notifications' | 'security' | 'api-keys' | 'team' | 'billing';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'general',       label: 'General',           icon: Globe      },
  { id: 'connections',   label: 'Cloud connections',  icon: Cloud      },
  { id: 'notifications', label: 'Notifications',      icon: Bell       },
  { id: 'security',      label: 'Security',           icon: Lock       },
  { id: 'api-keys',      label: 'API keys',           icon: Key        },
  { id: 'team',          label: 'Team',               icon: Users      },
  { id: 'billing',       label: 'Plan & billing',     icon: CreditCard },
];

export function SettingsPage({ breadcrumbs }: SettingsPageProps) {
  const [tab, setTab]   = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isCompact = isMobile || isTablet;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const content = (
    <>
      {tab === 'general'       && <GeneralSection     onSave={handleSave} saved={saved} isMobile={isMobile} />}
      {tab === 'connections'   && <ConnectionsSection isMobile={isMobile} />}
      {tab === 'notifications' && <NotificationsSection />}
      {tab === 'security'      && <SecuritySection />}
      {tab === 'api-keys'      && <ApiKeysSection isMobile={isMobile} />}
      {tab === 'team'          && <TeamSection isMobile={isMobile} />}
      {tab === 'billing'       && <BillingSection />}
    </>
  );

  /* ── Mobile / Tablet — stacked layout ── */
  if (isCompact) {
    return (
      <div style={{ fontFamily: 'var(--dash-font)' }}>
        <BreadcrumbNav items={breadcrumbs} />

        {/* Horizontal scrollable tab bar */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            borderBottom: '1px solid var(--dash-border)',
            marginBottom: 16,
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 44, border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: active ? '2px solid var(--dash-accent)' : '2px solid transparent',
                  color: active ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                  fontSize: 13, fontWeight: active ? 500 : 400, whiteSpace: 'nowrap',
                  fontFamily: 'var(--dash-font)', marginBottom: -1, flexShrink: 0,
                }}
              >
                <Icon size={14} strokeWidth={1.5} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content card */}
        <div style={{
          backgroundColor: 'var(--dash-bg-surface)',
          border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius-card)',
          padding: isMobile ? 16 : 24,
        }}>
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
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)' }}>Settings</div>
            <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 2 }}>CloudCEO</div>
          </div>
          <nav style={{ padding: '8px 0' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
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
                    <Icon size={15} strokeWidth={1.5} /> {t.label}
                  </span>
                  {active && <ChevronRight size={13} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
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
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', lineHeight: 1.55 }}>{desc}</div>}
    </div>
  );
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 6, fontFamily: 'var(--dash-font)' }}>{label}</label>
      <input
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
        color: '#FFFFFF', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'var(--dash-font)', display: 'inline-flex', alignItems: 'center', gap: 6,
        minHeight: 'var(--dash-touch-target)', transition: 'background-color 0.2s ease',
      }}
    >
      {saved && <Check size={14} />}{saved ? 'Saved' : 'Save changes'}
    </button>
  );
}

function PrefToggle({ on }: { on: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <div onClick={() => setActive(!active)} style={{ display: 'inline-flex', cursor: 'pointer', alignItems: 'center' }}>
      <div style={{ width: 36, height: 20, borderRadius: 999, backgroundColor: active ? 'var(--dash-accent)' : 'var(--dash-border)', position: 'relative', transition: 'background-color 0.15s ease', flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', top: 3, left: active ? 19 : 3, transition: 'left 0.15s ease' }} />
      </div>
    </div>
  );
}

/* ─── Section components ────────────────────────────────────────── */

function GeneralSection({ onSave, saved, isMobile }: { onSave: () => void; saved: boolean; isMobile: boolean }) {
  return (
    <div>
      <SectionTitle title="General" desc="Organization-level settings for your CloudCEO workspace." />
      <Field label="Organization name" value="CloudCEO" />
      <Field label="Default timezone" value="America/New_York (UTC−5)" />
      <Field label="Default currency" value="USD ($)" />
      <Field label="Fiscal year start" value="January" />
      <Field label="Cloud data refresh" value="Every 15 minutes" hint="Minimum: 5 minutes for Enterprise plan" />
      <SaveBtn onSave={onSave} saved={saved} />
    </div>
  );
}

function ConnectionsSection({ isMobile }: { isMobile: boolean }) {
  const providers = [
    { variant: 'aws' as const, name: 'Amazon Web Services', account: '123456789012', region: 'us-east-1', features: ['Cost Explorer', 'Billing', 'WAF'], sync: '2 min ago' },
    { variant: 'azure' as const, name: 'Microsoft Azure', account: 'cloudceo-prod-001', region: 'East US', features: ['Cost Management', 'WAF', 'Defender'], sync: '4 min ago' },
  ];
  return (
    <div>
      <SectionTitle title="Cloud connections" desc="Manage your AWS and Azure account integrations." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {providers.map((c, i) => (
          <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: isMobile ? '14px 16px' : '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CloudBadge variant={c.variant} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 6, fontFamily: 'ui-monospace, monospace' }}>
                    {c.variant === 'aws' ? `Account: ${c.account}` : `Sub: ${c.account}`}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.features.map(f => (
                      <span key={f} style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 999, backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', color: 'var(--dash-text-secondary)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-end', gap: 8 }}>
                <StatusBadge label="Connected" severity="success" />
                <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>Synced {c.sync}</span>
                <button style={{ fontSize: 12, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)', fontWeight: 500 }}>Configure →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={{ padding: '9px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)' }}>
        + Add cloud account
      </button>
    </div>
  );
}

function NotificationsSection() {
  const channels = [
    { label: 'Email',   value: 'john.davidson@cloudceo.com', on: true  },
    { label: 'Slack',   value: '#cloud-alerts',              on: false },
    { label: 'Webhook', value: 'Not configured',             on: false },
  ];
  return (
    <div>
      <SectionTitle title="Notification channels" desc="Configure where CloudCEO sends alerts and reports." />
      {channels.map((c, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '14px 18px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 3 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>{c.value}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {c.on ? <StatusBadge label="Active" severity="success" /> : <StatusBadge label="Inactive" severity="warning" />}
            <button style={{ fontSize: 12, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)', fontWeight: 500 }}>Configure</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20 }}>
        <SectionTitle title="Alert preferences" />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Alert type', 'Email', 'Slack', 'Push'].map(h => (
                <th key={h} style={{ padding: '8px 0', textAlign: h === 'Alert type' ? 'left' : 'center', fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Critical security alerts', true, true, true],
              ['Budget warnings', true, false, false],
              ['Monthly cost reports', true, false, false],
              ['WAF rule updates', false, false, false],
            ].map(([label, e, s, p], i) => (
              <tr key={i as number} style={{ borderBottom: '1px solid var(--dash-border-light)' }}>
                <td style={{ padding: '11px 0', fontSize: 13, color: 'var(--dash-text-primary)' }}>{label as string}</td>
                {[e, s, p].map((on, j) => <td key={j} style={{ textAlign: 'center', padding: '11px 0' }}><PrefToggle on={on as boolean} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecuritySection() {
  const policies = [
    { title: 'Enforce MFA for all users',  desc: 'Require two-factor authentication for every team member', enabled: true  },
    { title: 'Session timeout (8h)',        desc: 'Auto sign-out after 8 hours of inactivity',              enabled: true  },
    { title: 'IP allowlist',               desc: 'Restrict login to specific IP address ranges',            enabled: false },
    { title: 'Full audit log (90 days)',    desc: 'Retain a complete audit trail of all user actions',      enabled: true  },
    { title: 'Single sign-on (SSO)',        desc: 'Connect your identity provider for centralized auth',    enabled: false },
  ];
  return (
    <div>
      <SectionTitle title="Security settings" desc="Workspace-wide security and access policies." />
      {policies.map((s, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '14px 18px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.4 }}>{s.desc}</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            {s.enabled ? <StatusBadge label="Enabled" severity="success" /> : <StatusBadge label="Disabled" severity="warning" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApiKeysSection({ isMobile }: { isMobile: boolean }) {
  const keys = [
    { name: 'Grafana integration', key: 'cc_grf_', created: 'Feb 14, 2026', last: '2h ago',     scopes: 'read:billing, read:security' },
    { name: 'Terraform provider',  key: 'cc_tf_',  created: 'Mar 2, 2026',  last: '5 days ago', scopes: 'read:billing' },
  ];
  return (
    <div>
      <SectionTitle title="API keys" desc="Workspace API keys for service-to-service integrations." />
      {keys.map((k, i) => (
        <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '14px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{k.name}</span>
            <button style={{ fontSize: 12, color: 'var(--dash-danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)', flexShrink: 0, marginLeft: 8 }}>Revoke</button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', fontFamily: 'ui-monospace, monospace', marginBottom: 4 }}>{k.key}••••••••••••</div>
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

function TeamSection({ isMobile }: { isMobile: boolean }) {
  const members = [
    { name: 'John Davidson',  email: 'john@cloudceo.com',   role: 'Owner',  last: 'Active now' },
    { name: 'Sarah Chen',     email: 'sarah@cloudceo.com',  role: 'Admin',  last: '1h ago'     },
    { name: 'Marcus Webb',    email: 'marcus@cloudceo.com', role: 'Viewer', last: '3h ago'     },
    { name: 'Priya Patel',    email: 'priya@cloudceo.com',  role: 'Viewer', last: '2d ago'     },
  ];
  const roleColors: Record<string, 'success' | 'warning'> = { Owner: 'success', Admin: 'warning', Viewer: 'success' };
  return (
    <div>
      <SectionTitle title="Team members" desc="Manage who has access to your CloudCEO workspace." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {members.map((m, i) => (
          <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--dash-accent)', flexShrink: 0 }}>
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                {!isMobile && <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <StatusBadge label={m.role} severity={roleColors[m.role] || 'success'} />
              {m.role !== 'Owner' && <button style={{ fontSize: 12, color: 'var(--dash-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>···</button>}
            </div>
          </div>
        ))}
      </div>
      <button style={{ padding: '9px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 'var(--dash-touch-target)' }}>
        + Invite team member
      </button>
    </div>
  );
}

function BillingSection() {
  return (
    <div>
      <SectionTitle title="Plan & billing" desc="Your CloudCEO subscription and payment details." />
      <div style={{ backgroundColor: 'var(--dash-accent-tint)', borderRadius: 8, border: '1px solid var(--dash-accent)', padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 4 }}>Enterprise Plan</div>
            <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>Unlimited cloud accounts · 4 team members · Priority support</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>$299/mo</div>
            <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>Next charge Jul 1, 2026</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 12 }}>Billing history</div>
      {[['Jun 2026', '$299.00'], ['May 2026', '$299.00'], ['Apr 2026', '$299.00']].map(([month, amount]) => (
        <div key={month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--dash-border-light)' }}>
          <span style={{ fontSize: 13, color: 'var(--dash-text-primary)' }}>{month}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: 'var(--dash-text-primary)' }}>{amount}</span>
            <StatusBadge label="Paid" severity="success" />
            <button style={{ fontSize: 12, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>PDF</button>
          </div>
        </div>
      ))}
    </div>
  );
}
