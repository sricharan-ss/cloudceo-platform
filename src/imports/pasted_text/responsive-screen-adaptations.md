Continue in this same file. Create responsive versions of the existing Home and Cost screens at two additional breakpoints: mobile (375px width, standard iPhone frame) and tablet (768px width, standard iPad portrait frame). Reuse the exact same design system already established — same colors, typography, spacing units, card styles, and sample data values as the desktop versions. Do not invent new components; adapt the existing ones to each breakpoint following the rules below.

=== BREAKPOINT RULES (apply to both Home and Cost) ===

NAVIGATION
- Mobile (375px): Replace the left sidebar entirely with a fixed bottom tab bar, 56px tall, white background, top border. 4 tab items evenly spaced: Home, Cost, Security, Settings — each a 20px icon above a 10px label, active tab in accent blue (icon + label), inactive tabs in text-secondary. The top bar simplifies to just the page title (16px medium) on the left and the user avatar (28px) on the right — remove the date range picker and notification bell from the top bar on mobile; the date range picker moves to be the first element in the scrollable content area instead, notification bell moves into Settings or is dropped for this phase.
- Tablet (768px): Keep the left sidebar but collapse it to icon-only, 64px wide — icons centered, no text labels, active item still shows the accent-tinted background and left border indicator, just without the label text. Top bar stays full width with all elements (title, date picker, bell, avatar) but the date picker may need to shrink — show just a calendar icon if "This month" text doesn't fit comfortably with 16px padding.
- Desktop (1440px, already built): No changes, this stays as-is for reference.

STAT CARDS (Total cloud spend, Projected month-end, Blocked threats, Open alerts on Home; Current/Previous/AWS/Azure totals on Cost)
- Mobile (375px): Single row, horizontal scroll — cards are 160px wide each, full card height as on desktop, with 12px gap between cards and 16px padding on the left edge of the scroll container so the first card isn't flush against the screen edge. Add a subtle visual cue that more content exists to the right — either a slight peek of the next card's edge being visible, or omit if the design feels clear enough without it.
- Tablet (768px): 2x2 grid, two cards per row, same card component as desktop just narrower (each card roughly 340px wide), 20px gap maintained both horizontally and vertically between the 4 cards.
- Desktop (1440px, already built): 4 cards in one row, no changes.

CHARTS AND SIDE-BY-SIDE CARDS (Cloud spend trend + AWS vs Azure on Home; 12-month trend, Cost by service + Monthly breakdown on Cost)
- Mobile (375px): Every card in these rows stacks to full width, one per row, in this priority order top to bottom: primary trend/line chart first, then secondary comparison chart, then tables last. Reduce chart height to roughly 200px on mobile (vs the larger desktop chart height) to keep vertical scrolling reasonable. X-axis labels on charts may need to show fewer tick marks (e.g. every other month) to avoid crowding at this width.
- Tablet (768px): The 60/40 split (Cloud spend trend + AWS vs Azure on Home) stacks to full width, one per row — at 768px there usually isn't enough room for a meaningful 60/40 split. The 50/50 splits (Top 5 services + Recent security alerts on Home; Cost by service + Monthly breakdown on Cost) can stay side by side if each half is at least 340px wide, otherwise also stack to full width — use your judgment based on whether the table columns remain legible at that width.
- Desktop (1440px, already built): No changes.

DATA TABLES (Top 5 services by cost, Recent security alerts on Home; Cost by service bar chart stays a chart not a table, Monthly breakdown on Cost)
- Mobile (375px): Convert each table to a stacked card list instead of a literal table grid — one card per row of data, white background, 1px border, 12px radius, 12px padding, 8px gap between cards. Inside each card: the two most important fields shown prominently (e.g. for "Top 5 services": service name in 14px medium on the left, monthly cost in 14px medium tabular figures on the right, same row) with secondary fields below in smaller 12px text-secondary (e.g. cloud badge and trend percentage on a second line within the same card). Do not attempt to render the full multi-column table at this width — it will not be legible.
- Tablet (768px): Keep the table format but reduce to the 3 most important columns only, dropping the least critical column from each table (e.g. on "Top 5 services by cost", keep Service, Monthly cost, Trend — drop the Cloud badge column, or move it inline next to the service name as a small icon instead of a separate column).
- Desktop (1440px, already built): Full table with all columns, no changes.

=== GENERAL INSTRUCTIONS ===

- Build 4 new frames total: Home (mobile), Home (tablet), Cost (mobile), Cost (tablet). Desktop versions of both screens already exist and should not be modified.
- Use the same sample data values already used in the desktop Home and Cost screens (e.g. $42,310 total spend, EC2 at $12,450, etc.) so all breakpoints represent the same underlying state — do not invent new numbers.
- Keep the muted semantic color system, typography scale, and 8px spacing grid identical across all breakpoints — only layout and component arrangement should change, not the visual language itself.
- On mobile specifically, increase touch target sizes slightly versus desktop where needed — bottom tab bar items, any tappable card, and table-list-card rows should have a minimum tappable height of 44px, consistent with standard mobile accessibility guidance.
- Do not add new pages, new nav items, or new features at any breakpoint — this is purely a layout adaptation of the two existing screens.