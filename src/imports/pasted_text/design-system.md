You are designing a premium enterprise SaaS web application: a CEO Cloud Dashboard that aggregates AWS and Azure billing and Azure WAF security data into one interface. The audience is C-suite executives (CEO, CFO) who need to understand cloud spend and security posture in under 30 seconds, without engineering knowledge. Design quality should match Stripe Dashboard, Linear, Vercel Analytics, and Datadog — calm, confident, information-dense but never cluttered.

=== DESIGN SYSTEM (apply identically across every screen) ===

COLOR PALETTE
- Background (page): #FAFAF9 (warm off-white, light mode)
- Surface (cards): #FFFFFF
- Border: #E5E3DE (hairline, 1px)
- Border strong (hover/focus): #D1CFC8
- Text primary: #1C1B19
- Text secondary: #6B6A64
- Text muted: #9C9A92
- Accent (primary actions, links, active nav): #3B5BDB (muted enterprise blue, not bright/electric)
- Semantic success (healthy/under budget): #4D7C5F (muted desaturated green, NOT bright green)
- Semantic warning (approaching threshold): #B8862E (muted amber/ochre, NOT bright orange)
- Semantic danger (over budget/critical/attack): #B8473F (muted brick red, NOT bright red)
- Each semantic color needs a light tint for backgrounds: success tint #EDF3EE, warning tint #FAF1E2, danger tint #F8EBEA
- Do NOT use bright saturated red/green/amber anywhere — this is a calm enterprise tool, not a consumer app. Think "muted sage and clay" rather than "traffic light."

TYPOGRAPHY
- Font: Inter (or system equivalent if Inter unavailable)
- Type scale: 12px (labels, captions) / 14px (body, table text) / 16px (card subtitles) / 20px (section headers) / 28px (large stat numbers) / 32px (hero stat number, used once per page max)
- Weights: 400 regular for body text, 500 medium for labels and headers, 600 semibold ONLY for the single most important number on a page
- All dollar amounts and numeric data use tabular figures (numbers must align in columns)
- Sentence case for all UI text — never Title Case, never ALL CAPS except tiny badge labels at 10-11px

SPACING SYSTEM
- Base unit: 8px
- Card internal padding: 24px
- Gap between cards in a grid: 20px
- Gap between major page sections: 32px
- Sidebar width: 240px expanded
- Top bar height: 64px

CORNER RADIUS
- Cards: 12px
- Buttons, inputs, badges: 8px
- Small pills/tags: fully rounded (pill shape)

SHADOWS
- Cards at rest: none, just the 1px border (flat, not floating)
- Cards on hover (if interactive): subtle 1px border color shift to Border Strong only, no drop shadow
- Avoid all gradients, glows, and heavy shadows — flat and calm throughout

=== LAYOUT STRUCTURE (applies to every screen) ===

