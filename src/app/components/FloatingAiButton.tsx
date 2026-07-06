import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, RotateCcw, ChevronRight, ArrowLeft,
  TrendingDown, Shield, Activity, CheckCircle2, Clock,
  AlertTriangle, DollarSign, BarChart2, Zap, FileText,
  TrendingUp, Check, Undo2, Server, Cloud,
} from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

/* ─── Types ──────────────────────────────────────────────────────── */
type AiTab = 'assistant' | 'insights' | 'recommendations' | 'history';
interface Msg { id: string; role: 'user' | 'assistant'; text: string }

/* ─── Helpers ────────────────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/* ─── Data ───────────────────────────────────────────────────────── */
const GREETING_NAME = 'Srikanth';
const CLOUD_SUMMARY = 'Your cloud environment is at 78/100 health. Two critical security risks need attention today and $1,712 in monthly savings have been identified.';

const OVERVIEW_METRICS = [
  { label: 'Cloud health', value: '78/100', color: 'var(--dash-success)', bg: 'var(--dash-success-tint)' },
  { label: 'Est. savings',  value: '$1,712/mo', color: 'var(--dash-success)', bg: 'var(--dash-success-tint)' },
  { label: 'Critical risks', value: '2 active', color: 'var(--dash-danger)', bg: 'var(--dash-danger-tint)' },
  { label: 'AI status',    value: '● Active',  color: 'var(--dash-accent)', bg: 'var(--dash-accent-tint)' },
];

const QUICK_ACTIONS: { icon: React.ElementType; title: string; desc: string; prompt: string; accent: string }[] = [
  { icon: FileText,    title: 'Executive Report',        desc: 'Full cloud analysis PDF',       prompt: 'Generate an executive cloud summary report for this month.',        accent: 'var(--dash-accent)' },
  { icon: DollarSign,  title: 'Reduce AWS Costs',         desc: 'Top savings opportunities',     prompt: 'What are the top AWS cost reduction opportunities right now?',        accent: 'var(--dash-success)' },
  { icon: Shield,      title: 'Security Risks',           desc: '2 critical items flagged',      prompt: 'Show me all current security risks and vulnerabilities.',             accent: 'var(--dash-danger)' },
  { icon: TrendingUp,  title: 'Forecast Spending',        desc: 'Next month prediction',         prompt: 'Forecast cloud spending for next month based on current trends.',     accent: 'var(--dash-warning)' },
  { icon: BarChart2,   title: 'Resource Utilisation',     desc: 'Fleet analysis report',         prompt: 'Analyse resource utilisation across all cloud providers.',            accent: 'var(--dash-neutral-chart)' },
];

const AI_RESPONSE = "AWS costs increased 18.2% this week. The primary driver was an EC2 auto-scaling event at 14:23 UTC. Three idle instances are costing $847/month. I recommend reviewing scaling policies and converting baseline capacity to Reserved Instances — that alone would save approximately 40%.";

const INSIGHTS_DATA = [
  { label: 'Cloud health',    value: '78/100',    color: 'var(--dash-success)', note: '+4 vs last week' },
  { label: 'Monthly savings', value: '$1,712',    color: 'var(--dash-success)', note: '12 opportunities' },
  { label: 'Critical risks',  value: '2',         color: 'var(--dash-danger)',  note: 'Needs attention'  },
  { label: 'Predicted spend', value: '$48,900',   color: 'var(--dash-accent)',  note: 'On track'         },
];

const INSIGHT_CARDS = [
  { cat: 'Cost',        icon: TrendingDown,   sev: 'warning', title: '$1,712/month in savings identified', desc: '3 idle EC2 instances and overprovisioned RDS are the primary drivers.' },
  { cat: 'Security',    icon: Shield,          sev: 'danger',  title: '2 critical vulnerabilities active',  desc: 'WAF rate limiting missing on /api/auth. S3 bucket allows public reads.' },
  { cat: 'Performance', icon: BarChart2,       sev: 'warning', title: 'CloudFront cache hit rate at 42%',   desc: 'Down from 68% over 14 days — increasing latency for global users.' },
  { cat: 'Compliance',  icon: CheckCircle2,    sev: 'danger',  title: '3 policy violations this period',    desc: 'MFA not enforced for 3 IAM users. Session policy missing org-wide.' },
  { cat: 'Forecast',    icon: TrendingUp,      sev: 'warning', title: 'EC2 capacity at 85% by mid-Aug',    desc: 'Based on 90-day trend. Purchase Reserved Instances now to save 40%.' },
];

