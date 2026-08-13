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

Create two Warhounds-specific ad units:

1. A standard Banner for one in-article placement.
2. A Native Banner for one end-of-article placement.

Provider-generated public placement identifiers and script URLs may be stored
in the Warhounds root configuration. Credentials, account tokens, payout data,
and private account identifiers must never enter the repository.

## Placement and page policy

Ads appear only on the four evidence-backed guide routes:

- `/beginner-guide`
- `/squad-guide`
- `/base-upgrades`
- `/weapons-guide`

Each guide receives at most two placements:

- One standard Banner immediately after the first complete H2 section chosen
  explicitly in each guide source.
- One Native Banner after the guide content and related-guide navigation.

No Adsterra ad appears on the homepage, About, Contact, Privacy Policy, Terms
of Service, 404 page, sitemap, or robots response.

Both placements reserve responsive space, remain within the article width,
use an accessible `Advertisement` label, and must not create horizontal
overflow at the 390-pixel mobile viewport.

## Consent and loading behavior

Adsterra is an optional integration. Both formats are consent-gated:

- Before the visitor grants optional-cookie consent, no Adsterra script or
  iframe may be requested and the empty placement must not create a misleading
  ad impression.
- After consent is granted, each placement loads its own provider-issued
  script exactly once.
- A denied consent choice keeps both placements inactive.
- The existing Cookie Settings control remains available so the visitor can
  revise the choice.

Google Analytics retains its current independent consent behavior. AdSense
site-verification metadata and `ads.txt` remain intact, while the AdSense
serving script stays disabled during its external review. Adsterra and AdSense
placement identifiers must never be shared.

## Technical design

Extend the existing typed `integrations.adsterra` configuration from one
Native Banner record to a strict two-placement structure:

- `nativeBanner`: provider script ID, HTTPS script URL, and container ID.
- `displayBanner`: provider script ID, HTTPS script URL, dimensions/config
  required by the exact provider snippet.
- `consentRequired: true` at the integration boundary.

The schema must reject insecure script URLs, missing placement identities,
duplicate script IDs, and any enabled configuration that omits either approved
placement.

Keep the current `AdsterraNativeBanner` component as the Native placement
boundary and introduce one focused display-banner component for the standard
Banner. Provider globals, if required by the exact generated snippet, stay
inside that component and are created only after consent. No provider script
is added to the root layout.

Each guide source marks one explicit insertion point immediately after its
first complete H2 section. `ArticleShell` remains responsible for the
end-of-article Native Banner. This avoids automatic insertion into legal pages
or arbitrary content blocks.

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
- If Adsterra keeps the website or ad unit under review, the code may be
  deployed only when the provider snippet exists and all local/Preview QA
  passes; the operational status remains `REVIEW_PENDING` rather than
  `SERVING`.

## Tests and release gate

Implementation follows test-driven development. Required automated evidence:

- Root-config contract proves Adsterra is enabled only with the two new
  Warhounds placements and Adult/intrusive formats are absent.
- Component tests prove zero scripts before consent and exactly one correct
  script per placement after consent.
- Route tests prove placements exist only on the four guide pages.
- Existing analytics, AdSense metadata, canonical, sitemap, robots, JSON-LD,
  residue, and favicon tests remain green.
- Full tests, lint, typecheck, production build, and `git diff --check` pass.
- Preview or staged Production QA covers all guide pages at desktop and mobile
  sizes, with no console errors, unexpected navigation, broken content, or
  horizontal overflow.
- After promotion, provider read-back confirms the exact Vercel project,
  Production target, READY state, and commit SHA before the formal domain is
  declared updated.

## Operational record

Record the Adsterra website ID, both ad-unit IDs, provider review state,
deployment ID, release commit, consent QA, and live request/impression state in
the Warhounds release observations and regenerated Case Export. Revenue and
impressions remain `UNKNOWN` until observed from the provider.
