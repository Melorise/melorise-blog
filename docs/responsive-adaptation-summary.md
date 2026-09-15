# Responsive Adaptation Summary

This document summarizes the responsive layout changes made for the Nuxt blog.

## Goal

The project was originally desktop-oriented. The adaptation keeps the existing desktop visual style and component language, while making the same codebase usable on phones and tablets.

The current responsive model uses three ranges:

- `< 768px`: phone layout, with drawer navigation.
- `768px - 959px`: tablet layout, keeping the left sidebar while simplifying the home page content.
- `>= 960px`: desktop layout, keeping the original two-column home page.

## Global Layout

Updated the global width rules so mobile screens are no longer forced into horizontal scrolling.

- Removed mobile-blocking minimum widths from the root layout flow.
- Kept a `768px` baseline for tablet screens where the left sidebar is still visible.
- Kept the desktop `960px` baseline for the full desktop home layout.
- Made `.content-container` shrink on small screens.
- Slightly narrowed the effective mobile content width so content does not touch the viewport edges.

Relevant files:

- `app/assets/css/main.css`
- `app/layouts/default.vue`

## Navigation

The left sidebar is shown from `768px` upward.

For screens `< 768px`:

- The left sidebar is hidden.
- A menu icon button is shown in `BarHeader`.
- The mobile navigation opens as an Element Plus drawer.
- The drawer opens from the right side.
- The drawer reuses the existing `BarLeft` navigation content.
- Clicking a navigation link closes the drawer.

For screens `768px - 959px`:

- The left sidebar remains visible.
- The drawer menu button is hidden.
- The main content keeps the narrower tablet layout instead of switching to the full desktop home layout.

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

- From `960px` upward, the home page keeps the original `62.5% / 37.5%` split.
- Article/friend image panels remain visible.
- About/contact blocks stay in the right column.

Phone and tablet behavior below `960px`:

- Home page becomes a single-column layout.
- The article/friend image panels are hidden because navigation is already available from the phone drawer or tablet left sidebar.
- About/contact blocks remain visible below the latest articles.

This means tablets keep the global left sidebar, but the home page right-side content follows the mobile-style simplified flow.

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

The footer keeps the full navigation from `768px` upward.

For screens `< 768px`:

- The `报告内容问题` link is hidden to avoid overcrowding.
- The footer keeps the copyright text and the remaining links.

For screens `768px - 959px`, `报告内容问题` is shown again, matching the tablet layout request.

Relevant file:

- `app/components/bar/BarFooter.vue`

## Static Content Route Fix

Static article routes were normalized before content lookup so deployed URLs with or without trailing slashes, and URLs ending in `index.html`, resolve to the same content path.

Relevant file:

- `app/pages/[...slug].vue`

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