interface Rec { id: string; title: string; impact: string; priority: 'critical'|'high'|'medium'; cat: 'cost'|'security'|'performance'; action: string; cloud: string; savings?: string }
const RECS: Rec[] = [
  { id: 'r1', title: '3 idle EC2 instances',       impact: 'Compute waste',   priority: 'critical', cat: 'cost',        action: 'Terminate', cloud: 'AWS',   savings: '$847/mo' },
  { id: 'r2', title: 'WAF rate limiting missing',   impact: 'Attack surface',  priority: 'critical', cat: 'security',    action: 'Configure', cloud: 'AWS'                     },
  { id: 'r3', title: 'RDS overprovisioned 40%',     impact: 'Compute waste',   priority: 'high',     cat: 'cost',        action: 'Resize',    cloud: 'AWS',   savings: '$312/mo' },
  { id: 'r4', title: 'Azure VMs off-hours',         impact: 'Scheduling gap',  priority: 'high',     cat: 'cost',        action: 'Schedule',  cloud: 'Azure', savings: '$428/mo' },
  { id: 'r5', title: 'Public S3 bucket detected',   impact: 'Data exposure',   priority: 'critical', cat: 'security',    action: 'Restrict',  cloud: 'AWS'                     },
  { id: 'r6', title: 'CloudFront cache settings',   impact: '32% perf gain',   priority: 'medium',   cat: 'performance', action: 'Optimise',  cloud: 'AWS'                     },
];

const TypeIcon: Record<string, React.ElementType> = { Cost: TrendingDown, Security: Shield, Report: FileText, Optimization: Zap, Infrastructure: Server };
const HISTORY_GROUPS = [
  { label: 'Today',     items: [
    { icon: TrendingDown, title: 'AWS Cost Spike Analysis',        time: '2h ago',   cloud: 'aws',  type: 'Cost',          preview: 'EC2 auto-scaling caused 31% increase…' },
  ]},
  { label: 'Yesterday', items: [
    { icon: Shield,      title: 'Security Incident Review',         time: '1d ago',   cloud: 'aws',  type: 'Security',      preview: 'SQL injection blocked on /api/checkout…' },
    { icon: FileText,    title: 'Monthly Executive Report',          time: '1d ago',   cloud: 'both', type: 'Report',        preview: 'Cloud spend at 84% of monthly budget…'  },
  ]},
  { label: 'Last week', items: [
    { icon: Zap,         title: 'Cost Optimisation Session',         time: '4d ago',   cloud: 'aws',  type: 'Optimization',  preview: 'Identified 12 right-sizing opportunities…' },
    { icon: Server,      title: 'Infrastructure Health Summary',     time: '5d ago',   cloud: 'both', type: 'Infrastructure', preview: 'Health score dropped 4pts due to WAF…'    },
    { icon: Shield,      title: 'Azure WAF Configuration Audit',     time: '6d ago',   cloud: 'azure', type: 'Security',     preview: '3 missing rules from default rule set…'    },
  ]},
  { label: 'Last month', items: [
    { icon: FileText,    title: 'Q2 Cloud Spend Executive Brief',    time: '3wk ago',  cloud: 'both', type: 'Report',        preview: 'Q2 total $142k, 8% above Q1 baseline…'    },
  ]},
];

/* ─── Cloud badge pills ── */
function CloudPill({ cloud }: { cloud: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    aws:   { bg: 'var(--dash-success-tint)', color: 'var(--dash-success-text)', label: 'AWS'   },
    azure: { bg: 'var(--dash-warning-tint)', color: 'var(--dash-warning-text)', label: 'Azure' },
    both:  { bg: 'var(--dash-accent-tint)',  color: 'var(--dash-accent)',        label: 'Both'  },
  };
  const c = map[cloud] ?? map['both'];
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, backgroundColor: c.bg, color: c.color }}>{c.label}</span>
  );
}

/* ─── Component ──────────────────────────────────────────────────── */
interface FloatingAiButtonProps { hidden?: boolean }

