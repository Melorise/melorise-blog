# Responsive Adaptation Summary

This document summarizes the responsive layout changes made for the Nuxt blog.

## Goal

The project was originally desktop-oriented. The adaptation keeps the existing desktop visual style and component language, while making the same codebase usable on narrower screens.

The main breakpoint is `960px`:

- `>= 960px`: keep the original desktop layout.
- `< 960px`: switch to a mobile/tablet layout.

## Global Layout

Updated the global width rules so mobile screens are no longer forced into horizontal scrolling.

- Removed mobile-blocking minimum widths from the root layout flow.
- Kept the desktop `960px` baseline for large screens.
- Made `.content-container` shrink on small screens.
- Slightly narrowed the effective mobile content width so content does not touch the viewport edges.

Relevant files:

- `app/assets/css/main.css`
- `app/layouts/default.vue`

## Navigation

The desktop left sidebar remains unchanged for screens `>= 960px`.

For screens `< 960px`:

- The left sidebar is hidden.
- A menu icon button is shown in `BarHeader`.
- The mobile navigation opens as an Element Plus drawer.
- The drawer opens from the right side.
- The drawer reuses the existing `BarLeft` navigation content.
- Clicking a navigation link closes the drawer.

Relevant files:

- `app/layouts/default.vue`
- `app/components/bar/BarHeader.vue`
- `app/components/bar/BarLeft.vue`

## Header

The mobile menu button was moved into the header rather than appearing as a separate content bar.

The header title/logo group was aligned with the main content container so the mobile header and content start from the same left edge.

Relevant file:

- `app/components/bar/BarHeader.vue`

## Home Page

The original `BarRight` component was only used by the home page, so it was folded into `app/pages/index.vue`.

Desktop behavior:

- Home page keeps the original `62.5% / 37.5%` split.
- Article/friend image panels remain visible.
- About/contact blocks stay in the right column.

Mobile behavior:

- Home page becomes a single-column layout.
- The article/friend image panels are hidden because the drawer already provides navigation to those sections.
- About/contact blocks remain visible below the latest articles.

Relevant files:

- `app/pages/index.vue`
- `app/components/bar/BarRight.vue` was removed.

## Article Lists

Article list rows were adjusted for narrow screens.

- Reduced horizontal padding on small screens.
- Kept titles truncating cleanly.
- Prevented the date from squeezing the title too aggressively.

The article index page also changes from two columns to one column below `960px`.

Relevant files:

- `app/components/ArticleList.vue`
- `app/pages/article/index.vue`

## Content Pages

Article and regular content pages now use tighter mobile content spacing.

For screens `< 960px`:

- `.heti` content margins are reduced.
- Images can expand to the full available content width.
- Tables become horizontally scrollable instead of forcing the whole page wider.

Relevant file:

- `app/assets/index.scss`

## Footer

The footer keeps the full desktop navigation on wide screens.

For screens `< 960px`:

- The `报告内容问题` link is hidden to avoid overcrowding.
- The footer keeps the copyright text and `返回首页`.

Relevant file:

- `app/components/bar/BarFooter.vue`

## Verification

During implementation, these routes were checked:

- `/`
- `/article`
- `/article/tech`
- `/article/tech/2025-11-18-test`

Static generation was also checked with:

```bash
pnpm exec nuxi generate
```

The static output is expected under:

```text
.output/public
```
