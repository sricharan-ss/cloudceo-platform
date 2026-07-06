import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, RotateCcw, ChevronRight, TrendingUp, Shield,
  DollarSign, Activity, Copy, ThumbsUp, ThumbsDown, RefreshCw,
  FileText, Zap, MessageSquare, Clock, AlertTriangle, CheckCircle2,
  BarChart2, Cpu, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle,
} from 'lucide-react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { StatusBadge } from './StatusBadge';
import { CloudBadge } from './CloudBadge';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface AiWorkspacePageProps { breadcrumbs: BreadcrumbItem[] }

type UiState = 'idle' | 'thinking' | 'streaming' | 'done' | 'error';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

/* ── Sparkline helper ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1;
  const w = 72, h = 28;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── Pre-interaction dashboard data ── */
const OVERVIEW_METRICS = [
  { label: 'Cloud health score', value: '78', unit: '/100', trend: '+4 this week', up: true,  color: 'var(--dash-success)', values: [70,72,73,72,74,76,78] },
  { label: 'Est. monthly savings', value: '$1,712', unit: '', trend: 'Across 12 items', up: true, color: 'var(--dash-success)', values: [1100,1200,1300,1450,1580,1700,1712] },
  { label: 'Active critical risks', value: '2', unit: '', trend: '+1 since yesterday', up: false, color: 'var(--dash-danger)', values: [1,1,0,1,1,2,2] },
  { label: 'Predicted month-end', value: '$48,900', unit: '', trend: 'On track to budget', up: true, color: 'var(--dash-accent)', values: [44000,45200,46000,46800,47500,48200,48900] },
  { label: 'AI analysis status', value: 'Active', unit: '', trend: 'All providers', up: true, color: 'var(--dash-success)', values: [1,1,1,1,1,1,1] },
  { label: 'Last full analysis', value: '5 min', unit: ' ago', trend: 'Auto-refresh: 15m', up: true, color: 'var(--dash-text-muted)', values: [15,12,10,8,6,5,5] },
];

const SUGGESTED_QUESTIONS = [
  { icon: DollarSign,  text: 'Why did AWS costs increase 18% this week?',           category: 'Cost'      },
  { icon: Shield,      text: 'What are the top 3 security vulnerabilities?',         category: 'Security'  },
  { icon: TrendingUp,  text: 'Recommend ways to reduce EC2 spending.',               category: 'Cost'      },
  { icon: BarChart2,   text: 'Show me resource utilisation across both clouds.',     category: 'Usage'     },
  { icon: FileText,    text: 'Generate an executive cost summary for June 2026.',    category: 'Report'    },
];

const QUICK_ACTIONS = [
  { icon: FileText,     label: 'Generate cost report',    color: 'var(--dash-accent)'   },
  { icon: Shield,       label: 'Run security scan',       color: 'var(--dash-danger)'   },
  { icon: Zap,          label: 'Optimise resources',      color: 'var(--dash-success)'  },
  { icon: BarChart2,    label: 'Forecast next month',     color: 'var(--dash-warning)'  },
];

const RECENT_CONVOS = [
  { title: 'AWS cost spike analysis',        time: '2h ago',  preview: 'EC2 auto-scaling caused 31% increase…' },
  { title: 'Security incident review',       time: '5h ago',  preview: 'SQL injection attempt blocked on…'     },
  { title: 'Monthly executive summary',      time: '1d ago',  preview: 'Cloud spend at 84% of budget with…'   },
  { title: 'Azure WAF configuration audit',  time: '2d ago',  preview: 'Found 3 rules missing from DRS…'     },
];

const RECENT_REPORTS = [
  { title: 'Cloud Cost Analysis',   cloud: 'aws' as const,   date: 'Jun 28, 2026', pages: 12 },
  { title: 'Security Assessment',   cloud: 'azure' as const, date: 'Jun 27, 2026', pages: 8  },
  { title: 'Resource Utilisation',  cloud: 'aws' as const,   date: 'Jun 25, 2026', pages: 6  },
];

const AI_DISCOVERIES = [
  { icon: AlertTriangle, text: '3 idle EC2 instances consuming $847/mo',      sev: 'danger' as const },
  { icon: Shield,        text: 'Unusual login pattern from new geography',      sev: 'warning' as const },
  { icon: TrendingUp,    text: 'RDS overprovisioned — 40% right-sizing possible', sev: 'warning' as const },
];