export function FloatingAiButton({ hidden = false }: FloatingAiButtonProps) {
  const [open, setOpen]             = useState(false);
  const [tab, setTab]               = useState<AiTab>('assistant');
  const [messages, setMessages]     = useState<Msg[]>([]);
  const [input, setInput]           = useState('');
  const [thinking, setThinking]     = useState(false);
  const [streamText, setStreamText] = useState('');
  const [recFilter, setRecFilter]   = useState<'all'|'cost'|'security'|'performance'>('all');
  const [applied, setApplied]       = useState<Map<string, Date>>(new Map());
  const [undoSet, setUndoSet]       = useState<Set<string>>(new Set());
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const bp                          = useBreakpoint();
  const isMobile                    = bp === 'mobile';
  const hasMessages                 = messages.length > 0;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking, streamText]);

  if (hidden) return null;

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: 'user', text: text.trim() }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const words = AI_RESPONSE.split(' ');
      let i = 0;
      setStreamText('');
      const iv = setInterval(() => {
        i++;
        setStreamText(words.slice(0, i).join(' '));
        if (i >= words.length) {
          clearInterval(iv);
          setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', text: AI_RESPONSE }]);
          setStreamText('');
        }
      }, 38);
    }, 1300);
  };

  const applyRec = (id: string) => {
    setApplied(p => new Map([...p, [id, new Date()]]));
    setUndoSet(p => new Set([...p, id]));
    setTimeout(() => setUndoSet(p => { const n = new Set(p); n.delete(id); return n; }), 6000);
  };

  const undoRec = (id: string) => {
    setApplied(p => { const n = new Map(p); n.delete(id); return n; });
    setUndoSet(p => { const n = new Set(p); n.delete(id); return n; });
  };

  const reset = () => { setMessages([]); setStreamText(''); };

  const TABS: { id: AiTab; label: string }[] = [
    { id: 'assistant',       label: 'Assistant'       },
    { id: 'insights',        label: 'Insights'        },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'history',         label: 'History'         },
  ];

  const panelStyle: React.CSSProperties = isMobile
    ? { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--dash-bg-surface)', fontFamily: 'var(--dash-font)' }
    : { position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, zIndex: 200, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--dash-bg-surface)', borderLeft: '1px solid var(--dash-border)', fontFamily: 'var(--dash-font)', boxShadow: '-4px 0 32px rgba(0,0,0,0.10)' };

  const openCount = RECS.filter(r => !applied.has(r.id)).length;
  const visRecs   = RECS.filter(r => recFilter === 'all' || r.cat === recFilter);

  return (
    <>
      {/* ── Floating button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="CloudCEO AI"
          style={{
            position: 'fixed', bottom: isMobile ? 72 : 28, right: 20,
            width: 52, height: 52, borderRadius: '50%',
            backgroundColor: 'var(--dash-accent)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59,91,219,0.38)', zIndex: 100,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.08)'; el.style.boxShadow = '0 6px 28px rgba(59,91,219,0.52)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1)'; el.style.boxShadow = '0 4px 20px rgba(59,91,219,0.38)'; }}
        >
          <Sparkles size={22} color="#FFFFFF" strokeWidth={1.5} />
        </button>
      )}

      {/* ── Dim overlay (desktop) ── */}
      {open && !isMobile && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)', zIndex: 199 }} />
      )}

      {/* ── Panel ── */}
      {open && (
        <div style={panelStyle}>
          {/* Header */}
          <div style={{ height: 60, borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', flexShrink: 0 }}>
            {isMobile && (
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-secondary)', display: 'flex', padding: 6, borderRadius: 6 }}>
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
            )}
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="var(--dash-accent)" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text-primary)' }}>CloudCEO AI</div>
              <div style={{ fontSize: 11, color: 'var(--dash-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--dash-success)', display: 'inline-block' }} />
                Active · AWS + Azure · LMExams
              </div>
            </div>
            {tab === 'assistant' && hasMessages && (
              <button onClick={reset} title="New conversation" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', padding: 6, borderRadius: 6, display: 'flex', transition: 'color 0.12s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-muted)'; }}>
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
            )}
            {!isMobile && (
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', padding: 6, borderRadius: 6, display: 'flex', transition: 'color 0.12s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dash-text-muted)'; }}>
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--dash-border)', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: t.id === 'recommendations' ? '0 0 auto' : 1,
                padding: '0 10px', height: 44, border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: tab === t.id ? 600 : 400, fontFamily: 'var(--dash-font)',
                color: tab === t.id ? 'var(--dash-accent)' : 'var(--dash-text-secondary)',
                borderBottom: tab === t.id ? '2px solid var(--dash-accent)' : '2px solid transparent',
                whiteSpace: 'nowrap', marginBottom: -1, transition: 'color 0.12s ease',
                position: 'relative',
              }}>
                {t.label}
                {t.id === 'recommendations' && openCount > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 700, backgroundColor: 'var(--dash-danger)', color: '#FFFFFF', borderRadius: 999, padding: '1px 5px' }}>{openCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {tab === 'assistant'       && <AssistantTab messages={messages} input={input} setInput={setInput} send={send} thinking={thinking} streamText={streamText} bottomRef={bottomRef} />}
            {tab === 'insights'        && <InsightsTab />}
            {tab === 'recommendations' && <RecommendationsTab visRecs={visRecs} applied={applied} undoSet={undoSet} recFilter={recFilter} setRecFilter={setRecFilter} onApply={applyRec} onUndo={undoRec} openCount={openCount} allCount={RECS.length} />}
            {tab === 'history'         && <HistoryTab onLoad={(q) => { setTab('assistant'); send(q); }} />}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Assistant tab ──────────────────────────────────────────────── */
function AssistantTab({ messages, input, setInput, send, thinking, streamText, bottomRef }: {
  messages: Msg[]; input: string; setInput: (v: string) => void;
  send: (t: string) => void; thinking: boolean; streamText: string;
  bottomRef: React.RefObject<HTMLDivElement>;
}) {
  const hasMessages = messages.length > 0;

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Pre-conversation greeting ── */}
        {!hasMessages && (
          <>
            {/* Greeting */}
            <div style={{ padding: '16px 0 4px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: 6 }}>
                {getGreeting()}, {GREETING_NAME}. ✨
              </div>
              <div style={{ fontSize: 13, color: 'var(--dash-text-secondary)', lineHeight: 1.65 }}>{CLOUD_SUMMARY}</div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {OVERVIEW_METRICS.map((m, i) => (
                <div key={i} style={{ backgroundColor: m.bg, border: `1px solid ${m.color}25`, borderRadius: 10, padding: '10px 12px', transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: m.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'var(--dash-border-light)', margin: '4px 0' }} />

            {/* Quick actions */}
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {QUICK_ACTIONS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <button key={i} onClick={() => send(a.prompt)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '11px 12px', borderRadius: 10, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--dash-font)', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = a.accent; el.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--dash-border)'; el.style.transform = 'none'; }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: `${a.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} color={a.accent} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dash-text-primary)', lineHeight: 1.3 }}>{a.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', marginTop: 1 }}>{a.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Message thread ── */}
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={10} color="var(--dash-accent)" />
              </div>
            )}
            <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px', backgroundColor: m.role === 'user' ? 'var(--dash-accent)' : 'var(--dash-bg-page)', border: m.role === 'assistant' ? '1px solid var(--dash-border)' : 'none', color: m.role === 'user' ? '#FFFFFF' : 'var(--dash-text-primary)', fontSize: 13, lineHeight: 1.6 }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Thinking */}
        {thinking && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={10} color="var(--dash-accent)" />
            </div>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', marginRight: 6 }}>Analysing cloud data</span>
              {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--dash-accent)', display: 'inline-block', animation: `aip 1.2s ease ${i*0.2}s infinite` }} />)}
              <style>{`@keyframes aip{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
            </div>
          </div>
        )}

        {/* Streaming */}
        {streamText && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--dash-accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={10} color="var(--dash-accent)" />
            </div>
            <div style={{ maxWidth: '82%', padding: '9px 13px', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: '4px 14px 14px 14px', fontSize: 13, lineHeight: 1.6, color: 'var(--dash-text-primary)' }}>
              {streamText}<span style={{ display: 'inline-block', width: 2, height: 13, backgroundColor: 'var(--dash-accent)', marginLeft: 2, animation: 'aib 0.8s step-end infinite' }} />
              <style>{`@keyframes aib{50%{opacity:0}}`}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--dash-border)', padding: '10px 14px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: '8px 10px', transition: 'border-color 0.15s ease' }}
          onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-accent)'; }}
          onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={hasMessages ? 'Ask a follow-up question…' : 'Or type your own question…'}
            rows={2}
            style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: 13, fontFamily: 'var(--dash-font)', backgroundColor: 'transparent', color: 'var(--dash-text-primary)', lineHeight: 1.5 }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || thinking}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', backgroundColor: input.trim() && !thinking ? 'var(--dash-accent)' : 'var(--dash-border)', cursor: input.trim() && !thinking ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.15s ease' }}>
            <Send size={13} color={input.trim() && !thinking ? '#FFFFFF' : 'var(--dash-text-muted)'} />
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', marginTop: 5, textAlign: 'center' }}>Enter to send · Shift+Enter for new line</div>
      </div>
    </>
  );
}

