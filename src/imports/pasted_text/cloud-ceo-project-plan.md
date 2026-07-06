Continue the existing CloudCEO project.

IMPORTANT

Do NOT redesign the application.

Do NOT change the current visual language.

Do NOT change colors, typography, spacing, icons, cards or layout style.

Reuse every existing component.

Treat CloudCEO as a production enterprise SaaS application, not a collection of mockup screens.

Your objective is to complete the application's navigation system, responsive behaviour and interaction foundation.

---------------------------------------------------------

FIRST

Review every existing screen.

Find inconsistencies between Desktop, Tablet and Mobile.

Correct them while preserving the design language.

---------------------------------------------------------

TOP HEADER

The header must become a reusable component across every page.

Desktop

Cloud selector (future ready)

Date range selector

Notifications

Profile Avatar

Tablet

Compact layout

Responsive spacing

Mobile

Responsive top bar

Notification icon MUST remain visible.

Profile avatar MUST remain visible.

Date selector must remain accessible.

Nothing should disappear because of screen size.

Do not hide important actions.

Instead redesign the layout intelligently.

---------------------------------------------------------

DATE RANGE PICKER

Currently there are inconsistent filters.

For example

"This Month"

"Last 24 Hours"

Some pages have one.

Some pages have both.

Design a consistent filtering system.

Global Date Range

Top Header

Controls entire dashboard

Local Filters

Inside individual pages

Example

Security

Last Hour

Last 24 Hours

Last 7 Days

This Month

Custom

Cost

This Month

Last Month

Quarter

Year

Custom

Prototype every interaction.

Dropdown

Apply

Cancel

Custom calendar

Hover

Selected

---------------------------------------------------------

NOTIFICATION CENTER

The bell icon must open a fully designed Notification Center.

Design

Desktop

Right slide-over

Tablet

Drawer

Mobile

Full screen page

Notification categories

All

Unread

Billing

Security

Critical

Sync

Notification card

Icon

Title

Description

Timestamp

Status

Actions

Mark as read

View Details

Delete

Mark all read

Notification settings

Every notification should navigate somewhere.

---------------------------------------------------------

PROFILE

Clicking the avatar opens

My Profile

Organization

Preferences

Security

API Access

Help

Logout

Create every destination screen.

Profile page

Edit profile

Recent activity

Connected cloud accounts

Organization

Members

Roles

Workspace

Billing owner

Preferences

Theme

Language

Timezone

Security

Password

Sessions

MFA

API Access

Tokens

Permissions

---------------------------------------------------------

SIDEBAR

Desktop

Fixed

Tablet

Collapsible

Mobile

Bottom Navigation

Do NOT use the desktop sidebar on phones.

Bottom Navigation should contain

Home

Cost

Security

Notifications

Settings

If notifications remain in top bar, show badge count.

---------------------------------------------------------

RESPONSIVE RULES

Review every page.

Desktop

1440

Laptop

1280

Tablet

1024

Mobile

390

Fix

Spacing

Grid

Cards

Charts

Tables

Forms

Dialogs

Navigation

Overflow

No clipped content.

No disappearing icons.

No horizontal scrolling.

---------------------------------------------------------

TABLES

Desktop

Normal Table

Tablet

Compact Table

Mobile

Cards

Accordion

NOT horizontal scrolling.

---------------------------------------------------------

CHARTS

Charts must resize properly.

Maintain readability.

Legends move below charts on mobile.

Tooltips remain usable.

---------------------------------------------------------

AWS / AZURE TABS

Currently AWS and Azure tabs only switch labels.

This is incorrect.

Design complete dedicated pages.

AWS Page

AWS Summary

AWS Billing

Services

EC2

S3

Lambda

RDS

Networking

Optimization

Recommendations

Azure Page

Azure Summary

Billing

VM

Storage

Functions

Networking

WAF

Recommendations

Each page should have unique charts.

Unique tables.

Unique KPIs.

Unique filters.

Unique drill-downs.

---------------------------------------------------------

SECURITY

The Activity Log tab is almost empty.

Design a complete enterprise activity log.

Timeline

Search

Filter

Severity

Cloud

Export

Pagination

Open Incident

Open User

Open Resource

Every row should open the existing Security Drawer.

---------------------------------------------------------

PROTOTYPE

Everything should work.

Profile

Notifications

Date Picker

Sidebar

Bottom Navigation

Tabs

Tables

Charts

Cards

Security Events

Breadcrumbs

Settings

Prototype every interaction.

---------------------------------------------------------

QUALITY

Think like the Lead Product Designer at Microsoft Azure.

Do not create disconnected screens.

Build a connected enterprise SaaS application.

Every visible UI element must have a purpose.

Every clickable component must lead somewhere.

The final result should feel like a real product ready for development.