import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Search,
  Download,
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
  SECURITY_EVENTS,
} from "./RecentSecurityEventsTable";
import { SecurityEventPanel } from "./SecurityEventPanel";
import { useBreakpoint } from "../hooks/useBreakpoint";
import type { SecurityEvent } from "./RecentSecurityEventsTable";

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
    useState<SecurityEvent | null>(null);
  const bp = useBreakpoint();

  return (
    <>
      {bp === "mobile" ? (
        <SecurityMobile
          tab={tab}
          onTabChange={setTab}
          onSelectEvent={setSelectedEvent}
        />
      ) : (
        <SecurityDesktopTablet
          tab={tab}
          onTabChange={setTab}
          onSelectEvent={setSelectedEvent}
        />
      )}
      <SecurityEventPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

/* ─── Desktop + Tablet layout (unchanged) ───────────────────────── */

function SecurityDesktopTablet({
  tab,
  onTabChange,
  onSelectEvent,
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onSelectEvent: (e: SecurityEvent) => void;
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
          borderBottom: "1px solid #E5E3DE",
          marginBottom: 32,
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
            gap: 32,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
            }}
          >
            <StatCard
              label="Total requests"
              value="284,910"
              trend={{
                direction: "up",
                percentage: "12.3%",
                label: "vs previous period",
                goodDirection: "up",
              }}
            />
            <StatCard
              label="Blocked requests"
              value="1,284"
              trend={{
                direction: "up",
                percentage: "8.6%",
                label: "vs previous period",
                goodDirection: "down",
              }}
            />
            <StatCard
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
              label="Active rules"
              value="18"
              badge={
                <span
                  style={{ fontSize: 12, color: "#6B6A64" }}
                >
                  All rules active
                </span>
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr",
              gap: 20,
            }}
          >
            <RequestVolumeChart />
            <HorizontalBarChart
              title="Attack types"
              items={ATTACK_TYPES}
              labelWidth={120}
              barColor="#6B6588"
              valueFormatter={(v) => `${v} blocked`}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <TopBlockedIPsTable />
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
}: {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onSelectEvent: (e: SecurityEvent) => void;
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
              {SECURITY_EVENTS.map((event) => (
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
                    {event.description}
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
                        event.severity === "danger"
                          ? "Critical"
                          : "Warning"
                      }
                      severity={event.severity}
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

/* ─── Activity Log Tab ───────────────────────────────────────────── */

const ALL_LOG_EVENTS: SecurityEvent[] = [
  {
    id: "l1",
    description: "SQL injection attempt blocked",
    severity: "danger",
    time: "2h ago",
    sourceIp: "203.0.113.42",
    targetEndpoint: "/api/checkout",
    ruleMatched: "AWS-AWSManagedRulesSQLiRuleSet",
    country: "United States",
    method: "POST",
  },
  {
    id: "l2",
    description: "XSS payload detected in query string",
    severity: "danger",
    time: "3h ago",
    sourceIp: "198.51.100.17",
    targetEndpoint: "/api/search",
    ruleMatched: "AWS-AWSManagedRulesCommonRuleSet",
    country: "Germany",
    method: "GET",
  },
  {
    id: "l3",
    description: "Unusual traffic spike from single IP",
    severity: "warning",
    time: "5h ago",
    sourceIp: "192.0.2.89",
    targetEndpoint: "/api/login",
    ruleMatched: "RateLimitRule-Global",
    country: "Singapore",
    method: "POST",
  },
  {
    id: "l4",
    description: "Bot pattern matched on /api/login",
    severity: "warning",
    time: "8h ago",
    sourceIp: "203.0.113.105",
    targetEndpoint: "/api/login",
    ruleMatched: "AWS-AWSManagedRulesBotControlRuleSet",
    country: "Brazil",
    method: "POST",
  },
  {
    id: "l5",
    description: "Rate limit exceeded on /api/checkout",
    severity: "warning",
    time: "14h ago",
    sourceIp: "198.51.100.63",
    targetEndpoint: "/api/checkout",
    ruleMatched: "RateLimitRule-Checkout",
    country: "United States",
    method: "POST",
  },
  {
    id: "l6",
    description: "Path traversal attempt blocked",
    severity: "warning",
    time: "1d ago",
    sourceIp: "192.0.2.14",
    targetEndpoint: "/api/files",
    ruleMatched: "AWS-AWSManagedRulesCommonRuleSet",
    country: "Germany",
    method: "GET",
  },
  {
    id: "l7",
    description: "Credential stuffing attempt",
    severity: "danger",
    time: "1d ago",
    sourceIp: "203.0.113.15",
    targetEndpoint: "/api/login",
    ruleMatched: "AWS-AWSManagedRulesBotControlRuleSet",
    country: "Russia",
    method: "POST",
  },
  {
    id: "l8",
    description: "Malformed request body detected",
    severity: "warning",
    time: "1d ago",
    sourceIp: "198.51.100.44",
    targetEndpoint: "/api/products",
    ruleMatched: "AWS-AWSManagedRulesCommonRuleSet",
    country: "France",
    method: "PUT",
  },
  {
    id: "l9",
    description: "Scanner/probe pattern identified",
    severity: "warning",
    time: "2d ago",
    sourceIp: "192.0.2.200",
    targetEndpoint: "/.env",
    ruleMatched: "AWS-AWSManagedRulesCommonRuleSet",
    country: "Netherlands",
    method: "GET",
  },
  {
    id: "l10",
    description: "SQL injection via header injection",
    severity: "danger",
    time: "2d ago",
    sourceIp: "203.0.113.77",
    targetEndpoint: "/api/users",
    ruleMatched: "AWS-AWSManagedRulesSQLiRuleSet",
    country: "China",
    method: "GET",
  },
  {
    id: "l11",
    description: "Cross-site request forgery blocked",
    severity: "warning",
    time: "3d ago",
    sourceIp: "198.51.100.88",
    targetEndpoint: "/api/transfer",
    ruleMatched: "AzureWAF-DefaultRuleSet-3.2",
    country: "Canada",
    method: "POST",
  },
  {
    id: "l12",
    description: "Directory enumeration attempt",
    severity: "warning",
    time: "3d ago",
    sourceIp: "192.0.2.101",
    targetEndpoint: "/admin",
    ruleMatched: "AWS-AWSManagedRulesCommonRuleSet",
    country: "India",
    method: "GET",
  },
];

const PAGE_SIZE = 8;

function ActivityLogTab({
  onSelectEvent,
}: {
  onSelectEvent: (e: SecurityEvent) => void;
}) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<
    "all" | "critical" | "warning"
  >("all");
  const [cloud, setCloud] = useState<"all" | "aws" | "azure">(
    "all",
  );
  const [page, setPage] = useState(1);

  const filtered = ALL_LOG_EVENTS.filter((e) => {
    const matchSearch =
      !search ||
      e.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      e.sourceIp.includes(search);
    const matchSev =
      severity === "all" ||
      (severity === "critical"
        ? e.severity === "danger"
        : e.severity === "warning");
    const matchCloud =
      cloud === "all" ||
      (cloud === "aws"
        ? e.ruleMatched.includes("AWS")
        : e.ruleMatched.includes("Azure"));
    return matchSearch && matchSev && matchCloud;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "var(--dash-font)",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 200,
          }}
        >
          <Search
            size={13}
            color="var(--dash-text-muted)"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search events, IPs…"
            style={{
              width: "100%",
              height: 34,
              padding: "0 10px 0 30px",
              fontSize: 13,
              fontFamily: "var(--dash-font)",
              borderRadius: "var(--dash-radius-button)",
              border: "1px solid var(--dash-border)",
              backgroundColor: "var(--dash-bg-surface)",
              color: "var(--dash-text-primary)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <FilterPill
          label="All"
          active={severity === "all"}
          onClick={() => {
            setSeverity("all");
            setPage(1);
          }}
        />
        <FilterPill
          label="Critical"
          active={severity === "critical"}
          onClick={() => {
            setSeverity("critical");
            setPage(1);
          }}
        />
        <FilterPill
          label="Warning"
          active={severity === "warning"}
          onClick={() => {
            setSeverity("warning");
            setPage(1);
          }}
        />
        <div
          style={{
            width: 1,
            height: 20,
            backgroundColor: "var(--dash-border)",
          }}
        />
        <FilterPill
          label="All clouds"
          active={cloud === "all"}
          onClick={() => {
            setCloud("all");
            setPage(1);
          }}
        />
        <FilterPill
          label="AWS"
          active={cloud === "aws"}
          onClick={() => {
            setCloud("aws");
            setPage(1);
          }}
        />
        <FilterPill
          label="Azure"
          active={cloud === "azure"}
          onClick={() => {
            setCloud("azure");
            setPage(1);
          }}
        />
        <button
          style={{
            marginLeft: "auto",
            padding: "6px 14px",
            borderRadius: "var(--dash-radius-button)",
            border: "1px solid var(--dash-border)",
            background: "var(--dash-bg-surface)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--dash-text-secondary)",
            cursor: "pointer",
            fontFamily: "var(--dash-font)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Download size={13} /> Export
        </button>
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: 12,
          color: "var(--dash-text-muted)",
        }}
      >
        {filtered.length} event
        {filtered.length !== 1 ? "s" : ""} · Page {page} of{" "}
        {Math.max(1, totalPages)}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "var(--dash-bg-surface)",
          border: "1px solid var(--dash-border)",
          borderRadius: "var(--dash-radius-card)",
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--dash-border)",
              }}
            >
              {[
                "Time",
                "Event",
                "Severity",
                "Source IP",
                "Endpoint",
                "Cloud",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0 16px",
                    height: 40,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--dash-text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((event, i) => (
              <ActivityLogRow
                key={event.id}
                event={event}
                isLast={i === visible.length - 1}
                onClick={() => onSelectEvent(event)}
              />
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "var(--dash-text-muted)",
                    fontSize: 13,
                  }}
                >
                  No events match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--dash-radius-button)",
              border: "1px solid var(--dash-border)",
              background: "var(--dash-bg-surface)",
              fontSize: 13,
              cursor: page === 1 ? "not-allowed" : "pointer",
              color: "var(--dash-text-secondary)",
              opacity: page === 1 ? 0.4 : 1,
              fontFamily: "var(--dash-font)",
            }}
          >
            ← Prev
          </button>
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1,
          ).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--dash-radius-button)",
                border: "1px solid var(--dash-border)",
                background:
                  p === page
                    ? "var(--dash-accent)"
                    : "var(--dash-bg-surface)",
                color:
                  p === page
                    ? "#FFFFFF"
                    : "var(--dash-text-primary)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--dash-font)",
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--dash-radius-button)",
              border: "1px solid var(--dash-border)",
              background: "var(--dash-bg-surface)",
              fontSize: 13,
              cursor:
                page === totalPages ? "not-allowed" : "pointer",
              color: "var(--dash-text-secondary)",
              opacity: page === totalPages ? 0.4 : 1,
              fontFamily: "var(--dash-font)",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityLogRow({
  event,
  isLast,
  onClick,
}: {
  event: SecurityEvent;
  isLast: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isAws = event.ruleMatched.includes("AWS");
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast
          ? "none"
          : "1px solid var(--dash-border-light)",
        backgroundColor: hovered
          ? "var(--dash-bg-page)"
          : "transparent",
        cursor: "pointer",
        height: 44,
      }}
    >
      <td
        style={{
          padding: "0 16px",
          fontSize: 12,
          color: "var(--dash-text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {event.time}
      </td>
      <td
        style={{
          padding: "0 16px",
          fontSize: 13,
          color: "var(--dash-text-primary)",
          maxWidth: 260,
        }}
      >
        <span
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.description}
        </span>
      </td>
      <td style={{ padding: "0 16px" }}>
        <StatusBadge
          label={
            event.severity === "danger" ? "Critical" : "Warning"
          }
          severity={event.severity}
        />
      </td>
      <td
        style={{
          padding: "0 16px",
          fontSize: 12,
          color: "var(--dash-text-primary)",
          fontFamily: MONO,
        }}
      >
        {event.sourceIp}
      </td>
      <td
        style={{
          padding: "0 16px",
          fontSize: 12,
          color: "var(--dash-text-secondary)",
          fontFamily: MONO,
        }}
      >
        {event.targetEndpoint}
      </td>
      <td style={{ padding: "0 16px" }}>
        <CloudBadge variant={isAws ? "aws" : "azure"} />
      </td>
    </tr>
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