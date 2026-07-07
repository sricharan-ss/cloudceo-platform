import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import { SpendTrendChart } from "./SpendTrendChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { MonthlyBreakdownTable } from "./MonthlyBreakdownTable";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useDateRange } from "../context/DateRangeContext";
import { PageSkeleton } from "./Skeleton";

type ViewMode = "combined" | "aws" | "azure";
type Tab = "overview" | "aws" | "azure";

const SERVICES_8 = [
  { label: "EC2", value: 12450, cloud: "aws" as const },
  { label: "Azure VM", value: 7340, cloud: "azure" as const },
  { label: "RDS", value: 6820, cloud: "aws" as const },
  {
    label: "Azure Storage",
    value: 4120,
    cloud: "azure" as const,
  },
  { label: "S3", value: 3210, cloud: "aws" as const },
  { label: "Cosmos DB", value: 3010, cloud: "azure" as const },
  { label: "Lambda", value: 2340, cloud: "aws" as const },
  {
    label: "Azure Functions",
    value: 1820,
    cloud: "azure" as const,
  },
];

// Abbreviated list for mobile stacked cards
const MONTHLY_ROWS = [
  { month: "Jun 2026", total: 42310, change: -10.2 },
  { month: "May 2026", total: 47100, change: 10.8 },
  { month: "Apr 2026", total: 42500, change: 6.5 },
  { month: "Mar 2026", total: 39900, change: 3.1 },
  { month: "Feb 2026", total: 38700, change: 6.6 },
  { month: "Jan 2026", total: 36300, change: -21.6 },
];