/* ─── Insights tab ───────────────────────────────────────────────── */
function InsightsTab() {
  const sev = (s: string) => s === 'danger' ? 'var(--dash-danger)' : s === 'warning' ? 'var(--dash-warning)' : 'var(--dash-success)';
  const sevBg = (s: string) => s === 'danger' ? 'var(--dash-danger-tint)' : s === 'warning' ? 'var(--dash-warning-tint)' : 'var(--dash-success-tint)';

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Executive summary */}
      <div style={{ backgroundColor: 'var(--dash-accent-tint)', border: '1px solid var(--dash-accent)25', borderRadius: 10, padding: '13px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={12} color="var(--dash-accent)" />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Executive Summary</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--dash-text-primary)', lineHeight: 1.65, margin: 0 }}>
          Cloud health is <strong>78/100</strong>. AWS costs up 14% driven by EC2 scaling. <strong>2 critical security risks</strong> require immediate action. <strong>$1,712/mo</strong> in savings identified.
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {INSIGHTS_DATA.map((m, i) => (
          <div key={i} style={{ backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '10px 12px', transition: 'border-color 0.15s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
            <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: 10, color: 'var(--dash-text-muted)', marginTop: 2 }}>{m.note}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>AI Observations</div>

      {INSIGHT_CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} style={{ backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)', borderRadius: 10, padding: '12px 14px', borderLeft: `3px solid ${sev(c.sev)}`, transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateX(2px)'; el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: sevBg(c.sev), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={11} color={sev(c.sev)} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.cat}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4, lineHeight: 1.35 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: 'var(--dash-text-secondary)', lineHeight: 1.55 }}>{c.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Recommendations tab ────────────────────────────────────────── */
function RecommendationsTab({ visRecs, applied, undoSet, recFilter, setRecFilter, onApply, onUndo, openCount, allCount }: {
  visRecs: Rec[]; applied: Map<string, Date>; undoSet: Set<string>;
  recFilter: string; setRecFilter: (v: any) => void;
  onApply: (id: string) => void; onUndo: (id: string) => void;
  openCount: number; allCount: number;
}) {
  const pColor = (p: string) => p === 'critical' ? 'var(--dash-danger)' : p === 'high' ? 'var(--dash-warning)' : 'var(--dash-text-muted)';
  const pBg    = (p: string) => p === 'critical' ? 'var(--dash-danger-tint)' : p === 'high' ? 'var(--dash-warning-tint)' : 'var(--dash-bg-page)';
  const FILTERS = ['all', 'cost', 'security', 'performance'] as const;

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dash-text-primary)' }}>{openCount} open <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--dash-text-muted)' }}>of {allCount}</span></div>
          <div style={{ fontSize: 11, color: 'var(--dash-success)', fontWeight: 500 }}>{allCount - openCount} applied · $1,712/mo potential savings</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setRecFilter(f)}
            style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: `1px solid ${recFilter === f ? 'var(--dash-accent)' : 'var(--dash-border)'}`, backgroundColor: recFilter === f ? 'var(--dash-accent-tint)' : 'transparent', color: recFilter === f ? 'var(--dash-accent)' : 'var(--dash-text-secondary)', fontFamily: 'var(--dash-font)', textTransform: 'capitalize', transition: 'all 0.12s ease' }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Cards */}
      {visRecs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <CheckCircle2 size={28} color="var(--dash-success)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', marginBottom: 4 }}>All done!</div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-secondary)' }}>No open recommendations for this filter.</div>
        </div>
      ) : (
        visRecs.map(r => {
          const isApplied = applied.has(r.id);
          const canUndo   = undoSet.has(r.id);
          const appliedAt = applied.get(r.id);

          return (
            <div key={r.id} style={{
              backgroundColor: isApplied ? 'var(--dash-success-tint)' : 'var(--dash-bg-surface)',
              border: `1px solid ${isApplied ? 'var(--dash-success)' : 'var(--dash-border)'}`,
              borderRadius: 10, padding: '12px 14px',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}>
              {/* Title + badges */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, backgroundColor: pBg(r.priority), color: pColor(r.priority), textTransform: 'capitalize' }}>{r.priority}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 999, backgroundColor: 'var(--dash-bg-page)', border: '1px solid var(--dash-border)', color: 'var(--dash-text-muted)' }}>{r.cloud}</span>
                  {r.savings && !isApplied && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, backgroundColor: 'var(--dash-success-tint)', color: 'var(--dash-success)' }}>Save {r.savings}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: isApplied ? 'var(--dash-success-text)' : 'var(--dash-text-primary)', lineHeight: 1.35 }}>{r.title}</div>
              </div>

              {/* Applied state */}
              {isApplied ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--dash-success)', fontWeight: 500, marginBottom: canUndo ? 6 : 0 }}>
                    <Check size={14} /> Applied {appliedAt ? timeAgo(appliedAt) : ''}
                  </div>
                  {canUndo && (
                    <button onClick={() => onUndo(r.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--dash-success)', background: 'none', fontSize: 11, fontWeight: 500, color: 'var(--dash-success-text)', cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'background-color 0.12s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-surface)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                      <Undo2 size={11} /> Undo
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => onApply(r.id)}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 'var(--dash-radius-button)', border: 'none', backgroundColor: 'var(--dash-accent)', color: '#FFFFFF', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2F4DC4'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-accent)'; }}>
                    {r.action}
                  </button>
                  <button onClick={() => onApply(r.id)}
                    style={{ padding: '7px 12px', borderRadius: 'var(--dash-radius-button)', border: '1px solid var(--dash-border)', background: 'none', fontSize: 12, color: 'var(--dash-text-secondary)', cursor: 'pointer', fontFamily: 'var(--dash-font)', transition: 'border-color 0.12s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border-strong)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dash-border)'; }}>
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── History tab ────────────────────────────────────────────────── */
function HistoryTab({ onLoad }: { onLoad: (q: string) => void }) {
  const typeColor: Record<string, string> = {
    Cost: 'var(--dash-success)', Security: 'var(--dash-danger)',
    Report: 'var(--dash-accent)', Optimization: 'var(--dash-warning)', Infrastructure: 'var(--dash-neutral-chart)',
  };
  const typeBg: Record<string, string> = {
    Cost: 'var(--dash-success-tint)', Security: 'var(--dash-danger-tint)',
    Report: 'var(--dash-accent-tint)', Optimization: 'var(--dash-warning-tint)', Infrastructure: 'var(--dash-bg-page)',
  };

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {HISTORY_GROUPS.map((group, gi) => (
        <div key={gi}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8 }}>{group.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {group.items.map((item, ii) => {
              const Icon = TypeIcon[item.type] ?? Activity;
              return (
                <button key={ii} onClick={() => onLoad(item.title)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--dash-border)', backgroundColor: 'var(--dash-bg-surface)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--dash-font)', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--dash-border-strong)'; el.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--dash-border)'; el.style.transform = 'none'; }}>
                  {/* Icon */}
                  <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: typeBg[item.type] ?? 'var(--dash-bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={typeColor[item.type] ?? 'var(--dash-text-secondary)'} strokeWidth={1.5} />
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.title}</span>
                      <span style={{ fontSize: 10, color: 'var(--dash-text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 999, backgroundColor: typeBg[item.type] ?? 'var(--dash-bg-page)', color: typeColor[item.type] ?? 'var(--dash-text-muted)' }}>{item.type}</span>
                      <CloudPill cloud={item.cloud} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--dash-text-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.preview}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
