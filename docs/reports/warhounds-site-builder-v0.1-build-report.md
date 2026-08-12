# Warhounds Site Builder v0.1 Build Report

Prepared August 12, 2026 for the `warhounds-preview-20260812` run family.
The exact terminal Git commit, Vercel deployment ID, Preview URL, and final
readiness event are recorded in the Factory run ledger after this report file is
committed. No Production release or target-domain binding is authorized by this
report.

## 1. Project and publication identity

- Project path: `/Users/chenchen/Documents/ChatGPT/warhoundsguide`
- Repository: `https://github.com/lew593963-blip/warhoundsguide`
- Repository visibility: public
- Branch: `main`
- Game: Warhounds
- Steam App ID: `3929470`
- Target production domain: `warhoundsguide.online`
- Canonical origin: `https://warhoundsguide.online`
- Human Gate 1: `GO`
- Domain ownership: `CONFIRMED`
- Run mode: `AUTONOMOUS_PREVIEW`

## 2. Page Matrix

| Priority | Query | Route | Result |
| --- | --- | --- | --- |
| P0 | warhounds beginner guide | `/beginner-guide` | Pilot generated |
| P0 | warhounds best classes | `/squad-guide` | merged into squad guide |
| P0 | warhounds best squad | `/squad-guide` | generated |
| P0 | warhounds base upgrades | `/base-upgrades` | generated |
| P0 | warhounds weapons guide | `/weapons-guide` | generated |
| P1 | warhounds mission walkthrough | — | deferred; current mission evidence insufficient |
| P1 | warhounds combat guide | `/weapons-guide` | merged into weapons guide |

The launch batch contains four guide pages. It does not manufacture a mission
walkthrough or split overlapping class/combat intent into thin pages.

## 3. Pilot and machine gate

The Pilot was `/beginner-guide`. Its deterministic score was 390: P0 weight 200,
evidence 95, hub value 100, and cannibalization risk 5. It was selected because
it is the strongest internal-link hub and exercises the complete evidence,
content, SEO, template, and QA path before specialist pages.

Pilot QA passed on attempt 1. Evidence schema, claim lineage, SEO alignment,
intent fulfillment, internal links, thin-content prevention, and prior-site
residue checks passed. The machine gate then recorded
`PILOT_QA_PASS → BATCH_AUTHORIZED` without another human approval.

## 4. Generated pages and research artifacts

- `/beginner-guide`
- `/squad-guide`
- `/base-upgrades`
- `/weapons-guide`

Every generated guide has its own `evidence-pack.json`, `official.md`, `gaps.md`,
`page-plan.md`, and `seo-brief.md` under `research/<page-id>/`. Each MDX page
references only claim IDs in its own Evidence Pack. Sources prioritize the
official Steam listing and official Warhounds site. Unsupported numerical tiers,
hidden formulas, exact mission steps, and invented upgrade orders were excluded.

## 5. Root Config and technical identity

- Site name: Warhounds Guide
- Canonical origin: `https://warhoundsguide.online`
- Developer: Everplay DMCC
- Publisher: Brightika, Inc.
- Release date: August 11, 2026
- Platform: Windows PC / Steam
- Brand assets: `/brand/warhounds-mark.svg`, `/brand/warhounds-og.svg`
- Legal identity: independent fan-made guide; no official affiliation claim
- Analytics: disabled
- AdSense: disabled
- Adsterra: disabled
- Inherited analytics or advertising IDs: none

The technical runtime is materialized from Game Guide Template commit
`80580d50bed7fe7f361b939451e48237b87b2b90`, with Warhounds-specific config,
brand, content, metadata, legal copy, links, and assets.

## 6. Canonical, sitemap, robots, and structured data

- Every public page emits a `warhoundsguide.online` canonical.
- `/sitemap.xml` contains exactly nine canonical URLs: home, four guides, About,
  Contact, Privacy Policy, and Terms of Service.
- `/robots.txt` allows crawling and points to
  `https://warhoundsguide.online/sitemap.xml`.
- JSON-LD includes `WebSite`, `VideoGame`, and one `Article` object per guide.
- Preview-host URLs do not replace production canonical targets.

## 7. Isolation and residue

The run wrote only to the Factory and the independent Warhounds project. The
three protected pre-existing sites were not used as content sources and were not
modified by this run. A case-insensitive scan of every tracked Warhounds file
found no prior-site residue.

## 8. Verification

The generated project passed:

- 4 Vitest files / 9 tests
- ESLint
- Next.js route type generation
- TypeScript `tsc --noEmit`
- Next.js 16.3 production build with 14 generated routes
- `git diff --check`
- HTTP 200 smoke tests for all nine public routes, sitemap, and robots
- desktop browser metadata/navigation checks
- 390 × 844 mobile layout check with no horizontal overflow
- Pilot evidence boundary, related-link, canonical, and JSON-LD checks
- browser console check with zero warning/error messages

The Factory passed its complete build, lint, and 195-test suite before terminal
publication.

## 9. Recovered Vercel incident and one-time waiver

Vercel classified the first deployment as Production despite the Preview-only
request. The history is retained and is not rewritten as “never happened.”

- Incident: `VERCEL_FIRST_DEPLOY_AUTO_PRODUCTION`
- Deployment ID: `dpl_9nkxEUKKtkVi2xDcyWTX39QKePgD`
- Deployment URL:
  `https://warhoundsguide-aq8kynkkr-lew593963-2025s-projects.vercel.app`
- Created: `2026-08-12T17:22:55.238+08:00`
- Permanently deleted: `2026-08-12T17:25:26.166+08:00`
- Vercel creation audit event: `uev_9yHUGE8MVlkTebZiLqNeGUJK`
- Vercel deletion audit event: `uev_dWKJcZ3OVDxahpP9jWWQJykY`

Vercel automatically assigned aliases during the incident; none remain active.
No manual Production alias was created. Recovery verification found zero current
Production deployments, no `warhoundsguide.online` binding, no active Production
alias, and one retained valid Preview deployment. DNS, nameservers, Cloudflare,
GSC, GA, and advertising were not changed or enabled.

The human owner approved `ONE_TIME_RECOVERED_INCIDENT_WAIVER` only for
`warhounds-preview-20260812`. The waiver applies only to this exact incident after
all recovery predicates pass. It cannot authorize another run, game, incident,
or additional forbidden action.

## 10. Required Factory follow-up

`VERCEL_PREVIEW_SAFETY_HARDENING` is `MUST_FIX_BEFORE_NEXT_NEW_SITE`. Future Site
Builder runs must use an explicit Preview path, read back the actual deployment
target, record `VERCEL_PREVIEW_READY` only after confirming Preview, and fail
closed with immediate incident recovery if Vercel reports Production. The
Warhounds waiver is unavailable to future runs.

## 11. Release boundary

This run stops at `READY_FOR_RELEASE_REVIEW` only after the report-containing Git
commit has been pushed and its actual Vercel deployment is confirmed as Preview
and passes online QA. Formal domain binding, Production deployment, DNS,
nameservers, Cloudflare, GSC, GA, and Ads remain outside this run.
