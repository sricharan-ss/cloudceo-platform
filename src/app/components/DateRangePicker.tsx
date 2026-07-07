import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';
import { useDateRange, PresetRange } from '../context/DateRangeContext';
import { useBreakpoint } from '../hooks/useBreakpoint';

const DATE_OPTIONS: PresetRange[] = [
  'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days',
  'This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last 12 Months',
];

export function DateRangePicker({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { preset, setDateRange } = useDateRange();
  const [open, setOpen] = useState(false);
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const dateRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleSelect = (opt: PresetRange) => {
    setDateRange(opt);
    setOpen(false);
    onOpenChange?.(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!isMobile && dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobile, onOpenChange]);

  return (
    <div ref={dateRef} style={{ position: 'relative' }}>
      <button
        onClick={toggleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          borderRadius: 999, border: '1px solid var(--dash-border)',
          backgroundColor: 'var(--dash-bg-surface)', color: 'var(--dash-text-primary)',
          fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--dash-font)',
        }}
      >
        <Calendar size={14} color="var(--dash-text-secondary)" />
        <span>{preset}</span>
        <ChevronDown size={13} color="var(--dash-text-secondary)" />
      </button>

      {open && !isMobile && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 200,
          backgroundColor: 'var(--dash-bg-surface)', border: '1px solid var(--dash-border)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden', padding: '6px 0',
        }}>
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 13, color: opt === preset ? 'var(--dash-accent)' : 'var(--dash-text-primary)',
                fontWeight: opt === preset ? 500 : 400, fontFamily: 'var(--dash-font)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--dash-bg-page)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {opt}
              {opt === preset && <Check size={13} color="var(--dash-accent)" />}
            </button>
          ))}
          <div style={{ height: 1, backgroundColor: 'var(--dash-border-light)', margin: '6px 0' }} />
          <button
            onClick={() => handleSelect('Custom Range')}
            style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--dash-accent)', fontWeight: 500, textAlign: 'left', fontFamily: 'var(--dash-font)' }}
          >
            Custom range...
          </button>
        </div>
      )}

      {open && isMobile && (
        <>
          <div
            onClick={() => { setOpen(false); onOpenChange?.(false); }}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.40)', zIndex: 999
            }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: 'var(--dash-bg-surface)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
            zIndex: 1000, padding: '20px 20px 40px',
            fontFamily: 'var(--dash-font)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text-primary)' }}>Date range</span>
              <button onClick={() => { setOpen(false); onOpenChange?.(false); }} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--dash-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...DATE_OPTIONS, 'Custom Range' as PresetRange].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  style={{
                    width: '100%', padding: '12px 16px', border: 'none',
                    backgroundColor: opt === preset ? 'var(--dash-accent-tint)' : 'var(--dash-bg-surface)',
                    borderRadius: 8, cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 15, color: opt === preset ? 'var(--dash-accent)' : 'var(--dash-text-primary)',
                    fontWeight: opt === preset ? 500 : 400, fontFamily: 'var(--dash-font)',
                    textAlign: 'left',
                  }}
                >
                  {opt}
                  {opt === preset && <Check size={16} color="var(--dash-accent)" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
