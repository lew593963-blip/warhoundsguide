# Warhounds Adsterra Guide Ads Design

## Status and scope

This design adds Adsterra monetization only to the Warhounds site at
`https://warhoundsguide.online`. It does not modify Sephiria, GRAIN ROT,
Obsidian, their advertising accounts, or their deployments.

The Adsterra publisher account is already accessible and contains no Warhounds
website entry. Warhounds will therefore receive an independent website record
and independent ad units. Existing ad units from other sites must not be
copied or reused.

## Provider configuration

Create one Adsterra website with these settings:

- Domain: `warhoundsguide.online`
- Website category: Games
- Adult ads: disabled
- Enabled formats: Native Banner and Banner only
- Disabled formats: Popunder, Smartlink, and Social Bar
- Anti-Adblock: disabled for this release

Create five Warhounds-specific ad units so every position has independent
provider identity and statistics:

1. A desktop top Leaderboard Banner.
2. A first in-article Banner.
3. A second in-article Banner.
4. A desktop sticky rail Banner.
5. A Native Banner for the end-of-article placement.

The exact Banner sizes must be selected from the sizes offered by the Adsterra
account UI. The top unit must fit the main desktop content column, each inline
unit must fit a 390-pixel mobile viewport without scaling the page, and the rail
unit must fit a 300-pixel desktop rail. No size or provider URL may be guessed.

Provider-generated public placement identifiers and script URLs may be stored
in the Warhounds root configuration. Credentials, account tokens, payout data,
and private account identifiers must never enter the repository.

## Placement and page policy

Ads appear only on the four evidence-backed guide routes:

- `/beginner-guide`
- `/squad-guide`
- `/base-upgrades`
- `/weapons-guide`

The layout follows the balanced pattern observed on current PCGamesN, Dexerto,
and GameSpot guide pages: a desktop leaderboard, spaced in-content units, a
desktop rail, and a reduced mobile density. It deliberately excludes the
bottom-adhesion unit used by some large sites.

At desktop widths of at least 1200 pixels, each guide receives at most five
placements:

- One Leaderboard Banner after the article hero and source note, before the
  first guide section.
- One inline Banner after the second complete H2 section.
- A second inline Banner after the fourth complete H2 section, only when that
  section exists.
- One sticky rail Banner in a dedicated right column. It may stick below the
  site header but must stop before the footer.
- One Native Banner after the guide content and related-guide navigation.

Below 1200 pixels, the Leaderboard and sticky rail are not rendered. Each guide
receives at most three placements:

- One inline Banner after the second complete H2 section.
- A second inline Banner after the fourth complete H2 section, only when that
  section exists.
- One Native Banner after the guide content and related-guide navigation.

This is a section-count rule rather than a fixed pixel or paragraph interval.
It prevents short guides from manufacturing extra ad gaps while keeping long
guides close to the spacing pattern observed on the benchmark sites.

No Adsterra ad appears on the homepage, About, Contact, Privacy Policy, Terms
of Service, 404 page, sitemap, or robots response.

Every placement reserves its provider-selected dimensions before the script
loads, remains within its column, uses a visible and accessible
`Advertisement` label, and must not create horizontal overflow at the
390-pixel mobile viewport. Empty or unfilled inventory may retain only the
small reserved slot; it must not display fabricated content.

## Consent and loading behavior

Adsterra is an optional integration. Both formats are consent-gated:

- Before the visitor grants optional-cookie consent, no Adsterra script or
  iframe may be requested and the empty placement must not create a misleading
  ad impression.
- After consent is granted, each rendered placement loads its own
  provider-issued script exactly once.
- A denied consent choice keeps every placement inactive.
- The existing Cookie Settings control remains available so the visitor can
  revise the choice.

Google Analytics retains its current independent consent behavior. AdSense
site-verification metadata and `ads.txt` remain intact, while the AdSense
serving script stays disabled during its external review. Adsterra and AdSense
placement identifiers must never be shared.

## Technical design

Extend the existing typed `integrations.adsterra` configuration from one
Native Banner record to a strict five-placement structure:

- `topLeaderboard`: provider script ID, HTTPS script URL, dimensions/config,
  and a desktop-only rendering policy.
- `inlineBannerOne`: provider script ID, HTTPS script URL, and exact
  dimensions/config.
- `inlineBannerTwo`: a separate provider identity with the same strict shape.
- `desktopRail`: provider script ID, HTTPS script URL, dimensions/config, and
  a desktop-only rendering policy.
- `nativeBanner`: provider script ID, HTTPS script URL, and container ID.
- `consentRequired: true` at the integration boundary.

The schema must reject insecure script URLs, missing placement identities,
duplicate script or placement IDs, and any enabled configuration that omits
one of the five approved placements.

Keep the current `AdsterraNativeBanner` component as the Native placement
boundary and introduce one focused display-banner component that accepts one
of the four typed Banner placements. Provider globals, if required by the exact
generated snippet, stay inside the component instance and are created only
after consent. Every placement uses a unique DOM and script identity. No
provider script is added to the root layout.

Each guide source marks explicit insertion points after its second and fourth
complete H2 sections. The guide shell owns the desktop Leaderboard and rail,
while `ArticleShell` remains responsible for the end-of-article Native Banner.
At wide viewports the guide layout becomes a bounded content-plus-rail grid;
at narrower widths it remains the current single content column. This avoids
automatic insertion into legal pages or arbitrary content blocks.

If the provider returns a different code contract than the account UI
describes, implementation must adapt the typed placement model to the exact
generated code rather than guessing an Adsterra URL or identifier.

## Failure behavior

- Missing or malformed placement configuration fails the production build.
- Missing consent results in zero provider requests, not an error.
- A provider script load failure must not break guide content, navigation, or
  layout.
- A placement that causes runtime errors, redirect behavior, horizontal
  overflow, or unexpected new windows blocks Production promotion.
- The rail must not cover content or enter the footer, and no layout may create
  a bottom-adhesion or viewport-obscuring ad.
- If Adsterra keeps the website or ad unit under review, the code may be
  deployed only when the provider snippet exists and all local/Preview QA
  passes; the operational status remains `REVIEW_PENDING` rather than
  `SERVING`.

## Tests and release gate

Implementation follows test-driven development. Required automated evidence:

- Root-config contract proves Adsterra is enabled only with the five new
  Warhounds placements and Adult/intrusive formats are absent.
- Component tests prove zero scripts before consent and exactly one correct
  script per rendered placement after consent.
- Route tests prove placements exist only on the four guide pages, enforce the
  second/fourth-H2 density rule, and hide desktop-only units below 1200 pixels.
- Existing analytics, AdSense metadata, canonical, sitemap, robots, JSON-LD,
  residue, and favicon tests remain green.
- Full tests, lint, typecheck, production build, and `git diff --check` pass.
- Preview or staged Production QA covers all guide pages at 1440-pixel desktop
  and 390-pixel mobile sizes, with no console errors, unexpected navigation,
  broken content, footer overlap, or horizontal overflow. It must prove a
  desktop maximum of five placements, a mobile maximum of three placements,
  and no bottom-adhesion unit.
- After promotion, provider read-back confirms the exact Vercel project,
  Production target, READY state, and commit SHA before the formal domain is
  declared updated.

## Operational record

Record the Adsterra website ID, all five ad-unit IDs, provider review state,
deployment ID, release commit, consent QA, and live request/impression state in
the Warhounds release observations and regenerated Case Export. Revenue and
impressions remain `UNKNOWN` until observed from the provider.