/* ── AI Response data ── */
const AI_RESPONSE = {
  summary: 'AWS costs increased 18.2% this week (from $8,960 to $10,572). The primary driver is EC2 instance usage in us-east-1, triggered by an auto-scaling event at 14:23 UTC on Wednesday. Data transfer costs followed the compute spike.',
  findings: [
    { label: 'EC2 spend',       value: '+$1,142', direction: 'up',   color: 'var(--dash-danger)' },
    { label: 'Data transfer',   value: '+$340',   direction: 'up',   color: 'var(--dash-danger)' },
    { label: 'RDS',             value: 'Stable',  direction: 'flat', color: 'var(--dash-text-muted)' },
    { label: 'Lambda',          value: '+$48',    direction: 'up',   color: 'var(--dash-warning)' },
    { label: 'S3 storage',      value: '$84',     direction: 'flat', color: 'var(--dash-text-muted)' },
    { label: 'Savings available', value: '$847/mo', direction: 'down', color: 'var(--dash-success)' },
  ],
  recommendations: [
    { text: 'Review auto-scaling thresholds for the production cluster — trigger sensitivity appears too aggressive.',   confidence: 94, savings: '$420/mo',   effort: 'Low',   priority: 'High' },
    { text: 'Purchase Reserved Instances for baseline EC2 capacity to reduce on-demand pricing by up to 40%.',           confidence: 88, savings: '$340/mo',   effort: 'Medium', priority: 'High' },
    { text: 'Enable AWS Cost Anomaly Detection alerts so future spikes are flagged before end of billing period.',       confidence: 97, savings: undefined,   effort: 'Low',   priority: 'Medium' },
  ],
  resources: [
    { name: 'i-0abc12345', type: 'EC2 t3.large', cloud: 'aws' as const, cost: '$312/mo' },
    { name: 'i-0def67890', type: 'EC2 t3.large', cloud: 'aws' as const, cost: '$312/mo' },
    { name: 'i-0ghi11121', type: 'EC2 t3.medium', cloud: 'aws' as const, cost: '$156/mo' },
  ],
  sources: ['AWS Cost Explorer API · Jun 28, 2026', 'CloudWatch Metrics · us-east-1', 'CloudCEO Billing DB'],
};