export function BillingOverview() {
  const bp = useBreakpoint();
  const [tab, setTab] = useState<Tab>("overview");
  const [view, setView] = useState<ViewMode>("combined");

  const isTablet = bp === "tablet";
  const isMobile = bp === "mobile";
  const { isLoading } = useDateRange();

  if (isLoading) return <PageSkeleton />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Secondary Tab Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--dash-border)",
          marginBottom: isTablet || isMobile ? 24 : 32,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {(["overview", "aws", "azure"] as Tab[]).map((t) => (
          <TabButton
            key={t}
            label={
              t === "overview"
                ? "Overview"
                : t === "aws"
                  ? "AWS"
                  : "Azure"
            }
            active={tab === t}
            onClick={() => setTab(t)}
          />
        ))}
      </div>

      {tab === "aws" && (
        <AwsTabContent
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}
      {tab === "azure" && (
        <AzureTabContent
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}

      {tab === "overview" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 20 : 32,
          }}
        >
          {/* Date filter — FIX 2: single clean button, no stray controls */}

          {/* Stat Cards — FIX 1: 2×2 grid on mobile, no horizontal scroll */}
          {isMobile ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--dash-mobile-card-gap)",
              }}
            >
              {/* FIX 3 — labelSize={11} prevents mid-word wrapping at 165px card width */}
              <StatCard
                labelSize={11}
                label="Current month spend"
                value="$42,310"
                trend={{
                  direction: "down",
                  percentage: "10.2%",
                  goodDirection: "down",
                }}
              />
              <StatCard
                labelSize={11}
                label="Previous month spend"
                value="$47,100"
                trend={{
                  direction: "up",
                  percentage: "10.8%",
                  label: "vs Apr",
                  goodDirection: "down",
                }}
              />
              <StatCard
                labelSize={11}
                label="AWS total"
                value="$27,840"
                trend={{
                  direction: "down",
                  percentage: "10.9%",
                  goodDirection: "down",
                }}
                badge={
                  <StatusBadge label="AWS" severity="success" />
                }
              />
              <StatCard
                labelSize={11}
                label="Azure total"
                value="$14,470"
                trend={{
                  direction: "down",
                  percentage: "9.0%",
                  goodDirection: "down",
                }}
                badge={
                  <StatusBadge
                    label="Azure"
                    severity="warning"
                  />
                }
              />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isTablet
                  ? "1fr 1fr"
                  : "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              <StatCard
                label="Current month spend"
                value="$42,310"
                trend={{
                  direction: "down",
                  percentage: "10.2%",
                  goodDirection: "down",
                }}
              />
              <StatCard
                label="Previous month spend"
                value="$47,100"
                trend={{
                  direction: "up",
                  percentage: "10.8%",
                  label: "vs Apr",
                  goodDirection: "down",
                }}
              />
              <StatCard
                label="AWS total"
                value="$27,840"
                trend={{
                  direction: "down",
                  percentage: "10.9%",
                  goodDirection: "down",
                }}
                badge={
                  <StatusBadge label="AWS" severity="success" />
                }
              />
              <StatCard
                label="Azure total"
                value="$14,470"
                trend={{
                  direction: "down",
                  percentage: "9.0%",
                  goodDirection: "down",
                }}
                badge={
                  <StatusBadge
                    label="Azure"
                    severity="warning"
                  />
                }
              />
            </div>
          )}

          {/* 12-month trend chart */}
          <SpendTrendChart
            months={12}
            view={view}
            chartHeight={isMobile ? 180 : 220}
            rightSlot={
              !isMobile ? (
                <SegmentedControl
                  value={view}
                  onChange={setView}
                />
              ) : undefined
            }
          />

          {/* Mobile: segmented control below chart */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SegmentedControl
                value={view}
                onChange={setView}
              />
            </div>
          )}

          {/* Cost by service + Monthly breakdown */}
          {isMobile ? (
            <>
              {/* Cost by service — full width */}
              <HorizontalBarChart
                title="Cost by service"
                items={SERVICES_8}
                labelWidth={110}
              />

              {/* Monthly breakdown — simplified stacked cards */}
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
                  Monthly breakdown
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--dash-space-sm)",
                  }}
                >
                  {MONTHLY_ROWS.map((row, i) => {
                    const down = row.change < 0;
                    const color = down
                      ? "var(--dash-success)"
                      : "var(--dash-danger)";
                    return (
                      <div
                        key={row.month}
                        style={{
                          backgroundColor:
                            "var(--dash-bg-surface)",
                          border:
                            "1px solid var(--dash-border)",
                          borderRadius:
                            "var(--dash-radius-card)",
                          padding: "var(--dash-space-md)",
                          minHeight: "var(--dash-touch-target)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: i === 0 ? 500 : 400,
                              color: "var(--dash-text-primary)",
                            }}
                          >
                            {row.month}
                            {i === 0 && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color:
                                    "var(--dash-text-muted)",
                                  marginLeft: 6,
                                }}
                              >
                                (current)
                              </span>
                            )}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--dash-text-primary)",
                              fontVariantNumeric:
                                "tabular-nums",
                            }}
                          >
                            ${row.total.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 2,
                            marginTop: 4,
                          }}
                        >
                          {down ? (
                            <ChevronDown
                              size={12}
                              color={color}
                            />
                          ) : (
                            <ChevronUp
                              size={12}
                              color={color}
                            />
                          )}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color,
                              fontVariantNumeric:
                                "tabular-nums",
                            }}
                          >
                            {Math.abs(row.change)}%
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--dash-text-muted)",
                              marginLeft: 2,
                            }}
                          >
                            vs prev month
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <HorizontalBarChart
                title="Cost by service"
                items={SERVICES_8}
                labelWidth={isTablet ? 100 : 120}
              />
              <MonthlyBreakdownTable compact={isTablet} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── AWS Tab ──────────────────────────────────────────────────── */

const AWS_SERVICES = [
  { label: "EC2", value: 12450, cloud: "aws" as const },
  { label: "RDS", value: 6820, cloud: "aws" as const },
  { label: "S3", value: 3210, cloud: "aws" as const },
  { label: "Lambda", value: 2340, cloud: "aws" as const },
  { label: "CloudFront", value: 920, cloud: "aws" as const },
  { label: "VPC", value: 430, cloud: "aws" as const },
];

