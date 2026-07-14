import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Check,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { CloudBadge } from "./CloudBadge";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { RequestVolumeChart } from "./RequestVolumeChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import {
  TopBlockedIPsTable,
  BLOCKED_IPS,
} from "./TopBlockedIPsTable";
import {
  RecentSecurityEventsTable,
} from "./RecentSecurityEventsTable";
import { ActivityLogTab } from "./ActivityLogTab";
import { SecurityEventPanel } from "./SecurityEventPanel";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useDateRange } from "../context/DateRangeContext";
import { useProvider } from "../context/ProviderContext";
import { getProviderMocks } from "../mocks";
import { PageSkeleton } from "./Skeleton";
import type { SecurityEventMock } from "../mocks/types";

type Tab = "overview" | "activity";

const ATTACK_TYPES = [
  { label: "SQL injection", value: 487 },
  { label: "Bot traffic", value: 312 },
  { label: "XSS", value: 198 },
  { label: "Rate limit abuse", value: 164 },
  { label: "Path traversal", value: 123 },
];

const MONO =
  'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';

export function SecurityOverview() {
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedEvent, setSelectedEvent] =
    useState<SecurityEventMock | null>(null);
  const bp = useBreakpoint();
  const { isLoading } = useDateRange();
  const { provider } = useProvider();
  const mocks = getProviderMocks(provider);
  const ATTACK_TYPES = mocks.attackTypes;
  const secKpi = mocks.securityKpi;

  useEffect(() => {
    const handleNav = (e: CustomEvent<{ tab: Tab }>) => {
      if (e.detail?.tab) setTab(e.detail.tab);
    };
    window.addEventListener('security-navigate', handleNav as EventListener);
    return () => window.removeEventListener('security-navigate', handleNav as EventListener);
  }, []);

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      {bp === "mobile" ? (
        <SecurityMobile
          tab={tab}
          onTabChange={setTab}
          onSelectEvent={setSelectedEvent}
          attackTypes={ATTACK_TYPES}
          secKpi={secKpi}
          securityEvents={mocks.securityEvents}
        />
      ) : (
        <SecurityDesktopTablet
          tab={tab}
          onTabChange={setTab}
          onSelectEvent={setSelectedEvent as any}
          isTablet={bp === "tablet"}
          attackTypes={ATTACK_TYPES}
          secKpi={secKpi}
        />
      )}
      <SecurityEventPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

/* ─── Desktop + Tablet layout ───────────────────────────────────── */

