import { useState, useEffect } from 'react';
import { Sparkles, Cloud, CheckCircle2, ChevronRight, ArrowLeft, Loader2, Server, BarChart2, Shield, Globe } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface OnboardingPageProps {
  onComplete: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { id: 0, label: 'Welcome',           short: 'Welcome'    },
  { id: 1, label: 'Connect AWS',       short: 'AWS'        },
  { id: 2, label: 'Connect Azure',     short: 'Azure'      },
  { id: 3, label: 'Discover Resources', short: 'Discover'  },
  { id: 4, label: 'AI Analysis',       short: 'AI'         },
  { id: 5, label: 'Ready',             short: 'Ready'      },
];

const FEATURES = [
  { icon: BarChart2, label: 'Cost Analytics',    desc: 'Real-time AWS + Azure cost tracking' },
  { icon: Shield,    label: 'Security Monitoring', desc: 'WAF alerts and vulnerability detection' },
  { icon: Sparkles,  label: 'AI Insights',       desc: 'Intelligent recommendations and forecasts' },
  { icon: Server,    label: 'Resource Inventory', desc: 'Complete cloud resource management'   },
];

const PROGRESS_LABELS: Record<number, { title: string; desc: string; stages: string[] }> = {
  3: {
    title: 'Discovering your cloud resources',
    desc: 'CloudCEO is scanning your AWS and Azure environments…',
    stages: ['Scanning EC2 instances…', 'Loading RDS databases…', 'Discovering Azure VMs…', 'Indexing storage buckets…', 'Mapping network resources…', 'Resource inventory complete!'],
  },
  4: {
    title: 'Running AI analysis',
    desc: 'CloudCEO AI is learning your cloud environment…',
    stages: ['Analysing cost patterns…', 'Detecting security risks…', 'Identifying savings opportunities…', 'Generating performance insights…', 'Building health report…', 'AI analysis complete!'],
  },
};

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep]               = useState<Step>(0);
  const [awsConnected, setAwsConnected] = useState(false);
  const [azureConnected, setAzureConnected] = useState(false);
  const [awsForm, setAwsForm]         = useState({ accountId: '', roleArn: '' });
  const [azureForm, setAzureForm]     = useState({ subscriptionId: '', tenantId: '' });
  const [progress, setProgress]       = useState(0);
  const [stageLabel, setStageLabel]   = useState('');
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';

  // Auto-progress for discovery / AI steps
  useEffect(() => {
    if (step !== 3 && step !== 4) return;
    setProgress(0);
    const labels = PROGRESS_LABELS[step]?.stages ?? [];
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setProgress((i / labels.length) * 100);
      setStageLabel(labels[i - 1] ?? '');
      if (i >= labels.length) {
        clearInterval(iv);
        setTimeout(() => setStep(s => (s + 1) as Step), 600);
      }
    }, 700);
    return () => clearInterval(iv);
  }, [step]);

  const canProceed = step === 0 ||
    (step === 1 && (awsConnected || true)) || // allow skip
    (step === 2 && (azureConnected || true)) || // allow skip
    step === 5;

  const handleConnect = (provider: 'aws' | 'azure') => {
    if (provider === 'aws') setAwsConnected(true);
    else setAzureConnected(true);
    setStep(s => (s + 1) as Step);
  };

  const total = STEPS.length;
  const pct   = ((step) / (total - 1)) * 100;

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--dash-bg-page)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '24px 16px' : '40px 24px',
      fontFamily: 'var(--dash-font)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, backgroundColor: 'var(--dash-accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="17" height="17" viewBox="0 0 15 15" fill="none"><path d="M2 12L7.5 3L13 12H2Z" fill="white" /></svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--dash-text-primary)', letterSpacing: '-0.01em' }}>CloudCEO</span>
        <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 2 }}>Cloud Management Platform</span>
      </div>

      {/* Progress bar */}
      {step > 0 && step < 5 && (
        <div style={{ width: '100%', maxWidth: 520, marginBottom: 24 }}>
          {/* Step dots */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: i < step ? 'var(--dash-success)' : i === step ? 'var(--dash-accent)' : 'var(--dash-border)', transition: 'background-color 0.3s ease', flexShrink: 0 }}>
                  {i < step ? <CheckCircle2 size={12} color="#FFFFFF" strokeWidth={2.5} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === step ? '#FFFFFF' : 'var(--dash-text-muted)' }} />}
                </div>
                {!isMobile && <span style={{ fontSize: 9, fontWeight: 500, color: i === step ? 'var(--dash-accent)' : i < step ? 'var(--dash-success)' : 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.short}</span>}
              </div>
            ))}
          </div>
          <div style={{ height: 3, backgroundColor: 'var(--dash-border)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--dash-accent)', borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginTop: 6, textAlign: 'right' }}>Step {step} of {total - 1}</div>
        </div>
      )}

      {/* Step content */}
      <div style={{ width: '100%', maxWidth: 520, backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 16, padding: isMobile ? 24 : 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles size={30} color="var(--dash-accent)" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 8 }}>Welcome to CloudCEO</div>
            <div style={{ fontSize: 14, color: 'var(--dash-text-secondary)', lineHeight: 1.7, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
              Your enterprise cloud management platform. Connect your AWS and Azure accounts to get started with intelligent cost analytics, security monitoring, and AI-powered insights.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28, textAlign: 'left' }}>
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', backgroundColor: 'var(--dash-bg-page)', borderRadius: 10, border: '1px solid var(--dash-border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color="var(--dash-accent)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <PrimaryButton onClick={() => setStep(1)}>Get started <ChevronRight size={15} /></PrimaryButton>
            <div style={{ marginTop: 12 }}>
              <button onClick={onComplete} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--dash-text-muted)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
                Skip — explore with sample data
              </button>
            </div>
          </div>
        )}

        {/* Step 1 — Connect AWS */}
        {step === 1 && (
          <div>
            <ProviderHeader icon="aws" title="Connect Amazon Web Services" desc="Grant read-only access to Cost Explorer, billing data, and WAF security events." />
            <FormField label="AWS Account ID" value={awsForm.accountId} onChange={v => setAwsForm(f => ({ ...f, accountId: v }))} placeholder="123456789012" hint="12-digit AWS account identifier" />
            <FormField label="IAM Role ARN" value={awsForm.roleArn} onChange={v => setAwsForm(f => ({ ...f, roleArn: v }))} placeholder="arn:aws:iam::123456789012:role/CloudCEORole" hint="Role with read-only access to Cost Explorer and WAF" />
            <div style={{ backgroundColor: 'var(--dash-accent-tint)', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 12, color: 'var(--dash-accent)', lineHeight: 1.6 }}>
              <strong>Quick setup:</strong> CloudCEO only requires read-only access. Your data is never modified. View our{' '}
              <button style={{ background: 'none', border: 'none', color: 'var(--dash-accent)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--dash-font)', padding: 0, textDecoration: 'underline' }}>IAM setup guide</button>.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryButton onClick={() => setStep(0)}><ArrowLeft size={14} /> Back</SecondaryButton>
              <PrimaryButton onClick={() => handleConnect('aws')} style={{ flex: 1 }}>Connect AWS <ChevronRight size={15} /></PrimaryButton>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--dash-text-muted)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>Skip — connect later</button>
            </div>
          </div>
        )}

        {/* Step 2 — Connect Azure */}
        {step === 2 && (
          <div>
            <ProviderHeader icon="azure" title="Connect Microsoft Azure" desc="Grant read-only access to Cost Management, resource inventory, and WAF data." />
            <FormField label="Azure Subscription ID" value={azureForm.subscriptionId} onChange={v => setAzureForm(f => ({ ...f, subscriptionId: v }))} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" hint="Found in Azure Portal → Subscriptions" />
            <FormField label="Azure Tenant ID" value={azureForm.tenantId} onChange={v => setAzureForm(f => ({ ...f, tenantId: v }))} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" hint="Found in Azure Active Directory → Properties" />
            <div style={{ backgroundColor: 'var(--dash-warning-tint)', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 12, color: 'var(--dash-warning-text)', lineHeight: 1.6 }}>
              <strong>Note:</strong> Ensure the CloudCEO service principal has the <strong>Cost Management Reader</strong> and <strong>Reader</strong> roles assigned.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryButton onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</SecondaryButton>
              <PrimaryButton onClick={() => handleConnect('azure')} style={{ flex: 1 }}>Connect Azure <ChevronRight size={15} /></PrimaryButton>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--dash-text-muted)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>Skip — connect later</button>
            </div>
          </div>
        )}

        {/* Steps 3 & 4 — Automated progress */}
        {(step === 3 || step === 4) && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {step === 3 ? <Server size={28} color="var(--dash-accent)" strokeWidth={1.5} /> : <Sparkles size={28} color="var(--dash-accent)" strokeWidth={1.5} />}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 8 }}>{PROGRESS_LABELS[step]?.title}</div>
            <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>{PROGRESS_LABELS[step]?.desc}</div>

            {/* Progress bar */}
            <div style={{ backgroundColor: 'var(--dash-border-light)', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--dash-accent)', borderRadius: 999, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginBottom: 20, height: 18 }}>{stageLabel}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: 'var(--dash-text-secondary)' }}>
              <Loader2 size={14} color="var(--dash-accent)" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              {Math.round(progress)}% complete
            </div>
          </div>
        )}

        {/* Step 5 — Ready! */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--dash-success-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '3px solid var(--dash-success)' }}>
              <CheckCircle2 size={36} color="var(--dash-success)" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 8 }}>Your dashboard is ready!</div>
            <div style={{ fontSize: 14, color: 'var(--dash-text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              CloudCEO has analysed your cloud environment and generated your first executive summary.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
              {[
                { value: '12', label: 'Resources found' },
                { value: '5',  label: 'AI insights'     },
                { value: '78', label: 'Health score'    },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', borderRadius: 10, border: '1px solid var(--dash-border)', padding: '14px 10px' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-accent)', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--dash-text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <PrimaryButton onClick={onComplete}>View my dashboard <ChevronRight size={15} /></PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shared wizard primitives ───────────────────────────────────── */
function PrimaryButton({ onClick, children, style = {} }: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 24px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--dash-font)', width: '100%', minHeight: 44, transition: 'background-color 0.15s ease', ...style }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2F4DC4'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-accent)'; }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '10px 16px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', minHeight: 44, flexShrink: 0, transition: 'border-color 0.12s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}
    >
      {children}
    </button>
  );
}

function FormField({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 5, fontFamily: 'var(--dash-font)' }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', height: 38, padding: '0 12px', fontSize: 13, fontFamily: 'ui-monospace, "Cascadia Code", monospace', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)', color: 'var(--dash-text-primary)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease' }}
        onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-accent)'; }}
        onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 4, fontFamily: 'var(--dash-font)' }}>{hint}</div>}
    </div>
  );
}

function ProviderHeader({ icon, title, desc }: { icon: 'aws' | 'azure'; title: string; desc: string }) {
  const isAws = icon === 'aws';
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 24, padding: '14px 16px', backgroundColor: isAws ? 'var(--dash-success-tint)' : 'var(--dash-warning-tint)', borderRadius: 10, border: `1px solid ${isAws ? 'var(--dash-success)' : 'var(--dash-warning)'}25` }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Cloud size={20} color={isAws ? 'var(--dash-success)' : 'var(--dash-warning)'} strokeWidth={1.5} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 4, fontFamily: 'var(--dash-font)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)', lineHeight: 1.55, fontFamily: 'var(--dash-font)' }}>{desc}</div>
      </div>
    </div>
  );
}
