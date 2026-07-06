import { useState } from 'react';
import {
  Search, Bell, Calendar, ChevronDown, ChevronRight, Plus, Trash2,
  Edit, Eye, Download, Upload, RefreshCw, Filter, X, Check, AlertTriangle,
  Info, ArrowUp, ArrowDown, Cloud, Link2, MoreHorizontal, Copy,
  ExternalLink, Settings, LayoutDashboard, BarChart2, Shield,
  Loader2, ToggleLeft, ToggleRight, Home, TrendingUp, Layers,
  AlertCircle, CheckCircle2, Clock, Globe, Cpu, Database, Server,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';

const MONO = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';

/* ─── Layout helpers ─────────────────────────────────────────────── */

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 64, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: MONO }}>{n}</span>
        <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{title}</span>
      </div>
      <div style={{ height: 1, backgroundColor: 'var(--dash-border)', marginBottom: 28 }} />
      {children}
    </section>
  );
}

function DocCard({ title, children, noPad }: { title?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div style={{
      backgroundColor: 'var(--dash-bg-surface)',
      border: '1px solid var(--dash-border)',
      borderRadius: 'var(--dash-radius-card)',
      padding: noPad ? 0 : 24,
      marginBottom: 16,
      overflow: noPad ? 'hidden' : undefined,
    }}>
      {title && (
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'var(--dash-font)' }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Token({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <code style={{ fontSize: 11, color: 'var(--dash-accent)', fontFamily: MONO, whiteSpace: 'nowrap' }}>{name}</code>
      <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontFamily: MONO }}>{value}</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export function DesignSystem() {
  return (
    <div style={{ fontFamily: 'var(--dash-font)', maxWidth: 1000 }}>

      {/* Page header */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontFamily: MONO }}>
          CloudCEO
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 12, lineHeight: 1.1 }}>
          Design System
        </div>
        <div style={{ fontSize: 14, color: 'var(--dash-text-secondary)', maxWidth: 600, lineHeight: 1.7 }}>
          Tokens, patterns, and components that power every CloudCEO screen. Every value maps to{' '}
          <code style={{ fontFamily: MONO, fontSize: 12, backgroundColor: 'var(--dash-bg-page)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--dash-border)' }}>
            globals.css
          </code>
          {' '}— update the source and the entire product updates automatically.
        </div>
      </div>

      {/* ── 01 Foundation ─────────────────────────────────────────── */}
      <Section id="foundation" n="01" title="Foundation">
        <p style={{ fontSize: 14, color: 'var(--dash-text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
          Premium Enterprise SaaS aesthetic. 8px spatial system. Clear hierarchy. WCAG AA accessible throughout. Flat, calm, information-first — matching Microsoft Azure Portal, Stripe Dashboard, and Vercel Analytics in visual quality.
        </p>
        <DocCard title="Design principles">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              ['8px grid', 'All spacing, sizing, and layout follows multiples of 8'],
              ['Information-first', 'Data is always the hero — chrome stays minimal'],
              ['Muted semantics', 'Success / Warning / Danger use desaturated hues, not traffic-light brightness'],
              ['Flat surfaces', 'No gradients, no heavy shadows — 1px borders carry the structure'],
            ].map(([name, desc]) => (
              <div key={name} style={{ padding: '14px 16px', backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 02 Colors ─────────────────────────────────────────────── */}
      <Section id="colors" n="02" title="Colors">

        <DocCard title="Brand">
          <ColorRow swatches={[
            { label: 'Accent',      var: '--dash-accent',      hex: '#3B5BDB' },
            { label: 'Accent tint', var: '--dash-accent-tint', hex: '#EEF1FC', dark: false },
          ]} />
        </DocCard>

        <DocCard title="Backgrounds & surfaces">
          <ColorRow swatches={[
            { label: 'Page',    var: '--dash-bg-page',    hex: '#FAFAF9', dark: false },
            { label: 'Surface', var: '--dash-bg-surface', hex: '#FFFFFF', dark: false },
          ]} />
        </DocCard>

        <DocCard title="Borders">
          <ColorRow swatches={[
            { label: 'Border',       var: '--dash-border',        hex: '#E5E3DE', dark: false },
            { label: 'Border strong',var: '--dash-border-strong',  hex: '#D1CFC8', dark: false },
            { label: 'Border light', var: '--dash-border-light',   hex: '#F0EFEB', dark: false },
          ]} />
        </DocCard>

        <DocCard title="Text hierarchy">
          <ColorRow swatches={[
            { label: 'Primary',   var: '--dash-text-primary',   hex: '#1C1B19' },
            { label: 'Secondary', var: '--dash-text-secondary', hex: '#6B6A64' },
            { label: 'Muted',     var: '--dash-text-muted',     hex: '#9C9A92' },
          ]} />
        </DocCard>

        <DocCard title="Semantic — success">
          <ColorRow swatches={[
            { label: 'Success',      var: '--dash-success',      hex: '#4D7C5F' },
            { label: 'Success tint', var: '--dash-success-tint', hex: '#EDF3EE', dark: false },
            { label: 'Success text', var: '--dash-success-text', hex: '#2D5A3D' },
          ]} />
        </DocCard>

        <DocCard title="Semantic — warning">
          <ColorRow swatches={[
            { label: 'Warning',      var: '--dash-warning',      hex: '#B8862E' },
            { label: 'Warning tint', var: '--dash-warning-tint', hex: '#FAF1E2', dark: false },
            { label: 'Warning text', var: '--dash-warning-text', hex: '#7A5A1E' },
          ]} />
        </DocCard>

        <DocCard title="Semantic — danger / critical">
          <ColorRow swatches={[
            { label: 'Danger',      var: '--dash-danger',      hex: '#B8473F' },
            { label: 'Danger tint', var: '--dash-danger-tint', hex: '#F8EBEA', dark: false },
            { label: 'Danger text', var: '--dash-danger-text', hex: '#7A2E2A' },
          ]} />
        </DocCard>

        <DocCard title="Neutral / chart">
          <ColorRow swatches={[
            { label: 'Chart neutral', var: '--dash-neutral-chart',  hex: '#8B85B8' },
            { label: 'Attack bars',   var: '--dash-neutral-attack', hex: '#6B6588' },
          ]} />
        </DocCard>
      </Section>

      {/* ── 03 Typography ─────────────────────────────────────────── */}
      <Section id="typography" n="03" title="Typography">
        <DocCard>
          <div style={{ marginBottom: 8 }}>
            <Token name="--dash-font" value="'Instrument Sans', 'Inter', system-ui, -apple-system, sans-serif" />
          </div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginTop: 8 }}>
            All numeric values use <code style={{ fontFamily: MONO }}>font-variant-numeric: tabular-nums</code> to ensure column alignment.
          </div>
        </DocCard>

        <DocCard title="Type scale" noPad>
          {[
            { label: 'Display',     size: 32, weight: 700, sample: 'Executive Dashboard' },
            { label: 'Heading 1',   size: 28, weight: 600, sample: '$42,310', numeric: true },
            { label: 'Heading 2',   size: 22, weight: 600, sample: 'Cost Overview' },
            { label: 'Heading 3',   size: 20, weight: 500, sample: 'Cloud spend trend' },
            { label: 'Heading 4',   size: 16, weight: 500, sample: 'Top services by cost' },
            { label: 'Body large',  size: 16, weight: 400, sample: 'Account data syncs every 15 minutes.' },
            { label: 'Body',        size: 14, weight: 400, sample: 'Table rows, descriptions, and supporting text content.' },
            { label: 'Small',       size: 12, weight: 400, sample: 'Badge labels, captions, secondary metadata.' },
            { label: 'Caption',     size: 11, weight: 400, sample: 'Chart axis labels, timestamps, helper text.' },
            { label: 'Overline',    size: 12, weight: 600, sample: 'TOTAL CLOUD SPEND', upper: true },
            { label: 'Numeric KPI', size: 28, weight: 600, sample: '$284,910', numeric: true },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '12px 24px',
              borderBottom: i < 10 ? '1px solid var(--dash-border-light)' : 'none',
            }}>
              <div style={{ width: 110, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{row.label}</div>
                <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 2, fontFamily: MONO }}>{row.size}px / {row.weight}</div>
              </div>
              <div style={{
                fontSize: row.size,
                fontWeight: row.weight,
                color: 'var(--dash-text-primary)',
                fontFamily: 'var(--dash-font)',
                letterSpacing: row.upper ? '0.08em' : undefined,
                textTransform: row.upper ? 'uppercase' : undefined,
                fontVariantNumeric: row.numeric ? 'tabular-nums' : undefined,
                lineHeight: 1.2,
              }}>
                {row.sample}
              </div>
            </div>
          ))}
        </DocCard>
      </Section>

      {/* ── 04 Spacing ────────────────────────────────────────────── */}
      <Section id="spacing" n="04" title="Spacing">
        <DocCard title="Spacing tokens — 8px base unit">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { token: '--dash-space-xs',  px: 4,  label: 'xs' },
              { token: '--dash-space-sm',  px: 8,  label: 'sm' },
              { token: '--dash-space-md',  px: 12, label: 'md' },
              { token: '--dash-space-lg',  px: 16, label: 'lg' },
              { token: '--dash-space-xl',  px: 20, label: 'xl' },
              { token: '--dash-space-2xl', px: 24, label: '2xl' },
              { token: '--dash-space-3xl', px: 32, label: '3xl' },
              { token: '—',               px: 40, label: '40' },
              { token: '—',               px: 48, label: '48' },
              { token: '—',               px: 64, label: '64' },
              { token: '—',               px: 80, label: '80' },
              { token: '—',               px: 96, label: '96' },
            ].map((s) => (
              <div key={s.px} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <code style={{ width: 160, fontSize: 11, color: 'var(--dash-accent)', fontFamily: MONO, flexShrink: 0 }}>{s.token}</code>
                <div style={{ width: s.px, height: 20, backgroundColor: 'var(--dash-accent)', borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>{s.px}px</span>
              </div>
            ))}
          </div>
        </DocCard>

        <DocCard title="Grid system">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { breakpoint: 'Desktop', width: '1440px', cols: '12', gutter: '20px', margin: '32px' },
              { breakpoint: 'Tablet',  width: '1024px', cols: '8',  gutter: '16px', margin: '24px' },
              { breakpoint: 'Mobile',  width: '390px',  cols: '4',  gutter: '12px', margin: '16px' },
            ].map((g) => (
              <div key={g.breakpoint} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', padding: '16px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 10 }}>{g.breakpoint}</div>
                {[['Frame', g.width], ['Columns', g.cols], ['Gutter', g.gutter], ['Margin', g.margin]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{k}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: MONO }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 05 Elevation ──────────────────────────────────────────── */}
      <Section id="elevation" n="05" title="Elevation">
        <DocCard title="Border radius tokens">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
            {[
              { token: '--dash-radius-card',   px: '12px', label: 'Cards' },
              { token: '--dash-radius-button',  px: '8px',  label: 'Buttons / Inputs' },
              { token: '--dash-radius-pill',    px: '9999px', label: 'Pills / Badges' },
            ].map((r) => (
              <div key={r.token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 80, height: 48,
                  backgroundColor: 'var(--dash-accent-tint)',
                  border: '2px solid var(--dash-accent)',
                  borderRadius: r.px === '9999px' ? 999 : parseInt(r.px),
                }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)', textAlign: 'center' }}>{r.label}</div>
                <code style={{ fontSize: 11, color: 'var(--dash-text-muted)', fontFamily: MONO }}>{r.px}</code>
                <code style={{ fontSize: 10, color: 'var(--dash-text-muted)', fontFamily: MONO }}>{r.token}</code>
              </div>
            ))}
          </div>
        </DocCard>

        <DocCard title="Surface styles">
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Flat card', desc: '1px border, no shadow', extra: {} },
              { label: 'Hover card', desc: 'Border darkens to --dash-border-strong', extra: { borderColor: 'var(--dash-border-strong)' } },
              { label: 'Page background', desc: 'Warm off-white, no border', extra: { backgroundColor: 'var(--dash-bg-page)', borderStyle: 'dashed' } },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, padding: 20, borderRadius: 12,
                backgroundColor: 'var(--dash-bg-surface)',
                border: '1px solid var(--dash-border)',
                ...s.extra,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 06 Icons ──────────────────────────────────────────────── */}
      <Section id="icons" n="06" title="Icons">
        <p style={{ fontSize: 14, color: 'var(--dash-text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
          Lucide React — outline style throughout. Stroke width 1.5 (inactive) and 2 (active/emphasis). Three sizes: 24px (large UI actions), 20px (navigation, buttons), 16px (inline, badges).
        </p>
        <DocCard title="24px — Large actions">
          <IconGrid icons={[
            ['LayoutDashboard', LayoutDashboard], ['BarChart2', BarChart2], ['Shield', Shield],
            ['Settings', Settings], ['Bell', Bell], ['Search', Search],
            ['Calendar', Calendar], ['Download', Download], ['Upload', Upload],
            ['Plus', Plus], ['Trash2', Trash2], ['Edit', Edit],
            ['Eye', Eye], ['Copy', Copy], ['ExternalLink', ExternalLink],
            ['RefreshCw', RefreshCw], ['Filter', Filter], ['MoreHorizontal', MoreHorizontal],
          ]} size={24} />
        </DocCard>
        <DocCard title="20px — Navigation & buttons">
          <IconGrid icons={[
            ['Home', Home], ['Cloud', Cloud], ['Globe', Globe], ['Cpu', Cpu],
            ['Database', Database], ['Server', Server], ['Link2', Link2],
            ['TrendingUp', TrendingUp], ['ArrowUp', ArrowUp], ['ArrowDown', ArrowDown],
            ['ChevronDown', ChevronDown], ['ChevronRight', ChevronRight],
            ['Check', Check], ['X', X], ['AlertTriangle', AlertTriangle],
            ['Info', Info], ['AlertCircle', AlertCircle], ['CheckCircle2', CheckCircle2],
          ]} size={20} />
        </DocCard>
        <DocCard title="16px — Inline & compact">
          <IconGrid icons={[
            ['Clock', Clock], ['ArrowUp', ArrowUp], ['ArrowDown', ArrowDown],
            ['Layers', Layers], ['Loader2', Loader2], ['Settings', Settings],
          ]} size={16} />
        </DocCard>
      </Section>

      {/* ── 07 Buttons ────────────────────────────────────────────── */}
      <Section id="buttons" n="07" title="Buttons">
        <DocCard title="Variants">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Btn variant="primary">Primary</Btn>
            <Btn variant="secondary">Secondary</Btn>
            <Btn variant="ghost">Ghost</Btn>
            <Btn variant="danger">Danger</Btn>
            <Btn variant="outline">Outline</Btn>
            <Btn variant="icon"><Plus size={16} /></Btn>
          </div>
        </DocCard>

        <DocCard title="Sizes">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Btn variant="primary" size="sm">Small</Btn>
            <Btn variant="primary" size="md">Medium</Btn>
            <Btn variant="primary" size="lg">Large</Btn>
          </div>
        </DocCard>

        <DocCard title="States">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Btn variant="primary">Default</Btn>
            <Btn variant="primary" disabled>Disabled</Btn>
            <Btn variant="primary" loading>Loading</Btn>
          </div>
        </DocCard>
      </Section>

      {/* ── 08 Inputs ─────────────────────────────────────────────── */}
      <Section id="inputs" n="08" title="Inputs">
        <DocCard title="Text field">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
            <InputField label="Label" placeholder="Placeholder text" />
            <InputField label="With value" value="example-value" />
            <InputField label="Error state" value="invalid@" error="Must be a valid email address" />
            <InputField label="Disabled" value="Read only" disabled />
          </div>
        </DocCard>

        <DocCard title="Search">
          <div style={{ maxWidth: 360 }}>
            <SearchInput placeholder="Search services, accounts, alerts…" />
          </div>
        </DocCard>

        <DocCard title="Select / Dropdown">
          <div style={{ maxWidth: 240 }}>
            <SelectInput label="Date range" options={['This month', 'Last 30 days', 'Last 6 months', 'Last 12 months']} />
          </div>
        </DocCard>

        <DocCard title="Toggle, Checkbox & Radio">
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Toggle</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ToggleItem label="AWS Cost Explorer" on />
                <ToggleItem label="Azure WAF Alerts" on={false} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Checkbox</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <CheckboxItem label="EC2 instances" checked />
                <CheckboxItem label="RDS databases" checked={false} />
                <CheckboxItem label="S3 storage" checked />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Radio</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RadioItem label="This month" selected />
                <RadioItem label="Last 7 days" selected={false} />
                <RadioItem label="Custom range" selected={false} />
              </div>
            </div>
          </div>
        </DocCard>

        <DocCard title="Filter chip">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['AWS', 'Azure', 'EC2', 'RDS', 'Critical', 'Last 7 days'].map((chip, i) => (
              <FilterChip key={chip} label={chip} active={i < 3} />
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 09 Cards ──────────────────────────────────────────────── */}
      <Section id="cards" n="09" title="Cards">
        <DocCard title="Executive KPI stat card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <MiniStatCard label="Total cloud spend" value="$42,310" trend="↓ 10.2%" trendGood />
            <MiniStatCard label="Blocked requests" value="1,284" trend="↑ 8.6%" trendGood={false} />
            <MiniStatCard label="Active rules" value="18" badge={<StatusBadge label="Healthy" severity="success" />} />
          </div>
        </DocCard>

        <DocCard title="Alert / event card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--dash-border)', borderRadius: 8, overflow: 'hidden' }}>
            {[
              { desc: 'SQL injection attempt blocked', sev: 'danger' as const, time: '2h ago' },
              { desc: 'Unusual traffic spike from single IP', sev: 'warning' as const, time: '5h ago' },
              { desc: 'Rate limit exceeded on /api/checkout', sev: 'warning' as const, time: '1d ago' },
            ].map((row, i, arr) => (
              <div key={row.desc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--dash-border-light)' : 'none', backgroundColor: 'var(--dash-bg-surface)' }}>
                <span style={{ fontSize: 14, color: 'var(--dash-text-primary)', flex: 1, marginRight: 16 }}>{row.desc}</span>
                <StatusBadge label={row.sev === 'danger' ? 'Critical' : 'Warning'} severity={row.sev} />
                <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginLeft: 16, whiteSpace: 'nowrap' }}>{row.time}</span>
              </div>
            ))}
          </div>
        </DocCard>

        <DocCard title="Comparison / provider card">
          <div style={{ display: 'flex', gap: 16 }}>
            {(['aws', 'azure'] as const).map((v) => (
              <div key={v} style={{ flex: 1, padding: 20, border: '1px solid var(--dash-border)', borderRadius: 12, backgroundColor: 'var(--dash-bg-surface)' }}>
                <CloudBadge variant={v} />
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginTop: 10, marginBottom: 2 }}>
                  {v === 'aws' ? 'Amazon Web Services' : 'Microsoft Azure'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>
                  {v === 'aws' ? 'Cost Explorer + billing data' : 'Cost Management + WAF data'}
                </div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 10 Status & Badges ────────────────────────────────────── */}
      <Section id="badges" n="10" title="Status & Badges">
        <DocCard title="Semantic status badges">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <StatusBadge label="Healthy" severity="success" />
            <StatusBadge label="Connected" severity="success" />
            <StatusBadge label="On track" severity="success" />
            <StatusBadge label="Normal" severity="success" />
            <StatusBadge label="Elevated" severity="warning" />
            <StatusBadge label="Warning" severity="warning" />
            <StatusBadge label="Approaching limit" severity="warning" />
            <StatusBadge label="Critical" severity="danger" />
            <StatusBadge label="Blocked" severity="danger" />
            <StatusBadge label="1 critical" severity="danger" />
          </div>
        </DocCard>

        <DocCard title="Cloud provider badges">
          <div style={{ display: 'flex', gap: 10 }}>
            <CloudBadge variant="aws" />
            <CloudBadge variant="azure" />
          </div>
        </DocCard>

        <DocCard title="Semantic color reference">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { name: 'Success', bg: 'var(--dash-success-tint)', text: 'var(--dash-success-text)', dot: 'var(--dash-success)', label: '● Healthy / Cost decreased / Under budget' },
              { name: 'Warning', bg: 'var(--dash-warning-tint)', text: 'var(--dash-warning-text)', dot: 'var(--dash-warning)', label: '● Elevated / Approaching threshold' },
              { name: 'Danger',  bg: 'var(--dash-danger-tint)',  text: 'var(--dash-danger-text)',  dot: 'var(--dash-danger)',  label: '● Critical / Over budget / Attack' },
            ].map((s) => (
              <div key={s.name} style={{ padding: 14, backgroundColor: s.bg, borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: s.text, lineHeight: 1.5, opacity: 0.85 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 11 Tables ─────────────────────────────────────────────── */}
      <Section id="tables" n="11" title="Tables">
        <DocCard title="Standard table" noPad>
          <MiniTable
            headers={['Service', 'Cloud', 'Monthly cost', 'Trend']}
            rows={[
              ['EC2', 'AWS', '$12,450', '↑ 8.2%'],
              ['Azure VM', 'Azure', '$7,340', '↓ 3.1%'],
              ['RDS', 'AWS', '$6,820', '↑ 12.4%'],
            ]}
          />
        </DocCard>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DocCard title="Desktop — full table">
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.6 }}>All columns. Hover rows highlight with <code style={{ fontFamily: MONO, fontSize: 11 }}>--dash-bg-page</code>. Header labels uppercase 11px + tracking. Sortable columns show a chevron.</div>
          </DocCard>
          <DocCard title="Tablet — compact (3 cols)">
            <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.6 }}>Drop least-critical column. Cloud badge moves inline next to service name. Column count ≤ 3 for readability at 768px.</div>
          </DocCard>
        </div>
        <DocCard title="Mobile — stacked card list">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 343 }}>
            {[['EC2', 'AWS', '$12,450', '↑ 8.2%'], ['Azure VM', 'Azure', '$7,340', '↓ 3.1%']].map(([name, cloud, cost, trend]) => (
              <div key={name} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{name}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CloudBadge variant={cloud === 'AWS' ? 'aws' : 'azure'} />
                  <span style={{ fontSize: 12, color: trend.startsWith('↓') ? 'var(--dash-success)' : 'var(--dash-danger)', fontWeight: 500 }}>{trend}</span>
                </div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 12 Navigation ─────────────────────────────────────────── */}
      <Section id="navigation" n="12" title="Navigation">
        <DocCard title="Secondary tab bar">
          <div style={{ display: 'inline-flex', borderBottom: '1px solid var(--dash-border)', marginBottom: 16 }}>
            {['Overview', 'AWS', 'Azure'].map((t, i) => (
              <div key={t} style={{
                padding: '0 20px', height: 44, display: 'flex', alignItems: 'flex-end', paddingBottom: 1,
                borderBottom: i === 0 ? '2px solid var(--dash-accent)' : '2px solid transparent',
                fontSize: 14, fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                cursor: 'pointer',
              }}>{t}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>Active tab: accent color + 2px accent underline. Height: 48px. Overflow-x: auto on mobile.</div>
        </DocCard>

        <DocCard title="Breadcrumb">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <span style={{ color: 'var(--dash-text-muted)' }}>Home</span>
            <ChevronRight size={14} color="var(--dash-text-muted)" />
            <span style={{ color: 'var(--dash-text-muted)' }}>Cost</span>
            <ChevronRight size={14} color="var(--dash-text-muted)" />
            <span style={{ color: 'var(--dash-text-primary)', fontWeight: 500 }}>Monthly breakdown</span>
          </div>
        </DocCard>

        <DocCard title="Segmented control">
          <SegControl options={['Combined', 'AWS only', 'Azure only']} />
        </DocCard>

        <DocCard title="Pill date selector">
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 9999,
            border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)',
            color: 'var(--dash-text-primary)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            <Calendar size={14} color="var(--dash-text-secondary)" />
            This month
            <ChevronDown size={13} color="var(--dash-text-secondary)" />
          </button>
        </DocCard>
      </Section>

      {/* ── 13 Feedback ───────────────────────────────────────────── */}
      <Section id="feedback" n="13" title="Feedback">
        <DocCard title="Toast notifications">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
            {[
              { sev: 'success', icon: <CheckCircle2 size={16} />, msg: 'AWS account connected successfully.' },
              { sev: 'warning', icon: <AlertTriangle size={16} />, msg: 'Spend is approaching your monthly budget.' },
              { sev: 'danger',  icon: <AlertCircle size={16} />, msg: 'SQL injection attempt blocked — review logs.' },
              { sev: 'info',    icon: <Info size={16} />,         msg: 'Data syncs every 15 minutes from Cost Explorer.' },
            ].map((t) => {
              const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
                success: { bg: 'var(--dash-success-tint)', border: 'var(--dash-success)', text: 'var(--dash-success-text)', icon: 'var(--dash-success)' },
                warning: { bg: 'var(--dash-warning-tint)', border: 'var(--dash-warning)', text: 'var(--dash-warning-text)', icon: 'var(--dash-warning)' },
                danger:  { bg: 'var(--dash-danger-tint)',  border: 'var(--dash-danger)',  text: 'var(--dash-danger-text)',  icon: 'var(--dash-danger)'  },
                info:    { bg: 'var(--dash-accent-tint)',  border: 'var(--dash-accent)',  text: 'var(--dash-accent)',       icon: 'var(--dash-accent)'  },
              };
              const c = colors[t.sev];
              return (
                <div key={t.sev} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: 8 }}>
                  <span style={{ color: c.icon, marginTop: 1 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>{t.msg}</span>
                </div>
              );
            })}
          </div>
        </DocCard>

        <DocCard title="Empty states">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { icon: <Cloud size={28} />, title: 'No cloud connected', desc: 'Connect AWS or Azure to start seeing data.' },
              { icon: <Shield size={28} />, title: 'No security alerts', desc: 'Your WAF is active and all rules are healthy.' },
            ].map((e) => (
              <div key={e.title} style={{ padding: 32, textAlign: 'center', backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px dashed var(--dash-border)' }}>
                <div style={{ color: 'var(--dash-text-muted)', marginBottom: 10 }}>{e.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </DocCard>

        <DocCard title="Loading skeleton">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 20, width: '60%', backgroundColor: 'var(--dash-border-light)', borderRadius: 4, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 40, width: '100%', backgroundColor: 'var(--dash-border-light)', borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ height: 80, flex: 1, backgroundColor: 'var(--dash-border-light)', borderRadius: 8 }} />
              <div style={{ height: 80, flex: 1, backgroundColor: 'var(--dash-border-light)', borderRadius: 8 }} />
              <div style={{ height: 80, flex: 1, backgroundColor: 'var(--dash-border-light)', borderRadius: 8 }} />
            </div>
          </div>
        </DocCard>
      </Section>

      {/* ── 14 Motion ─────────────────────────────────────────────── */}
      <Section id="motion" n="14" title="Motion">
        <DocCard title="Timing tokens — ease-in-out throughout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              ['Hover state',   '150ms', 'Button / card border transitions'],
              ['Click / press', '100ms', 'Button press, toggle activation'],
              ['Drawer / panel','300ms', 'Right-side slide-over panel'],
              ['Modal',         '250ms', 'Dialog appear / disappear'],
              ['Progress bar',  '400ms', 'Onboarding progress fill'],
              ['Chart tooltip', '100ms', 'Recharts cursor crosshair'],
            ].map(([name, dur, desc]) => (
              <div key={name} style={{ display: 'flex', gap: 14, padding: '12px 16px', backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
                <code style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-accent)', fontFamily: MONO, width: 50, flexShrink: 0 }}>{dur}</code>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

      {/* ── 15 Responsive Rules ───────────────────────────────────── */}
      <Section id="responsive" n="15" title="Responsive Rules">
        <DocCard title="Breakpoints">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
                  {['Breakpoint', 'Width', 'Navigation', 'Stat cards', 'Charts', 'Tables'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Desktop', '≥ 1024px',  'Fixed sidebar 240px', '4 in a row',   'Full height', 'Full columns'],
                  ['Tablet',  '640–1023px', 'Icon-only sidebar 64px', '2×2 grid', 'Full width, stacked', 'Compact (3 cols)'],
                  ['Mobile',  '< 640px',   'Fixed bottom tab bar', '2×2 grid',  'Reduced height', 'Stacked card list'],
                ].map((row) => (
                  <tr key={row[0]} style={{ borderBottom: '1px solid var(--dash-border-light)' }}>
                    {row.map((cell, i) => (
                      <td key={i} style={{ padding: '10px 12px', color: i === 0 ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)', fontWeight: i === 0 ? 500 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocCard>

        <DocCard title="Component adaptation rules">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { cat: 'Cards', desktop: '4-column grid, 20px gap', tablet: '2×2 grid, 20px gap', mobile: '2×2 grid, 12px gap' },
              { cat: 'Charts', desktop: 'Full height (220px)', tablet: 'Full width, stacked', mobile: 'Reduced height (180px)' },
              { cat: 'Tables', desktop: 'All columns visible', tablet: 'Compact — 3 columns max', mobile: 'Stacked card list, 44px min touch' },
            ].map((r) => (
              <div key={r.cat} style={{ padding: 16, backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 10 }}>{r.cat}</div>
                {(['desktop', 'tablet', 'mobile'] as const).map((bp) => (
                  <div key={bp} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 50, flexShrink: 0, paddingTop: 1 }}>{bp}</span>
                    <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.4 }}>{r[bp]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DocCard>
      </Section>

    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function ColorRow({ swatches }: { swatches: { label: string; var: string; hex: string; dark?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {swatches.map((s) => (
        <div key={s.var} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            width: 96, height: 56,
            backgroundColor: s.hex,
            borderRadius: 8,
            border: '1px solid var(--dash-border)',
          }} />
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{s.label}</div>
          <code style={{ fontSize: 10, color: 'var(--dash-accent)', fontFamily: MONO }}>{s.var}</code>
          <code style={{ fontSize: 10, color: 'var(--dash-text-muted)', fontFamily: MONO }}>{s.hex}</code>
        </div>
      ))}
    </div>
  );
}

function IconGrid({ icons, size }: { icons: [string, React.ElementType][]; size: number }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {icons.map(([name, Icon]) => (
        <div key={name} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          padding: '10px 12px', backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)',
          width: 72,
        }}>
          <Icon size={size} color="var(--dash-text-secondary)" strokeWidth={1.5} />
          <span style={{ fontSize: 9, color: 'var(--dash-text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'icon';
type BtnSize = 'sm' | 'md' | 'lg';

function Btn({ variant, size = 'md', disabled, loading, children }: {
  variant: BtnVariant; size?: BtnSize; disabled?: boolean; loading?: boolean; children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false);

  const heights: Record<BtnSize, number> = { sm: 28, md: 36, lg: 44 };
  const pads: Record<BtnSize, string> = { sm: '0 10px', md: '0 16px', lg: '0 20px' };
  const fonts: Record<BtnSize, number> = { sm: 12, md: 14, lg: 14 };

  const base: React.CSSProperties = {
    height: heights[size], padding: pads[size], fontSize: fonts[size], fontWeight: 500,
    borderRadius: 'var(--dash-radius-button)', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
    fontFamily: 'var(--dash-font)', opacity: disabled ? 0.4 : 1,
    whiteSpace: 'nowrap',
  };

  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary:   { ...base, backgroundColor: hovered && !disabled ? '#2F4DC4' : 'var(--dash-accent)', color: '#FFFFFF' },
    secondary: { ...base, backgroundColor: hovered && !disabled ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)', color: 'var(--dash-accent)', border: '1px solid var(--dash-accent)' },
    ghost:     { ...base, backgroundColor: hovered && !disabled ? 'var(--dash-bg-page)' : 'transparent', color: 'var(--dash-text-secondary)' },
    danger:    { ...base, backgroundColor: hovered && !disabled ? '#9A3A33' : 'var(--dash-danger)', color: '#FFFFFF' },
    outline:   { ...base, backgroundColor: 'transparent', color: 'var(--dash-text-primary)', border: '1px solid var(--dash-border)' },
    icon:      { ...base, width: heights[size], padding: '0', backgroundColor: hovered && !disabled ? 'var(--dash-bg-page)' : 'transparent', border: '1px solid var(--dash-border)', color: 'var(--dash-text-secondary)' },
  };

  return (
    <button
      style={styles[variant]}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : children}
    </button>
  );
}

function InputField({ label, placeholder, value, error, disabled }: { label: string; placeholder?: string; value?: string; error?: string; disabled?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{label}</label>
      <input
        readOnly
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          height: 36, padding: '0 12px', fontSize: 14, fontFamily: 'var(--dash-font)',
          borderRadius: 'var(--dash-radius-button)', border: `1px solid ${error ? 'var(--dash-danger)' : 'var(--dash-border)'}`,
          backgroundColor: disabled ? 'var(--dash-bg-page)' : 'var(--dash-bg-surface)',
          color: 'var(--dash-text-primary)', outline: 'none', opacity: disabled ? 0.6 : 1,
        }}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--dash-danger)', fontFamily: 'var(--dash-font)' }}>{error}</span>}
    </div>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <Search size={14} color="var(--dash-text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
      <input
        readOnly
        placeholder={placeholder}
        style={{
          width: '100%', height: 36, padding: '0 12px 0 32px', fontSize: 14,
          fontFamily: 'var(--dash-font)', borderRadius: 'var(--dash-radius-button)',
          border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)',
          color: 'var(--dash-text-primary)', outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function SelectInput({ label, options }: { label: string; options: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'var(--dash-font)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select style={{
          appearance: 'none', width: '100%', height: 36, padding: '0 32px 0 12px',
          fontSize: 14, fontFamily: 'var(--dash-font)',
          borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)',
          backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', cursor: 'pointer',
        }}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} color="var(--dash-text-muted)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function ToggleItem({ label, on }: { label: string; on: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActive(!active)}>
      <div style={{
        width: 36, height: 20, borderRadius: 999,
        backgroundColor: active ? 'var(--dash-accent)' : 'var(--dash-border)',
        position: 'relative', transition: 'background-color 0.15s ease',
        flexShrink: 0,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FFFFFF',
          position: 'absolute', top: 3, left: active ? 19 : 3, transition: 'left 0.15s ease',
        }} />
      </div>
      <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', userSelect: 'none' }}>{label}</span>
    </div>
  );
}

function CheckboxItem({ label, checked }: { label: string; checked: boolean }) {
  const [state, setState] = useState(checked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setState(!state)}>
      <div style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        backgroundColor: state ? 'var(--dash-accent)' : 'var(--dash-bg-surface)',
        border: `1.5px solid ${state ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s ease',
      }}>
        {state && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', userSelect: 'none' }}>{label}</span>
    </div>
  );
}

function RadioItem({ label, selected }: { label: string; selected: boolean }) {
  const [on, setOn] = useState(selected);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setOn(!on)}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${on ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {on && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--dash-accent)' }} />}
      </div>
      <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', userSelect: 'none' }}>{label}</span>
    </div>
  );
}

function FilterChip({ label, active }: { label: string; active: boolean }) {
  const [on, setOn] = useState(active);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
        backgroundColor: on ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)',
        color: on ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
        border: `1px solid ${on ? 'var(--dash-accent)' : 'var(--dash-border)'}`,
        fontFamily: 'var(--dash-font)',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        transition: 'all 0.12s ease',
      }}
    >
      {on && <X size={11} />}
      {label}
    </button>
  );
}

function MiniStatCard({ label, value, trend, trendGood, badge }: {
  label: string; value: string; trend?: string; trendGood?: boolean; badge?: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>{value}</div>
      {trend && (
        <div style={{ fontSize: 12, fontWeight: 500, color: trendGood ? 'var(--dash-success)' : 'var(--dash-danger)' }}>{trend} vs last month</div>
      )}
      {badge && badge}
    </div>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
          {headers.map((h) => (
            <th key={h} style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--dash-border-light)' : 'none' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '10px 20px', color: 'var(--dash-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SegControl({ options }: { options: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ display: 'inline-flex', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 999, padding: 3, gap: 2 }}>
      {options.map((o, i) => (
        <button
          key={o}
          onClick={() => setActive(i)}
          style={{
            padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: active === i ? 500 : 400,
            backgroundColor: active === i ? 'var(--dash-bg-surface)' : 'transparent',
            border: active === i ? '1px solid var(--dash-border)' : '1px solid transparent',
            color: active === i ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--dash-font)', whiteSpace: 'nowrap',
            transition: 'all 0.12s ease',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
