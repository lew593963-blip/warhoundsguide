# Search Performance Evidence — August 22, 2026

## Google Search Console

Property: `sc-domain:warhoundsguide.online`. The three-month view effectively covers the site's first nine days.

| Metric | Observed value |
| --- | ---: |
| Clicks | 25 |
| Impressions | 345 |
| CTR | 7.2% |
| Average position | 8.8 |

| Query | Clicks | Impressions | CTR | Position | Decision |
| --- | ---: | ---: | ---: | ---: | --- |
| `warhounds guide` | 6 | 37 | 16.2% | 6.5 | Keep homepage as the hub and add the fifth evidence-led guide card. |
| `warhounds trainer` | 0 | 20 | 0% | 11.5 | Create one consolidated trainer/cheats/console status guide. |
| `warhounds cheats` | 0 | 3 | 0% | 13 | Merge into the same page to avoid cannibalization. |
| `warhound trainer` | 0 | 1 | 0% | 9 | Cover as a close variant on the consolidated page. |
| `warhounds walkthrough` | 0 | 1 | 0% | 37 | Defer; no mission-level evidence pack supports a substantial page. |
| `warhounds tips` | 0 | 1 | 0% | 51 | Merge into the existing beginner guide intent. |

The homepage generated 21 clicks and 318 impressions on the canonical HTTPS URL. A historical HTTP row generated 4 clicks and 27 impressions; it is a non-canonical redirect source, not a page that should be made independently indexable.

## Google Analytics 4

Property: `Warhounds Guide` (`p549818152`), measurement ID `G-RY8XD6LH7X`. Observation window: July 25–August 21, 2026.

| Metric | Observed value |
| --- | ---: |
| Views | 23 |
| Active users | 5 |
| Views per active user | 4.60 |
| Average engagement per active user | 7m 42s |
| Events | 59 |
| Key events | 0 |
| Revenue | ¥0 |

The homepage recorded 10 views. The beginner guide recorded 4; base upgrades and weapons recorded 2 each; all other listed pages had one view. This is a very small sample, so it supports crawl and intent prioritization but not broad behavioral conclusions.

## Indexing diagnosis

The August 17 GSC snapshot showed one indexed page and eleven excluded examples:

- Three `Page with redirect` examples: `http://warhoundsguide.online/`, `http://www.warhoundsguide.online/`, and `https://www.warhoundsguide.online/`. These correctly consolidate to the HTTPS apex canonical and should remain permanent redirects.
- Eight `Discovered – currently not indexed` pages: About, Base Upgrades, Beginner Guide, Contact, Privacy Policy, Squad Guide, Terms, and Weapons Guide. These were discovered but not crawled, so the site-side response is stronger content/internal links, canonical-only sitemap freshness, and post-deploy submission—not removal of canonical redirects.

Google controls crawl and indexing timing. A technically eligible page and an accepted indexing request do not guarantee immediate inclusion.