LEFT SIDEBAR (240px, fixed, full height, background #FFFFFF with right border #E5E3DE)
- Top: small company/product logo mark + wordmark, 64px tall header zone matching top bar height
- Navigation items, each 44px tall, 16px horizontal padding, icon (20px, outline style) + label (14px medium):
  1. Home (icon: layout-dashboard) — currently ACTIVE state for this screen
  2. Cost (icon: chart-bar) — currently ACTIVE state for the Billing Overview screen
  3. Security (icon: shield)
  4. Settings (icon: settings), pinned near bottom
- Active nav item: accent-tinted background (#EEF1FC), accent-colored text and icon, small 3px accent-colored left border strip (square corners, no radius on this strip)
- Inactive nav items: text secondary color, transparent background, icon outline style
- Hover state on inactive items: subtle background #F5F4F1

TOP BAR (64px tall, full width minus sidebar, background #FFFFFF, bottom border #E5E3DE)
- Left side: breadcrumb-style page title (20px medium, e.g. "Home" or "Cost")
- Right side, in this order: date range selector (pill-shaped dropdown button, options like "This month", shows a calendar icon + current selection + chevron-down), then a vertical divider, then a bell/notification icon button (20px, with a small red dot badge if there are unread alerts, no number unless count is under 10), then a vertical divider, then a circular user avatar (32px) with name truncated next to it on hover only

MAIN CONTENT AREA
- Background #FAFAF9
- 32px padding on all sides
- Max content width 1280px, centered if viewport is wider
- Content organized in a 12-column grid for card layout flexibility

=== CORE REUSABLE COMPONENTS (design these once, they appear on every screen) ===

1. STAT CARD
   - White card, 12px radius, 1px border, 24px padding
   - Top row: small label in text-secondary 12px uppercase-tracking (e.g. "TOTAL CLOUD SPEND"), optional small icon top-right (16px, muted)
   - Main number: 28px semibold, text-primary, tabular figures (e.g. "$42,310")
   - Below number: small trend row — a tiny up or down chevron arrow (12px) in semantic color (green chevron+text if cost decreased, red chevron+text if increased, since for cost a decrease is good), followed by percentage change (12px medium) and "vs last month" in text-muted (12px regular)
   - Entire card is clickable (subtle hover border-strong transition), implies navigation to a detail page

2. LINE/AREA CHART CARD
   - White card, 12px radius, 1px border, 24px padding
   - Header row: chart title (16px medium) on left, small filter/legend on right if multiple series (e.g. two small dots + labels: accent blue dot "AWS", a secondary muted purple dot "Azure")
   - Chart area: clean line chart, 2px line stroke, subtle area fill below the line at 8% opacity of the line color, gridlines very light (#F0EFEB), Y-axis labels in text-muted 11px, X-axis shows month abbreviations
   - No 3D effects, no heavy gridlines, generous whitespace around the plot

3. HORIZONTAL BAR CHART CARD (for cost-by-service or AWS vs Azure comparison)
   - White card, 12px radius, 1px border, 24px padding
   - Title at top (16px medium)
   - Each bar: label on left (14px, fixed-width column so bars align), bar itself with rounded right end only, value at right end of bar in tabular figures (12px medium)
   - Bars sorted descending by value, use accent blue for primary series, muted purple-gray (#8B85B8) for secondary series if comparing two things
   - Bar height 28px, 8px gap between bars

4. DATA TABLE
   - White card wrapping the table, 12px radius, 1px border
   - Header row: 12px uppercase text-secondary labels, bottom border, 44px tall, sortable columns show a small chevron icon next to the label
   - Data rows: 14px text-primary, 48px tall, bottom border #F0EFEB (lighter than card border) between rows, last row no bottom border
   - Numeric columns right-aligned with tabular figures
   - Row hover: subtle background #FAFAF9
   - Max 6 rows visible before a "View all" link (14px accent color) at the bottom of the card
   - Trend indicators inline in a column: small colored chevron + percentage, not a separate visual column

5. STATUS BADGE / PILL
   - Small pill, 8px horizontal padding, 4px vertical padding, pill-shaped (full radius)
   - Background = semantic tint color, text = semantic dark color (use the 800-level shade of that semantic color, not the base), 12px medium text
   - Always paired with a tiny dot icon (6px circle, semantic base color) before the text, never color alone — examples: "● Healthy" in success tint, "● Critical" in danger tint

6. EMPTY STATE (for when a cloud isn't connected yet)
   - Centered within the card area, generous padding (48px)
   - Small muted icon (32px, text-muted color) above
   - 16px medium text-primary: short headline like "AWS not connected"
   - 14px text-secondary: one-line explanation
   - Small accent-colored button below: "Connect AWS"

7. LOADING SKELETON
   - Same card shape and dimensions as the real component
   - Light gray (#F0EFEB) rounded rectangle placeholders matching where the number/chart/table rows will appear
   - Subtle shimmer animation left to right

=== SCREEN 1: DASHBOARD HOME ===

Page title in top bar: "Home". Sidebar "Home" item is active.

PAGE LAYOUT TOP TO BOTTOM:

Row 1 — KPI Stat Cards (4 cards in a row, equal width, 20px gap):
  1. "Total cloud spend" — large number e.g. $42,310, trend vs last month
  2. "Projected month-end" — large number e.g. $48,900, small text below trend row saying "On track" in success badge style if under typical budget pace, or "Trending over" in warning badge style — use your judgment on sample data to show ONE of these states, not both
  3. "Blocked threats (7d)" — large number e.g. 1,284, trend vs previous 7 days
  4. "Open security alerts" — large number e.g. 3, NO trend arrow needed (use a small severity badge instead, e.g. "1 critical" in danger tint pill)

Row 2 — Two cards side by side (60/40 split):
  Left (60% width): Line/area chart card, title "Cloud spend trend", showing AWS line (accent blue) and Azure line (muted purple-gray) over last 6 months, legend dots in header
  Right (40% width): Horizontal bar chart card, title "AWS vs Azure", two bars only, one per cloud, showing current month totals

Row 3 — Two cards side by side (50/50 split):
  Left: Data table card, title "Top 5 services by cost", columns: Service name, Cloud (small badge: AWS or Azure), Monthly cost, Trend
  Right: Data table card, title "Recent security alerts", columns: Alert description, Severity (badge: critical/warning), Time, with each row clickable implying it opens a detail panel

Use realistic sample data throughout: cloud spend in the $30,000-$50,000/month range, service names like "EC2", "S3", "RDS", "Azure VM", "Azure Storage", "Cosmos DB", security alert descriptions like "Unusual traffic spike from single IP", "SQL injection attempt blocked", "Rate limit exceeded on /api/checkout".

=== SCREEN 2: BILLING OVERVIEW (Cost section landing page) ===

Page title in top bar: "Cost". Sidebar "Cost" item is active.

Below the top bar, add a SECONDARY TAB BAR (not sidebar, a horizontal tab row, 48px tall, bottom border, white background): tabs are "Overview" (active), "AWS", "Azure" — these are simple text tabs with active tab showing accent-colored text and a 2px accent underline, inactive tabs in text-secondary.

PAGE LAYOUT TOP TO BOTTOM:

Row 1 — Page-level date range filter, right-aligned, same pill dropdown style as the top bar one (this one scoped to "Cost" section specifically, can show options like custom date range)

Row 2 — 4 stat cards in a row, equal width, 20px gap:
  1. "Current month spend" — total across both clouds
  2. "Previous month spend" — for comparison
  3. "AWS total" — this month, small "AWS" badge in card header
  4. "Azure total" — this month, small "Azure" badge in card header

Row 3 — Full-width line/area chart card, title "12-month cost trend", AWS and Azure lines, longer time range than the home page chart, with a small toggle in the card header to switch between "Combined" / "AWS only" / "Azure only" view (simple 3-option segmented control, pill-shaped container with the active option in white background and a subtle shadow-free border, inactive options transparent)

Row 4 — Two cards side by side (50/50):
  Left: Horizontal bar chart, title "Cost by service", top 8 services across both clouds, AWS services in accent blue bars, Azure services in muted purple-gray bars, sorted descending by cost
  Right: Data table, title "Monthly breakdown", columns: Month, AWS cost, Azure cost, Total, Change — showing last 6 months as rows, most recent month at top

Use the SAME sample data conventions as Screen 1 for consistency (same dollar ranges, same service names) so the two screens feel like one connected product when reviewed together.

=== GENERAL INSTRUCTIONS ===

- Build both screens as separate frames/pages within the same Figma file so the design system (colors, components, sidebar, top bar) is literally shared and reused, not redrawn per screen
- Desktop web layout, 1440px frame width
- Use real Figma components/variants for the stat card, table row, badge, and nav item so they can be reused consistently when we design Cost Detail, Security, and Settings screens next
- Keep visual density moderate — generous whitespace, this is a tool used by executives who value clarity over density
- Do not add any features, pages, or nav items beyond what is specified above