import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { CloudBadge } from './CloudBadge';
import { StatusBadge } from './StatusBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

export interface EmptyStateHomeProps {
  awsConnected: boolean;
  azureConnected: boolean;
  onConnectAws: () => void;
  onConnectAzure: () => void;
  onSkip: () => void;
}

export function EmptyStateHome(props: EmptyStateHomeProps) {
  const bp = useBreakpoint();
  if (bp === 'mobile') return <EmptyStateMobile {...props} />;
  return <EmptyStateDesktop {...props} />;
}

/* ─── Desktop (1440px) ──────────────────────────────────────────── */

function EmptyStateDesktop({
  awsConnected,
  azureConnected,
  onConnectAws,
  onConnectAzure,
  onSkip,
}: EmptyStateHomeProps) {
  const connectedCount = (awsConnected ? 1 : 0) + (azureConnected ? 1 : 0);
  const isPartial = connectedCount > 0 && connectedCount < 2;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)',
        padding: '48px 0',
        fontFamily: 'var(--dash-font)',
      }}
    >
      {/* ONE outer card */}
      <div
        style={{
          width: 760,
          maxWidth: '100%',
          backgroundColor: 'var(--dash-bg-surface)',
          border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius-card)',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--dash-accent-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--dash-space-2xl)',
            flexShrink: 0,
          }}
        >
          <Link2 size={32} color="var(--dash-text-muted)" strokeWidth={1.5} />
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--dash-text-primary)',
            lineHeight: 1.3,
            marginBottom: 'var(--dash-space-md)',
            fontFamily: 'var(--dash-font)',
          }}
        >
          Connect your cloud accounts to get started
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 14,
            color: 'var(--dash-text-secondary)',
            maxWidth: 420,
            lineHeight: 1.65,
            marginBottom: 'var(--dash-space-3xl)',
            fontFamily: 'var(--dash-font)',
          }}
        >
          CloudCEO needs read access to your AWS and Azure billing and security
          data. This typically takes about 5 minutes per provider.
        </div>

        {/* Divider — spans inner content width */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'var(--dash-border)',
            marginBottom: 'var(--dash-space-3xl)',
          }}
        />

        {/* Progress bar — partial state only */}
        {isPartial && (
          <div style={{ width: 580, marginBottom: 'var(--dash-space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 'var(--dash-space-xs)' }}>
              <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>
                {connectedCount} of 2 connected
              </span>
            </div>
            <div
              style={{
                height: 4,
                backgroundColor: 'var(--dash-border)',
                borderRadius: 'var(--dash-radius-pill)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(connectedCount / 2) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--dash-accent)',
                  borderRadius: 'var(--dash-radius-pill)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Two inner provider boxes — side by side on desktop */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--dash-space-xl)',
            marginBottom: 'var(--dash-space-2xl)',
          }}
        >
          <ProviderBox
            variant="aws"
            name="Amazon Web Services"
            description="Cost Explorer + billing data"
            connected={awsConnected}
            onConnect={onConnectAws}
            onViewData={onSkip}
            width={280}
            padding={24}
          />
          <ProviderBox
            variant="azure"
            name="Microsoft Azure"
            description="Cost Management + WAF data"
            connected={azureConnected}
            onConnect={onConnectAzure}
            onViewData={onSkip}
            width={280}
            padding={24}
          />
        </div>

        {/* Skip link */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 13,
            color: 'var(--dash-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--dash-font)',
            lineHeight: 1.5,
          }}
        >
          Skip for now and explore with sample data
        </button>
      </div>
    </div>
  );
}

/* ─── Mobile (375px) ────────────────────────────────────────────── */

function EmptyStateMobile({
  awsConnected,
  azureConnected,
  onConnectAws,
  onConnectAzure,
  onSkip,
}: EmptyStateHomeProps) {
  const connectedCount = (awsConnected ? 1 : 0) + (azureConnected ? 1 : 0);
  const isPartial = connectedCount > 0 && connectedCount < 2;

  return (
    <div
      style={{
        paddingTop: 'var(--dash-space-2xl)',
        paddingBottom: 'var(--dash-space-2xl)',
        fontFamily: 'var(--dash-font)',
      }}
    >
      {/* ONE outer card — full width within 16px container padding */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--dash-bg-surface)',
          border: '1px solid var(--dash-border)',
          borderRadius: 'var(--dash-radius-card)',
          padding: 'var(--dash-space-2xl)', /* 24px */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* 1 — Icon circle (64px, 28px icon) */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--dash-accent-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--dash-space-lg)', /* 16px */
            flexShrink: 0,
          }}
        >
          <Link2 size={28} color="var(--dash-text-muted)" strokeWidth={1.5} />
        </div>

        {/* 2 — Headline 18px */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--dash-text-primary)',
            lineHeight: 1.3,
            marginBottom: 'var(--dash-space-sm)', /* 8px */
            fontFamily: 'var(--dash-font)',
          }}
        >
          Connect your cloud accounts to get started
        </div>

        {/* 3 — Subtext 13px, no max-width — wraps naturally at card width */}
        <div
          style={{
            fontSize: 13,
            color: 'var(--dash-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--dash-space-2xl)', /* 24px */
            fontFamily: 'var(--dash-font)',
          }}
        >
          CloudCEO needs read access to your AWS and Azure billing and security
          data. This typically takes about 5 minutes per provider.
        </div>

        {/* 4 — Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'var(--dash-border)',
            marginBottom: 'var(--dash-space-2xl)', /* 24px */
          }}
        />

        {/* Progress bar — partial state */}
        {isPartial && (
          <div style={{ width: '100%', marginBottom: 'var(--dash-space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 'var(--dash-space-xs)' }}>
              <span style={{ fontSize: 12, color: 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)' }}>
                {connectedCount} of 2 connected
              </span>
            </div>
            <div
              style={{
                height: 4,
                backgroundColor: 'var(--dash-border)',
                borderRadius: 'var(--dash-radius-pill)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(connectedCount / 2) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--dash-accent)',
                  borderRadius: 'var(--dash-radius-pill)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* 5 — Provider boxes STACKED VERTICALLY — full width, 16px gap */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--dash-space-lg)', /* 16px */
            width: '100%',
            marginBottom: 'var(--dash-space-xl)', /* 20px */
          }}
        >
          <ProviderBox
            variant="aws"
            name="Amazon Web Services"
            description="Cost Explorer + billing data"
            connected={awsConnected}
            onConnect={onConnectAws}
            onViewData={onSkip}
            width="100%"
            padding={20}
          />
          <ProviderBox
            variant="azure"
            name="Microsoft Azure"
            description="Cost Management + WAF data"
            connected={azureConnected}
            onConnect={onConnectAzure}
            onViewData={onSkip}
            width="100%"
            padding={20}
          />
        </div>

        {/* 6 — Skip link 12px */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 12,
            color: 'var(--dash-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--dash-font)',
            lineHeight: 1.5,
          }}
        >
          Skip for now and explore with sample data
        </button>
      </div>
    </div>
  );
}

/* ─── Shared provider box (width + padding driven by caller) ──── */

interface ProviderBoxProps {
  variant: 'aws' | 'azure';
  name: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
  onViewData: () => void;
  width: number | string;
  padding: number;
}

function ProviderBox({
  variant,
  name,
  description,
  connected,
  onConnect,
  onViewData,
  width,
  padding,
}: ProviderBoxProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width,
        border: '1px solid var(--dash-border)',
        borderRadius: 'var(--dash-radius-card)',
        padding,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        position: 'relative',
        backgroundColor: 'var(--dash-bg-surface)',
        boxSizing: 'border-box',
      }}
    >
      {/* Connected badge — top-right */}
      {connected && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <StatusBadge label="Connected" severity="success" />
        </div>
      )}

      {/* Cloud badge */}
      <div style={{ marginBottom: 'var(--dash-space-sm)' }}>
        <CloudBadge variant={variant} />
      </div>

      {/* Provider name */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--dash-text-primary)',
          marginBottom: 'var(--dash-space-xs)',
          lineHeight: 1.4,
          fontFamily: 'var(--dash-font)',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 12,
          color: 'var(--dash-text-secondary)',
          lineHeight: 1.55,
          marginBottom: 'var(--dash-space-xl)', /* 20px */
          fontFamily: 'var(--dash-font)',
        }}
      >
        {description}
      </div>

      {/* Action */}
      {connected ? (
        <button
          onClick={onViewData}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--dash-accent)',
            cursor: 'pointer',
            fontFamily: 'var(--dash-font)',
            minHeight: 'var(--dash-touch-target)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          View {variant === 'aws' ? 'AWS' : 'Azure'} data →
        </button>
      ) : (
        <button
          onClick={onConnect}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '100%',
            padding: '10px 0',
            backgroundColor: hovered ? '#2F4DC4' : 'var(--dash-accent)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--dash-radius-button)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.12s ease',
            fontFamily: 'var(--dash-font)',
            minHeight: 'var(--dash-touch-target)',
          }}
        >
          Connect {variant === 'aws' ? 'AWS' : 'Azure'}
        </button>
      )}
    </div>
  );
}