function SecurityDesktopTablet({
  tab,
  onTabChange,
  onSelectEvent,
  isTablet,
  attackTypes,
  secKpi,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onSelectEvent: (e: SecurityEventMock) => void;
  isTablet: boolean;
  attackTypes: { label: string; value: number }[];
  secKpi: { totalRequests: string; totalRequestsTrend: string; blockedRequests: string; blockedRequestsTrend: string; blockRate: string; activeRules: number };
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--dash-border)",
          marginBottom: isTablet ? 24 : 32,
          overflowX: "auto",
        }}
      >
        <TabButton
          label="Overview"
          active={tab === "overview"}
          onClick={() => onTabChange("overview")}
        />
        <TabButton
          label="Activity log"
          active={tab === "activity"}
          onClick={() => onTabChange("activity")}
        />
      </div>

      {tab === "activity" && (
        <ActivityLogTab onSelectEvent={onSelectEvent} />
      )}

      {tab === "overview" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isTablet ? 20 : 32,
          }}
        >
          {/* Stat grid: 2×2 on tablet, 4×1 on desktop */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            <StatCard
              label="Total requests"
              value={secKpi.totalRequests}
              labelSize={isTablet ? 11 : 12}
              compact={isTablet}
              trend={{
                direction: "up",
                percentage: secKpi.totalRequestsTrend,
                label: isTablet ? "vs prev" : "vs previous period",
                goodDirection: "up",
              }}
            />
            <StatCard
              label="Blocked requests"
              value={secKpi.blockedRequests}
              labelSize={isTablet ? 11 : 12}
              compact={isTablet}
              trend={{
                direction: "up",
                percentage: secKpi.blockedRequestsTrend,
                label: isTablet ? "vs prev" : "vs previous period",
                goodDirection: "down",
              }}
            />
            <StatCard
              label="Block rate"
              value={secKpi.blockRate}
              labelSize={isTablet ? 11 : 12}
              compact={isTablet}
              badge={
                <StatusBadge
                  label="Normal"
                  severity="success"
                />
              }
            />
            <StatCard
              label="Active rules"
              value={String(secKpi.activeRules)}
              labelSize={isTablet ? 11 : 12}
              compact={isTablet}
              badge={
                <span
                  style={{ fontSize: 12, color: "var(--dash-text-secondary)" }}
                >
                  All rules active
                </span>
              }
            />
          </div>

          {/* Chart row: stacked on tablet, side-by-side on desktop */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "3fr 2fr",
              gap: 20,
            }}
          >
            <RequestVolumeChart />
            <HorizontalBarChart
              title="Attack types"
              items={attackTypes}
              labelWidth={120}
              barColor="#6B6588"
              valueFormatter={(v) => `${v} blocked`}
            />
          </div>

          {/* Table row: stacked on tablet, side-by-side on desktop */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
              gap: 20,
            }}
          >
            <TopBlockedIPsTable onViewAll={() => {
              onTabChange("activity");
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('security-search', { detail: { status: 'blocked' } }));
              }, 50);
            }} />
            <RecentSecurityEventsTable
              onSelectEvent={onSelectEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mobile layout (375px) — all fixes applied ─────────────────── */

function SecurityMobile({
  tab,
  onTabChange,
  onSelectEvent,
  attackTypes,
  secKpi,
  securityEvents,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onSelectEvent: (e: SecurityEventMock) => void;
  attackTypes: { label: string; value: number }[];
  secKpi: { totalRequests: string; totalRequestsTrend: string; blockedRequests: string; blockedRequestsTrend: string; blockRate: string; activeRules: number };
  securityEvents: SecurityEventMock[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--dash-space-2xl)",
        fontFamily: "var(--dash-font)",
      }}
    >
      {/* Secondary tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--dash-border)",
          marginBottom: 0,
          overflowX: "auto",
        }}
      >
        <TabButton
          label="Overview"
          active={tab === "overview"}
          onClick={() => onTabChange("overview")}
        />
        <TabButton
          label="Activity log"
          active={tab === "activity"}
          onClick={() => onTabChange("activity")}
        />
      </div>

      {tab === "activity" && (
        <ActivityLogTab onSelectEvent={onSelectEvent} />
      )}

      {tab === "overview" && (
        <>
          {/* Date filter */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <DatePill label="Last 24 hours" />
          </div>

          {/* FIX 2 — 2×2 stat card grid, no overflow */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--dash-mobile-card-gap)",
            }}
          >
            <StatCard
              labelSize={11}
              label="Total requests"
              value="284,910"
              trend={{
                direction: "up",
                percentage: "12.3%",
                label: "vs prev",
                goodDirection: "up",
              }}
            />
            <StatCard
              labelSize={11}
              label="Blocked requests"
              value="1,284"
              trend={{
                direction: "up",
                percentage: "8.6%",
                label: "vs prev",
                goodDirection: "down",
              }}
            />
            <StatCard
              labelSize={11}
              label="Block rate"
              value="0.45%"
              badge={
                <StatusBadge
                  label="Normal"
                  severity="success"
                />
              }
            />
            <StatCard
              labelSize={11}
              label="Active rules"
              value="18"
              badge={
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--dash-text-secondary)",
                  }}
                >
                  All rules active
                </span>
              }
            />
          </div>

          {/* Request volume chart — full width, reduced height */}
          <RequestVolumeChart chartHeight={180} />

          {/* FIX 4 + 5 — Attack types: count labels + neutral gray-purple bars */}
          <HorizontalBarChart
            title="Attack types"
            items={ATTACK_TYPES}
            labelWidth={110}
            barColor="var(--dash-neutral-attack)"
            valueFormatter={(v) => `${v} blocked`}
          />

          {/* FIX 3 — Top blocked IPs as stacked cards */}
          <section>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--dash-text-primary)",
                display: "block",
                marginBottom: "var(--dash-space-md)",
              }}
            >
              Top blocked IPs
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--dash-space-sm)",
              }}
            >
              {BLOCKED_IPS.map((row) => (
                <div
                  key={row.ip}
                  style={{
                    backgroundColor: "var(--dash-bg-surface)",
                    border: "1px solid var(--dash-border)",
                    borderRadius: "var(--dash-radius-card)",
                    padding: "var(--dash-space-md)",
                    minHeight: "var(--dash-touch-target)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--dash-text-primary)",
                        fontFamily: MONO,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.ip}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--dash-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                        flexShrink: 0,
                      }}
                    >
                      {row.blocked.toLocaleString()} blocked
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      {row.country}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      {row.lastSeen}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                onTabChange("activity");
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('security-search', { detail: { status: 'blocked' } }));
                }, 50);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 0 0',
                fontSize: 14,
                color: 'var(--dash-accent)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              View all
            </button>
          </section>

          {/* FIX 3 — Recent security events as stacked cards */}
          <section>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--dash-text-primary)",
                display: "block",
                marginBottom: "var(--dash-space-md)",
              }}
            >
              Recent security events
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--dash-space-sm)",
              }}
            >
              {securityEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  style={{
                    backgroundColor: "var(--dash-bg-surface)",
                    border: "1px solid var(--dash-border)",
                    borderRadius: "var(--dash-radius-card)",
                    padding: "var(--dash-space-md)",
                    minHeight: "var(--dash-touch-target)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--dash-text-primary)",
                      lineHeight: 1.4,
                      marginBottom: 6,
                    }}
                  >
                    {event.detail}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <StatusBadge
                      label={
                        event.severity === "critical"
                          ? "Critical"
                          : event.severity === "warning"
                          ? "Warning"
                          : "Info"
                      }
                      severity={
                        event.severity === "critical"
                          ? "danger"
                          : event.severity === "warning"
                          ? "warning"
                          : "info"
                      }
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        border: `1px solid ${active ? "var(--dash-accent)" : "var(--dash-border)"}`,
        backgroundColor: active
          ? "var(--dash-accent-tint)"
          : "var(--dash-bg-surface)",
        color: active
          ? "var(--dash-accent)"
          : "var(--dash-text-secondary)",
        fontFamily: "var(--dash-font)",
        transition: "all 0.12s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Shared sub-components ─────────────────────────────────────── */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0 20px",
        height: 48,
        border: "none",
        borderBottom: active
          ? "2px solid #3B5BDB"
          : "2px solid transparent",
        backgroundColor: "transparent",
        color: active
          ? "#3B5BDB"
          : hovered
            ? "#1C1B19"
            : "#6B6A64",
        fontSize: 14,
        fontWeight: active ? 500 : 400,
        cursor: "pointer",
        transition: "color 0.12s ease, border-color 0.12s ease",
        marginBottom: -1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function DatePill({ label }: { label: string }) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: "var(--dash-radius-pill)",
        border: "1px solid var(--dash-border)",
        backgroundColor: "var(--dash-bg-surface)",
        color: "var(--dash-text-primary)",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        minHeight: "var(--dash-touch-target)",
        fontFamily: "var(--dash-font)",
      }}
    >
      <Calendar size={14} color="var(--dash-text-secondary)" />
      <span>{label}</span>
      <ChevronDown
        size={13}
        color="var(--dash-text-secondary)"
      />
    </button>
  );
}
