# Warhounds GSC, Indexing, Content, and Ads Design

## Goal

Use observed GSC and GA data to improve the pages users are asking for, strengthen crawl signals for the canonical pages, and extend consent-gated Adsterra inventory to every public HTML page without weakening canonical host normalization.

## Observed evidence

- GSC through 2026-08-21: 25 clicks, 345 impressions, 7.2% CTR, average position 8.8.
- Query opportunity: `warhounds guide` (6 clicks / 37 impressions / position 6.5) and `warhounds trainer` (0 / 20 / 11.5). Lower-volume terms include `warhounds cheats`, `warhound trainer`, `warhounds walkthrough`, and `warhounds tips`.
- GSC indexing snapshot dated 2026-08-17: homepage indexed; eight canonical pages are discovered but not crawled; three non-canonical HTTP/www home URLs are correctly classified as redirects.
- GA property `Warhounds Guide`, 2026-07-25 through 2026-08-21: 23 views, 5 active users, 59 events. The homepage has 10 views and the beginner guide has 4.
- Adsterra website 5980025 has five active units. Existing code uses them only on guide pages. The provider's Adult Ads switch is visible but disabled.

## Design

1. Add one evidence-bounded `/trainer-cheats` guide rather than multiple thin trainer, cheat, and console-command pages. It will answer the shared intent early, distinguish first-party facts from third-party trainer availability, avoid fabricated console commands, and link to legitimate difficulty and tactical alternatives.
2. Add the new guide to the homepage library, navigation, related-guide graph, sitemap, metadata, Article JSON-LD, and the Page Matrix/evidence/SEO records.
3. Keep HTTP and www permanent redirects. They consolidate duplicate host variants onto `https://warhoundsguide.online`; turning them into indexable duplicates would be an SEO regression. Tests will prove all internal links, canonicals, and sitemap entries use only the canonical host.
4. Refresh sitemap `lastModified` values from content metadata and a release-level static timestamp. Do not use request-time timestamps.
5. Add one reusable site-page ad block to Home, About, Contact, Privacy, and Terms. It uses the existing 300x250 all-viewport unit, remains consent-gated, labels itself as advertising, and does not add ads to 404, robots, sitemap, or other non-content surfaces. Guide pages retain their current five desktop / three mobile placements, including the existing article-top leaderboard.
6. Update privacy and consent copy from “guide pages” to “public content pages,” and disclose that provider inventory may include mature advertising when enabled by the provider.
7. After local verification and deployment, run live URL checks and request validation/indexing for the canonical content pages. Record indexing as requested, not guaranteed.

## Safety and quality constraints

- Do not publish unsupported trainer features, download links, console commands, or claims that require disabling security software.
- Do not remove canonical redirects or create duplicate HTTP/www content.
- Do not load analytics or ads before explicit optional consent.
- Do not claim adult ads are enabled while the provider switch remains disabled.
- Do not change DNS, nameservers, Cloudflare, AdSense serving, or other sites.

## Verification

- Unit and integration tests for the new route, canonical/sitemap coverage, homepage link, site-page ad coverage, consent gating, and absence of ads on 404/non-HTML routes.
- Lint, typecheck, production build, and `git diff --check`.
- Live checks for status, canonical, robots, sitemap, redirect chains, internal links, ads with and without consent, and GA tag identity.