const AWS_MONTHLY = [
  { month: "Jun 2026", aws: 27840, azure: 0 },
  { month: "May 2026", aws: 31200, azure: 0 },
  { month: "Apr 2026", aws: 28400, azure: 0 },
  { month: "Mar 2026", aws: 26100, azure: 0 },
  { month: "Feb 2026", aws: 25500, azure: 0 },
  { month: "Jan 2026", aws: 24200, azure: 0 },
];

function AwsTabContent({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const { preset } = useDateRange();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : 32,
        paddingTop: isMobile ? 0 : 4,
      }}
    >
      {/* AWS KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : isTablet
              ? "1fr 1fr"
              : "repeat(4, 1fr)",
          gap: isMobile ? "var(--dash-mobile-card-gap)" : 20,
        }}
      >
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="EC2 instances"
          value="$12,450"
          trend={{
            direction: "up",
            percentage: "8.2%",
            goodDirection: "down",
          }}
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="RDS databases"
          value="$6,820"
          trend={{
            direction: "up",
            percentage: "12.4%",
            goodDirection: "down",
          }}
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="S3 storage"
          value="$3,210"
          trend={{
            direction: "down",
            percentage: "5.8%",
            goodDirection: "down",
          }}
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="Lambda"
          value="$2,340"
          trend={{
            direction: "up",
            percentage: "3.1%",
            goodDirection: "down",
          }}
        />
      </div>

      {/* AWS spend chart */}
      <SpendTrendChart
        months={6}
        view="aws"
        chartHeight={isMobile ? 180 : 220}
      />

      {/* Service breakdown + per-service table */}
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns:
            isTablet || isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}
      >
        <HorizontalBarChart
          title="AWS service breakdown"
          items={AWS_SERVICES}
          labelWidth={isTablet ? 90 : 110}
        />
        <div
          style={{
            backgroundColor: "var(--dash-bg-surface)",
            border: "1px solid var(--dash-border)",
            borderRadius: "var(--dash-radius-card)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 24px 12px" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--dash-text-primary)",
                marginBottom: 16,
              }}
            >
              AWS services — {preset}
            </div>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--dash-border)",
                  borderTop:
                    "1px solid var(--dash-border-light)",
                }}
              >
                {["Service", "Cost", "% of AWS", "vs May"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 20px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--dash-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        textAlign:
                          h === "Service" ? "left" : "right",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {AWS_SERVICES.map((s, i) => {
                const pct = ((s.value / 27840) * 100).toFixed(
                  1,
                );
                const diffs = [8.2, 12.4, -5.8, 3.1, -2.1, 0];
                const diff = diffs[i];
                return (
                  <tr
                    key={s.label}
                    style={{
                      borderBottom:
                        i < AWS_SERVICES.length - 1
                          ? "1px solid var(--dash-border-light)"
                          : "none",
                      height: 48,
                    }}
                  >
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--dash-text-primary)",
                      }}
                    >
                      {s.label}
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 14,
                        color: "var(--dash-text-primary)",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${s.value.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 12,
                        color: "var(--dash-text-muted)",
                        textAlign: "right",
                      }}
                    >
                      {pct}%
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color:
                            diff < 0
                              ? "var(--dash-success)"
                              : "var(--dash-danger)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Azure Tab ────────────────────────────────────────────────── */

const AZURE_SERVICES = [
  { label: "Azure VM", value: 7340, cloud: "azure" as const },
  {
    label: "Azure Storage",
    value: 4120,
    cloud: "azure" as const,
  },
  { label: "Cosmos DB", value: 3010, cloud: "azure" as const },
  { label: "Functions", value: 1820, cloud: "azure" as const },
  { label: "App Service", value: 620, cloud: "azure" as const },
  { label: "Networking", value: 310, cloud: "azure" as const },
];

function AzureTabContent({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const { preset } = useDateRange();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : 32,
        paddingTop: isMobile ? 0 : 4,
      }}
    >
      {/* Azure KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : isTablet
              ? "1fr 1fr"
              : "repeat(4, 1fr)",
          gap: isMobile ? "var(--dash-mobile-card-gap)" : 20,
        }}
      >
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="Azure VMs"
          value="$7,340"
          trend={{
            direction: "down",
            percentage: "3.1%",
            goodDirection: "down",
          }}
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="Azure Storage"
          value="$4,120"
          trend={{
            direction: "up",
            percentage: "1.5%",
            goodDirection: "down",
          }}
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="Cosmos DB"
          value="$3,010"
          badge={
            <StatusBadge label="Stable" severity="success" />
          }
        />
        <StatCard
          labelSize={isMobile ? 11 : 12}
          label="Functions"
          value="$1,820"
          trend={{
            direction: "up",
            percentage: "5.3%",
            goodDirection: "down",
          }}
        />
      </div>

      {/* Azure spend chart */}
      <SpendTrendChart
        months={6}
        view="azure"
        chartHeight={isMobile ? 180 : 220}
      />

      {/* Service breakdown + per-service table */}
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : undefined,
          gridTemplateColumns:
            isTablet || isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}
      >
        <HorizontalBarChart
          title="Azure service breakdown"
          items={AZURE_SERVICES}
          labelWidth={isTablet ? 100 : 120}
        />
        <div
          style={{
            backgroundColor: "var(--dash-bg-surface)",
            border: "1px solid var(--dash-border)",
            borderRadius: "var(--dash-radius-card)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 24px 12px" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--dash-text-primary)",
                marginBottom: 16,
              }}
            >
              Azure services — {preset}
            </div>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--dash-border)",
                  borderTop:
                    "1px solid var(--dash-border-light)",
                }}
              >
                {[
                  "Service",
                  "Cost",
                  "% of Azure",
                  "vs May",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 20px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--dash-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      textAlign:
                        h === "Service" ? "left" : "right",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AZURE_SERVICES.map((s, i) => {
                const pct = ((s.value / 14470) * 100).toFixed(
                  1,
                );
                const diffs = [-3.1, 1.5, 0, 5.3, -1.2, 2.8];
                const diff = diffs[i];
                return (
                  <tr
                    key={s.label}
                    style={{
                      borderBottom:
                        i < AZURE_SERVICES.length - 1
                          ? "1px solid var(--dash-border-light)"
                          : "none",
                      height: 48,
                    }}
                  >
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--dash-text-primary)",
                      }}
                    >
                      {s.label}
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 14,
                        color: "var(--dash-text-primary)",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ${s.value.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        fontSize: 12,
                        color: "var(--dash-text-muted)",
                        textAlign: "right",
                      }}
                    >
                      {pct}%
                    </td>
                    <td
                      style={{
                        padding: "0 20px",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color:
                            diff < 0
                              ? "var(--dash-success)"
                              : diff === 0
                                ? "var(--dash-text-muted)"
                                : "var(--dash-danger)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {diff === 0
                          ? "—"
                          : `${diff > 0 ? "+" : ""}${diff}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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

function SegmentedControl({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const options: { key: ViewMode; label: string }[] = [
    { key: "combined", label: "Combined" },
    { key: "aws", label: "AWS only" },
    { key: "azure", label: "Azure only" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #E5E3DE",
        borderRadius: 999,
        padding: 3,
        gap: 2,
        backgroundColor: "#F5F4F1",
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            padding: "4px 12px",
            borderRadius: 999,
            border:
              value === opt.key
                ? "1px solid #E5E3DE"
                : "1px solid transparent",
            backgroundColor:
              value === opt.key ? "#FFFFFF" : "transparent",
            color: value === opt.key ? "#1C1B19" : "#6B6A64",
            fontSize: 12,
            fontWeight: value === opt.key ? 500 : 400,
            cursor: "pointer",
            transition: "all 0.12s ease",
            whiteSpace: "nowrap",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}