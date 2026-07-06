Continue working in this same file, reusing the exact design system, components, and layout patterns already established on the Home and Cost screens — same sidebar, same top bar, same stat card style, same data table style, same AWS/Azure badge pills, same muted semantic colors (success #4D7C5F, warning #B8862E, danger #B8473F with their light tints), same typography scale and spacing system. Do not introduce new colors, new card styles, or a different visual language. These two new screens must look like they belong to the same product as Home and Cost.

Now design two new screens: Security Overview and Security Detail.

=== SCREEN 3: SECURITY OVERVIEW ===

Page title in top bar: "Security". Sidebar "Security" item is now active (replace the empty placeholder frame entirely with this real screen).

Add the same SECONDARY TAB BAR pattern used on the Cost screen (horizontal tabs, bottom border, active tab shows accent-colored text + 2px underline): tabs are "Overview" (active) and "Activity Log".

PAGE LAYOUT TOP TO BOTTOM:

Row 1 — Page-level date range filter, right-aligned, same pill dropdown style as elsewhere (options like "Last hour", "Last 24 hours", "Last 7 days", default to "Last 24 hours" for this screen since security data is more time-sensitive than monthly billing)

Row 2 — 4 stat cards in a row, equal width, 20px gap, same exact stat card component as Home/Cost screens:
  1. "Total requests" — large number e.g. 284,910, trend vs previous period
  2. "Blocked requests" — large number e.g. 1,284, trend vs previous period, trend arrow should use danger color if blocked count increased (more attacks = bad) and success color if decreased
  3. "Block rate" — percentage e.g. "0.45%", small text below stating whether this is within normal range, e.g. a small badge "Normal" in success tint, or "Elevated" in warning tint if you want to show that state instead — pick one for the sample data, do not show both
  4. "Active rules" — large number e.g. 18, no trend needed, small text below "All rules active" in text-secondary

Row 3 — Two cards side by side (60/40 split), same proportions as the Home screen's chart row:
  Left (60% width): Line/area chart card, title "Request volume", showing two lines over the selected time period — "Allowed" (accent blue) and "Blocked" (use the danger color #B8473F for this line specifically, since blocked requests are inherently a risk-related metric, not a neutral category like AWS/Azure) — legend dots in card header matching this color pairing
  Right (40% width): Horizontal bar chart card, title "Attack types", 5-6 bars showing attack categories sorted descending — sample categories: "SQL injection", "XSS", "Bot traffic", "Rate limit abuse", "Path traversal" — all bars in the danger color since these are all threat categories, varying only in length/value, with a 12px text-secondary label after each value (do NOT need cloud badges here, this is WAF-specific not AWS/Azure-specific)

Row 4 — Two cards side by side (50/50 split):
  Left: Data table card, title "Top blocked IPs", columns: IP address (use monospace font for this column specifically, e.g. "203.0.113.42"), Requests blocked, Last seen, Country (small text, no flag icon needed) — 6 rows visible, "View all" link at bottom matching existing table pattern
  Right: Data table card, title "Recent security events" — this should look and behave identically to the "Recent security alerts" table already on the Home screen (same columns: Alert description, Severity badge, Time) but with more rows (6 instead of 3) and a "View all" link, since this is the dedicated security page and should show more depth than the home page summary

Use realistic sample data: total requests in the hundreds of thousands per day range, block rate under 1% (this is realistic for WAF — do not inflate it to look more dramatic), IP addresses in standard dotted format, countries like "United States", "Germany", "Singapore", "Brazil" for variety.

=== SCREEN 4: SECURITY DETAIL (single event drill-down) ===

This screen represents what happens when a CEO or team member clicks a single row in the "Recent security events" table — it should be designed as a RIGHT-SIDE SLIDE-OVER PANEL, not a full new page, consistent with the panel-based drill-down pattern decided earlier for single alert/transaction lookups.

PANEL SPECIFICATIONS:
- Panel slides in from the right, 480px wide, full viewport height, white background, subtle left border or shadow-free divider line separating it from a dimmed/overlaid version of the Security Overview screen behind it (show the Security Overview screen behind the panel at reduced opacity, e.g. a semi-transparent dark overlay at 40% opacity, to indicate the panel is layered on top — do not use a blur effect)
- Panel header (64px tall, matches top bar height for visual consistency): small "X" close icon button on the left (20px, text-secondary), title "Security event" (16px medium) next to it, nothing on the right side of this header
- 24px padding throughout the panel content below the header

PANEL CONTENT TOP TO BOTTOM:
1. Severity badge at the top, larger than the table version (use the same danger-tint pill style but at 14px text instead of 12px), e.g. "● Critical"
2. Event title, 20px medium, e.g. "SQL injection attempt blocked"
3. Timestamp directly below in 14px text-secondary, e.g. "Today at 2:14 PM"
4. A horizontal divider line
5. A simple key-value detail list, each row: 12px uppercase text-secondary label on the left, 14px text-primary value on the right, rows for: "Source IP" (monospace font), "Target endpoint" (e.g. "/api/checkout"), "Rule matched" (e.g. "AWS-AWSManagedRulesSQLiRuleSet"), "Action taken" (e.g. "Blocked", shown as a small success-tint badge since blocking is the correct/good outcome), "Country", "Request method" (e.g. "POST")
6. A horizontal divider line
7. A small section labeled "Request details" (14px medium) followed by a read-only code-style block (monospace font, light gray background #F5F4F1, 8px radius, 12px padding) showing a short truncated sample of the request headers or payload — keep this brief, 4-5 lines of monospace text is enough to convey "raw technical detail is available here," it does not need to be a complete real HTTP request
8. At the bottom of the panel, a single secondary button (outlined style, not filled) reading "View full request log" — implies this would deep-link to a more technical view, but does not need to specify where

Keep the panel calm and information-dense but not cluttered — generous line spacing between the key-value rows (each row roughly 36px tall).

=== GENERAL INSTRUCTIONS ===

- Build Security Overview as a full page frame, same as Home and Cost
- Build Security Detail as a panel/overlay frame, clearly showing the dimmed Security Overview page behind it so it reads as a slide-over, not a standalone page
- Reuse the existing stat card, table, badge, and tab bar components exactly as built for Home and Cost — do not redraw them with any stylistic differences
- The danger color usage on this screen (blocked requests line, attack type bars) is intentional and different from the Home/Cost screens, where blue/purple were used for neutral AWS/Azure categorization — security threat data should read as risk-colored, cost data should not
- Do not add any new sidebar items, new top-level navigation, or features beyond what is specified above