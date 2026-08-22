# Warhounds GSC, Indexing, Content, and Ads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Warhounds search-intent coverage and crawl signals, and place consent-gated Adsterra inventory on every public HTML content page.

**Architecture:** Keep the current content registry and page templates. Add one consolidated trainer/cheats guide, extend the existing route and homepage registries, introduce one reusable non-guide ad component, and preserve canonical redirects while improving sitemap freshness and post-deploy indexing verification.

**Tech Stack:** Next.js 16.3 App Router, React 19, MDX, next-intl, Zod, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-gsc-indexing-content-ads-design.md`

## Global Constraints

- Use only Warhounds-specific evidence.
- Keep analytics and Adsterra consent-gated.
- Keep HTTP/www variants redirected to `https://warhoundsguide.online`.
- Do not change DNS, nameservers, Cloudflare, AdSense serving, or other sites.
- Record Adult Ads as blocked unless Adsterra exposes an enabled control.

---

### Task 1: Search-intent content

**Files:**
- Create: `content/guides/en/trainer-cheats.mdx`
- Modify: `messages/en.json`, `components/home-content.tsx`, `lib/site.ts`
- Test: `tests/content/content-registry.test.ts`, `tests/seo/indexing.test.ts`

- [x] Write failing tests for the consolidated route, homepage entry, canonical, sitemap, and evidence metadata.
- [x] Run the focused tests and confirm they fail because `/trainer-cheats` is absent.
- [x] Add the evidence-bounded guide and route/library entries.
- [x] Run focused tests and confirm they pass.

### Task 2: Canonical crawl signals

**Files:**
- Modify: `app/sitemap.ts`, `tests/seo/indexing.test.ts`

- [x] Write a failing test for fixed, truthful 2026-08-22 sitemap freshness and canonical-only host output.
- [x] Run the test and confirm the stale 2026-08-12 value fails.
- [x] Update static and content timestamps without request-time dates.
- [x] Run focused tests and confirm they pass.

### Task 3: Ads on all public content pages

**Files:**
- Create: `components/site-page-ad.tsx`
- Modify: `components/home-content.tsx`, `components/information-page.tsx`, `components/legal-page.tsx`, `lib/consent.ts`, `lib/legal-content.ts`
- Test: `tests/components/site-page-ad.test.tsx`, `tests/integration/adsterra-routes.test.ts`

- [x] Write failing tests requiring one consent-gated ad on Home, About, Contact, Privacy, and Terms while keeping 404/robots/sitemap ad-free.
- [x] Run focused tests and confirm the non-guide pages fail the new contract.
- [x] Add the shared placement and update disclosure copy.
- [x] Run focused tests and confirm they pass.

### Task 4: Release and external verification

**Files:**
- Create: `docs/reports/2026-08-22-gsc-indexing-content-ads-report.md`

- [x] Run the complete test, lint, typecheck, build, and diff checks.
- [ ] Commit and push the authorized branch.
- [ ] Deploy through the repository's existing Vercel production workflow without DNS changes.
- [ ] Verify canonical routes, redirects, robots, sitemap, links, GA ID, and ad behavior online.
- [ ] Use GSC URL inspection/validation for canonical content pages and record accepted actions separately from eventual indexing.
- [ ] Record successful work and provider/external blockers without inventing completion.
