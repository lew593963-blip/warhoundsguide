# Site Builder v0.1 Run Record

| Field | Value |
| --- | --- |
| Run ID | `warhounds-preview-20260812-r2` |
| Run mode | `AUTONOMOUS_RELEASE_OPERATIONS` |
| Game | Warhounds |
| Steam App ID | `3929470` |
| Target production domain | `warhoundsguide.online` |
| Canonical target | `https://warhoundsguide.online` |
| Human Gate 1 | `GO` |
| Domain ownership | `CONFIRMED` |
| Repository visibility | `public` |
| Production deploy | previously completed; Adsterra change remains unpromoted pending final-SHA Preview verification |
| DNS and domain binding | unchanged; no DNS action in the Adsterra change |
| GA | consent-gated and enabled |
| AdSense | site verification only; serving disabled; review pending |
| Adsterra | website `5980025`; five isolated units Active; consent-gated code and first Preview QA passed; production QA pending |

## Adsterra change record — August 13, 2026

- Provider category: `Other` because the provider creation form offered no Games category.
- Adult Ads: disabled.
- Enabled formats: Banner and Native Banner only.
- Disabled formats: Popunder, Smartlink, Social Bar, Anti-Adblock, and bottom adhesion.
- Units: desktop top `30725311` (728x90), inline one `30725327` (300x250), inline two `30725331` (160x300), desktop rail `30725336` (160x600), final Native `30725310`.
- Provider state at `2026-08-13T08:27:41Z`: all five units `Active`; website review label was not separately displayed.
- Verified Preview: deployment `dpl_EtW7Hy1WSc3LqkdpAe5HaKUrHcQf`, target `preview`, state `READY`, commit `c74fe3135ad217f66d03f58c05b39e8e76d641a5`, URL `https://warhoundsguide-qshevtx3k-lew593963-2025s-projects.vercel.app`.
- Preview QA: 13 Factory HTTP paths passed; browser QA confirmed 0 provider frames before consent, five distinct units on each desktop guide after consent, and zero units on the homepage and legal routes.
- Preview ledger SHA-256: `156cc01e4062a527b82e66e9660785792a1a58675fea137eb721b2f550304268`.
- Impressions and revenue: `UNKNOWN` until source-bound provider observations exist.

## Search, indexing, and all-page advertising update — August 22, 2026

- GSC property: `sc-domain:warhoundsguide.online`.
- Search performance through August 21: 25 clicks, 345 impressions, 7.2% CTR, average position 8.8.
- Primary observed opportunities: `warhounds guide` (6 clicks, 37 impressions, position 6.5) and `warhounds trainer` (0 clicks, 20 impressions, position 11.5).
- GA property: `Warhounds Guide` (`p549818152`), web stream measurement ID `G-RY8XD6LH7X`.
- GA observation for July 25–August 21: 23 views, 5 active users, 59 events; the sample is too small for conversion or revenue conclusions.
- Indexing snapshot dated August 17: homepage indexed; eight canonical pages were `Discovered – currently not indexed`; the three redirect examples were non-canonical `http/www` homepage variants and remain intentionally redirected.
- Content action: consolidated trainer, cheats, and console intent into `/trainer-cheats`; no unsupported download or command claims were added.
- Crawl action: canonical-only sitemap expanded to ten URLs with fixed August 22 freshness on changed pages; robots remains crawlable.
- Advertising action: all ten public HTML content pages now render consent-gated Adsterra inventory; each guide keeps five desktop / three mobile placements, while Home, About, Contact, Privacy, and Terms receive one inline placement.
- Adult inventory: allowed by the site policy and disclosed in Privacy/Terms, but not provider-enabled because the authenticated Adsterra website control was disabled. This is an external provider blocker, not represented as completed.
- Local verification: 37 tests passed; lint, typecheck, production build, `git diff --check`, and 20 route/viewport visual checks passed. Production identity and post-deploy QA are recorded only after the new commit is deployed.

The Factory is the only Site Builder v0.1 executor. This project is an independent materialization from an immutable Game Guide Template source commit. Page content and facts were rebuilt from Warhounds-specific evidence packs.