export function AiWorkspacePage({ breadcrumbs }: AiWorkspacePageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [uiState, setUiState]   = useState<UiState>('idle');
  const [streamText, setStreamText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const hasMessages = messages.length > 0;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, uiState, streamText]);

  const submit = (text: string) => {
    if (!text.trim() || uiState !== 'idle') return;
    setMessages(p => [...p, { id: Date.now().toString(), role: 'user', text: text.trim() }]);
    setInput('');
    setUiState('thinking');
    setTimeout(() => {
      setUiState('streaming');
      const words = AI_RESPONSE.summary.split(' ');
      let i = 0;
      setStreamText('');
      const iv = setInterval(() => {
        i++;
        setStreamText(words.slice(0, i).join(' '));
        if (i >= words.length) {
          clearInterval(iv);
          setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', text: 'response' }]);
          setStreamText('');
          setUiState('done');
        }
      }, 50);
    }, 1400);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input); }
  };

  const cols4 = isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr 1fr' : 'repeat(6, 1fr)';

  return (
    <div style={{ fontFamily: 'var(--dash-font)', maxWidth: 1100, margin: '0 auto' }}>
      <BreadcrumbNav items={breadcrumbs} />

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={17} color="var(--dash-accent)" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text-primary)' }}>AI Workspace</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-accent)', backgroundColor: 'var(--dash-accent-tint)', padding: '2px 8px', borderRadius: 999 }}>BETA</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>Intelligent cloud analysis · AWS + Azure · Last analysed 5 min ago</div>
        </div>
        <button onClick={() => setMessages([])} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'var(--dash-bg-surface)', fontSize: 13, fontWeight: 500, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>
          <RefreshCw size={13} /> Refresh analysis
        </button>
      </div>

      {/* ── Executive overview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: cols4, gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {OVERVIEW_METRICS.map((m, i) => (
          <div key={i} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: isMobile ? '12px 14px' : '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
            <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
              {m.value}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--dash-text-muted)' }}>{m.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', lineHeight: 1.4 }}>{m.trend}</div>
              {!isMobile && <Sparkline values={m.values} color={m.color} />}
            </div>
          </div>
        ))}
      </div>

      {/* ── AI prompt ── */}
      <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: isMobile ? '14px' : '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {!hasMessages && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: isMobile ? 16 : 19, fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: 5 }}>What would you like to know about your cloud?</div>
            <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>Ask in natural language about costs, security, performance, or any cloud resource.</div>
          </div>
        )}

        {/* Message thread */}
        {hasMessages && (
          <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 420, overflowY: 'auto', paddingBottom: 4 }}>
            {messages.map(m => (
              <div key={m.id}>
                {m.role === 'user' ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', borderRadius: '14px 14px 4px 14px', padding: '9px 14px', maxWidth: '75%', fontSize: 14, lineHeight: 1.55 }}>{m.text}</div>
                  </div>
                ) : (
                  <AiResponsePanel isMobile={isMobile} />
                )}
              </div>
            ))}

            {uiState === 'thinking' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={12} color="var(--dash-accent)" />
                </div>
                <div style={{ padding: '9px 14px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--dash-text-secondary)' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analysing your cloud data…
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              </div>
            )}

            {uiState === 'streaming' && streamText && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Sparkles size={12} color="var(--dash-accent)" />
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: '4px 14px 14px 14px', fontSize: 13, color: 'var(--dash-text-primary)', lineHeight: 1.6, maxWidth: '85%' }}>
                  {streamText}<span style={{ display: 'inline-block', width: 2, height: 14, backgroundColor: 'var(--dash-accent)', marginLeft: 2, animation: 'blink 0.8s step-end infinite' }} />
                  <style>{`@keyframes blink{50%{opacity:0}}`}</style>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={isMobile ? 2 : 2}
            placeholder={hasMessages ? 'Ask a follow-up question…' : 'e.g. Why did costs increase 18% this week?'}
            style={{ flex: 1, border: '1px solid var(--dash-border)', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'var(--dash-font)', color: 'var(--dash-text-primary)', backgroundColor: 'var(--dash-bg-page)', outline: 'none', resize: 'none', lineHeight: 1.5 }}
          />
          <button
            onClick={() => submit(input)}
            disabled={!input.trim() || uiState !== 'idle'}
            style={{ width: 40, height: 40, borderRadius: 10, border: 'none', backgroundColor: input.trim() && uiState === 'idle' ? 'var(--dash-accent)' : 'var(--dash-border)', cursor: input.trim() && uiState === 'idle' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Send size={16} color={input.trim() && uiState === 'idle' ? '#FFFFFF' : 'var(--dash-text-muted)'} />
          </button>
        </div>

        {/* Example chips */}
        {!hasMessages && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {['Why did AWS costs spike?', 'Top security risks', 'Reduce cloud spend', "This month's summary"].map((q, i) => (
              <button key={i} onClick={() => submit(q)} style={{ padding: '5px 11px', borderRadius: 999, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)', color: 'var(--dash-text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--dash-font)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Sparkles size={10} color="var(--dash-accent)" /> {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Below-prompt discovery grid ── */}
      {!hasMessages && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Suggested questions */}
            <DiscoveryCard title="Suggested questions" icon={MessageSquare}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {SUGGESTED_QUESTIONS.map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => submit(q.text)}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--dash-font)', width: '100%' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-page)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={12} color="var(--dash-accent)" strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--dash-text-primary)', lineHeight: 1.4, flex: 1 }}>{q.text}</span>
                      <ChevronRight size={12} color="var(--dash-text-muted)" style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </DiscoveryCard>

            {/* Quick actions */}
            <DiscoveryCard title="Quick actions" icon={Zap}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {QUICK_ACTIONS.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button key={i} style={{ padding: '12px 10px', borderRadius: 10, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, fontFamily: 'var(--dash-font)', textAlign: 'left' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={14} color={a.color} strokeWidth={1.5} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--dash-text-primary)', lineHeight: 1.3 }}>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </DiscoveryCard>

            {/* Recent conversations */}
            <DiscoveryCard title="Recent conversations" icon={Clock}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {RECENT_CONVOS.map((c, i) => (
                  <div key={i} style={{ padding: '9px 6px', borderBottom: i < RECENT_CONVOS.length - 1 ? '1px solid var(--dash-border-light)' : 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)' }}>{c.title}</span>
                      <span style={{ fontSize: 10, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--dash-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.preview}</div>
                  </div>
                ))}
              </div>
            </DiscoveryCard>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr', gap: 16 }}>
            {/* Generated reports */}
            <DiscoveryCard title="Recently generated reports" icon={FileText}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {RECENT_REPORTS.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', backgroundColor: 'var(--dash-bg-page)', borderRadius: 8, border: '1px solid var(--dash-border)', cursor: 'pointer' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={13} color="var(--dash-accent)" strokeWidth={1.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>{r.date} · {r.pages} pages</div>
                    </div>
                    <CloudBadge variant={r.cloud} />
                  </div>
                ))}
              </div>
            </DiscoveryCard>

            {/* AI discoveries */}
            <DiscoveryCard title="Recent AI discoveries" icon={Sparkles}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {AI_DISCOVERIES.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', backgroundColor: d.sev === 'danger' ? 'var(--dash-danger-tint)' : 'var(--dash-warning-tint)', border: `1px solid ${d.sev === 'danger' ? 'var(--dash-danger)' : 'var(--dash-warning)'}`, borderRadius: 8, cursor: 'pointer' }} onClick={() => submit(d.text)}>
                      <Icon size={14} color={d.sev === 'danger' ? 'var(--dash-danger)' : 'var(--dash-warning)'} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: d.sev === 'danger' ? 'var(--dash-danger-text)' : 'var(--dash-warning-text)', lineHeight: 1.4 }}>{d.text}</span>
                      <ChevronRight size={12} color="var(--dash-text-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            </DiscoveryCard>
          </div>
        </>
      )}
    </div>
  );
}

/* ── AI structured response panel ── */
function AiResponsePanel({ isMobile }: { isMobile: boolean }) {
  const r = AI_RESPONSE;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Sparkles size={12} color="var(--dash-accent)" />
      </div>
      <div style={{ flex: 1 }}>

        {/* Executive summary */}
        <RSection label="Executive summary">
          <p style={{ fontSize: 14, color: 'var(--dash-text-primary)', lineHeight: 1.7, margin: 0 }}>{r.summary}</p>
        </RSection>

        {/* Key findings */}
        <RSection label="Key findings">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 8 }}>
            {r.findings.map((f, i) => (
              <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{f.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {f.direction === 'up'   && <ArrowUpRight size={14} color="var(--dash-danger)" />}
                  {f.direction === 'down' && <ArrowDownRight size={14} color="var(--dash-success)" />}
                  <span style={{ fontSize: 16, fontWeight: 700, color: f.color, fontVariantNumeric: 'tabular-nums' }}>{f.value}</span>
                </div>
              </div>
            ))}
          </div>
        </RSection>

        {/* Recommendations */}
        <RSection label="Recommendations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {r.recommendations.map((rec, i) => (
              <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <StatusBadge label={rec.priority} severity={rec.priority === 'High' ? 'danger' : 'warning'} />
                  {rec.savings && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-success)', backgroundColor: 'var(--dash-success-tint)', padding: '2px 7px', borderRadius: 999 }}>Save {rec.savings}</span>}
                  <span style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginLeft: 'auto' }}>Confidence: {rec.confidence}%</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--dash-text-primary)', lineHeight: 1.55 }}>{rec.text}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>Effort: {rec.effort}</span>
                  <button style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)' }}>Apply →</button>
                </div>
              </div>
            ))}
          </div>
        </RSection>

        {/* Affected resources */}
        <RSection label="Affected resources">
          <div style={{ border: '1px solid var(--dash-border)', borderRadius: 8, overflow: 'hidden' }}>
            {r.resources.map((res, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: i < r.resources.length - 1 ? '1px solid var(--dash-border-light)' : 'none' }}>
                <CloudBadge variant={res.cloud} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', fontFamily: 'ui-monospace, monospace' }}>{res.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>{res.type}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-danger)', fontVariantNumeric: 'tabular-nums' }}>{res.cost}</span>
              </div>
            ))}
          </div>
        </RSection>

        {/* Source references */}
        <RSection label="Sources">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {r.sources.map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: 'var(--dash-text-muted)', padding: '3px 8px', borderRadius: 999, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-page)' }}>{s}</span>
            ))}
          </div>
        </RSection>

        {/* Feedback row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>Was this helpful?</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--dash-font)' }}><ThumbsUp size={12} /> Yes</button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--dash-font)' }}><ThumbsDown size={12} /> No</button>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--dash-font)' }}><Copy size={11} /> Copy</button>
        </div>
      </div>
    </div>
  );
}

function RSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function DiscoveryCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 'var(--dash-radius-card)', padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
        <Icon size={14} color="var(--dash-text-secondary)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text-primary)' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
