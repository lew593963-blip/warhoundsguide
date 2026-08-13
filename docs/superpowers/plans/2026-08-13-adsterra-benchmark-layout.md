# Warhounds Adsterra Benchmark Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add consent-gated, Warhounds-specific Adsterra Banner and Native Banner placements to the four guide pages with large-guide-site desktop density and reduced mobile density, then verify and release them safely.

**Architecture:** Adsterra provider evidence is captured first so no URL, placement key, size, or account identity is guessed. A strict root-config model owns five independent placements; one consent-aware client boundary mounts the exact provider snippets only for rendered placements. MDX marks the two editorial insertion points, while `ArticleShell` owns the desktop leaderboard, bounded sticky rail, and final Native unit.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5, next-mdx-remote, Zod 4, Vitest, Testing Library, Playwright, Adsterra publisher UI, GitHub, Vercel.

## Global Constraints

- Project scope is only `/Users/chenchen/Documents/ChatGPT/warhoundsguide` plus the Warhounds release observation files in the Factory.
- Adsterra website domain is exactly `warhoundsguide.online`; category is Games; Adult Ads is disabled.
- Only Banner and Native Banner formats are enabled. Popunder, Smartlink, Social Bar, bottom adhesion, and Anti-Adblock remain disabled.
- Desktop width is `>= 1200px`: one top Leaderboard, two inline Banners, one sticky rail Banner, and one final Native Banner, at most five placements.
- Width `< 1200px`: only two inline Banners and one final Native Banner, at most three placements.
- Inline positions are immediately after the second and fourth complete H2 sections in each guide.
- Ads appear only on `/beginner-guide`, `/squad-guide`, `/base-upgrades`, and `/weapons-guide`.
- Every rendered placement has a visible `Advertisement` label and reserves its provider-selected dimensions.
- No Adsterra script, iframe, or request is created before optional-cookie consent is granted; denied consent keeps every placement inactive.
- AdSense account verification and `ads.txt` stay intact; the AdSense serving script remains disabled while review is pending.
- Provider-generated public placement keys and URLs may be committed; credentials, tokens, payout data, and private account settings may not be committed.
- No force push. Production is promoted only after Preview QA and exact Vercel project/team/commit/environment read-back.

## File Map

- Create `docs/site-builder/adsterra-provider-evidence.json`: redacted, structured provider read-back for the Warhounds website and five public placement contracts.
- Modify `config/schema.ts`: strict five-placement Adsterra schema and uniqueness validation.
- Modify `config/game.ts`: exact Warhounds placement values captured from provider evidence.
- Create `components/adsterra-placement.tsx`: consent and viewport-aware provider mounting boundary.
- Create `components/adsterra-placement.module.css`: shared reserved-slot, label, mobile, leaderboard, inline, rail, and Native styling.
- Remove `components/adsterra-native-banner.tsx` and `components/adsterra-native-banner.module.css` after their behavior moves to the shared component.
- Modify `components/article-renderer.tsx`: expose two typed inline MDX components.
- Modify `components/article-shell.tsx` and `components/article-shell.module.css`: leaderboard, content/rail grid, bounded rail, and final Native placement.
- Modify the four `content/guides/en/*.mdx` files: explicit inline markers after H2 section two and four.
- Modify `lib/legal-content.ts` and `config/game.ts`: accurate Adsterra consent/privacy disclosure and SEO description.
- Modify `tests/config/production-config.test.ts`: exact enabled integration contract and forbidden-format checks.
- Create `tests/components/adsterra-placement.test.tsx`: consent, viewport, uniqueness, and provider-snippet behavior.
- Modify `tests/content/content-registry.test.ts`: exact marker count and H2-position contract.
- Modify `docs/site-builder/root-config.md` and `docs/site-builder/run-record.md`: current Adsterra state.
- Modify Factory `cases/warhounds-release-20260813/release-observations.json`, `production-qa-observations.json`, and `case-export-input.json`: final deployment and advertising evidence.

---

### Task 1: Create Warhounds Provider Identity and Capture Exact Snippets

**Files:**
- Create: `docs/site-builder/adsterra-provider-evidence.json`

**Interfaces:**
- Consumes: authenticated Adsterra publisher UI and the approved domain/format policy.
- Produces: `AdsterraProviderEvidence` with one website identity and five exact public placement contracts consumed by Tasks 2 and 3.

- [ ] **Step 1: Add the Warhounds website with the approved settings**

In Adsterra Publishers → Websites, choose Add website and submit exactly:

```text
Website: warhoundsguide.online
Website category: Games
Adult ads: off
Initial formats: Banner, Native Banner
Forbidden formats left unchecked: Popunder, Smartlink, Social Bar
```

After submission, read back the exact website ID, domain, category, Adult Ads state, and review/approval state from the website detail page.

- [ ] **Step 2: Create five independent units and select only offered sizes**

Create and name the units so provider statistics remain position-specific:

```text
Warhounds Desktop Top Leaderboard
Warhounds Inline Banner 1
Warhounds Inline Banner 2
Warhounds Desktop Sticky Rail
Warhounds Article End Native
```

For the top unit, choose an offered Banner size that is no wider than 780 pixels. For each inline unit, choose an offered Banner size no wider than 360 pixels. For the rail, choose an offered Banner size no wider than 300 pixels. Use Native Banner for the final unit. Do not enable Anti-Adblock or any additional format.

- [ ] **Step 3: Read the provider code rather than guessing it**

For each unit, open Get Code and retain only the public contract:

```ts
type DisplayProviderContract = {
  unitId: string;
  placementName: string;
  key: string;
  width: number;
  height: number;
  format: "iframe";
  scriptUrl: `https://${string}`;
};

type NativeProviderContract = {
  unitId: string;
  placementName: string;
  containerId: string;
  scriptUrl: `https://${string}`;
};
```

Reject and recreate a unit if the returned code includes a Popunder, Smartlink, Social Bar, adult-only, or bottom-adhesion behavior.

- [ ] **Step 4: Write redacted provider evidence**

Create `docs/site-builder/adsterra-provider-evidence.json` as a JSON serialization of this contract, using only exact values read in Steps 1–3:

```ts
type AdsterraProviderEvidence = {
  schema_version: "0.1.0";
  observed_at: string; // new Date().toISOString() at provider read-back
  website: {
    id: string; // exact visible Warhounds website ID
    domain: "warhoundsguide.online";
    category: "Games";
    adult_ads: false;
    review_state: string; // exact visible provider state
  };
  forbidden_formats: {
    popunder: false;
    smartlink: false;
    social_bar: false;
    anti_adblock: false;
    bottom_adhesion: false;
  };
  placements: {
    topLeaderboard: DisplayProviderContract & {placementName: "Warhounds Desktop Top Leaderboard"};
    inlineBannerOne: DisplayProviderContract & {placementName: "Warhounds Inline Banner 1"};
    inlineBannerTwo: DisplayProviderContract & {placementName: "Warhounds Inline Banner 2"};
    desktopRail: DisplayProviderContract & {placementName: "Warhounds Desktop Sticky Rail"};
    nativeBanner: NativeProviderContract & {placementName: "Warhounds Article End Native"};
  };
};
```

Serialize field names in snake case to match the `jq` verification in Step 5 (`unit_id`, `placement_name`, `script_url`, and `container_id`). Do not save a field until its exact value is visible in the Warhounds provider page or Get Code output. Do not record login email, token, balance, payout, KYC, or account-security data.

- [ ] **Step 5: Validate evidence and commit**

Run:

```bash
jq -e '
  .website.domain == "warhoundsguide.online" and
  .website.category == "Games" and
  .website.adult_ads == false and
  ([.forbidden_formats[]] | all(. == false)) and
  ([.placements[].unit_id] | length == (unique | length)) and
  ([.placements[].script_url] | all(startswith("https://"))) and
  (.placements.topLeaderboard.width <= 780) and
  (.placements.inlineBannerOne.width <= 360) and
  (.placements.inlineBannerTwo.width <= 360) and
  (.placements.desktopRail.width <= 300)
' docs/site-builder/adsterra-provider-evidence.json
git add docs/site-builder/adsterra-provider-evidence.json
git commit -m "docs: record Warhounds Adsterra placements"
```

Expected: `jq` exits 0; the commit contains no account credential or unrelated website data.

---

### Task 2: Enforce the Five-Placement Root Configuration

**Files:**
- Modify: `tests/config/production-config.test.ts`
- Modify: `config/schema.ts`
- Modify: `config/game.ts`

**Interfaces:**
- Consumes: the exact `placements` object from `AdsterraProviderEvidence`.
- Produces: `AdsterraIntegration` and `AdsterraPlacement` types available through `RootConfig["integrations"]["adsterra"]`.

- [ ] **Step 1: Write the failing root-config tests**

Update `tests/config/production-config.test.ts` to assert the consumer-visible contract:

```ts
it("enables five isolated consent-gated Warhounds Adsterra placements", () => {
  const adsterra = rootConfig.integrations.adsterra;
  expect(adsterra.enabled).toBe(true);
  if (!adsterra.enabled) throw new Error("Adsterra must be enabled");

  expect(adsterra.consentRequired).toBe(true);
  expect(Object.keys(adsterra.placements)).toEqual([
    "topLeaderboard",
    "inlineBannerOne",
    "inlineBannerTwo",
    "desktopRail",
    "nativeBanner",
  ]);
  expect(new Set(Object.values(adsterra.placements).map((item) => item.unitId)).size).toBe(5);
  expect(Object.values(adsterra.placements).every((item) => item.scriptUrl.startsWith("https://"))).toBe(true);
  expect(JSON.stringify(adsterra)).not.toMatch(/popunder|smartlink|social.?bar|adult|anti.?adblock|bottom.?adhesion/i);
});
```

Keep the existing assertion that AdSense serving is disabled and `public/ads.txt` contains only the Google account declaration.

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
pnpm vitest run tests/config/production-config.test.ts
```

Expected: FAIL because `adsterra.enabled` is still false and no placements exist.

- [ ] **Step 3: Implement the strict schema**

In `config/schema.ts`, define and export via `RootConfig`:

```ts
const displayAdsterraPlacementSchema = z.object({
  format: z.literal("BANNER"),
  unitId: z.string().min(1),
  scriptId: z.string().min(1),
  scriptUrl: z.url().startsWith("https://"),
  key: z.string().min(1),
  width: z.number().int().positive().max(780),
  height: z.number().int().positive().max(600),
  viewport: z.enum(["ALL", "DESKTOP_ONLY"]),
});

const nativeAdsterraPlacementSchema = z.object({
  format: z.literal("NATIVE_BANNER"),
  unitId: z.string().min(1),
  scriptId: z.string().min(1),
  scriptUrl: z.url().startsWith("https://"),
  containerId: z.string().min(1),
  viewport: z.literal("ALL"),
});
```

The enabled branch contains exactly `consentRequired: z.literal(true)` and a strict `placements` object with the five named keys. Add `superRefine` to reject duplicate `unitId`, `scriptId`, display `key`, or Native `containerId` values and to enforce `topLeaderboard`/`desktopRail` as `DESKTOP_ONLY` while inline and Native units are `ALL`.

- [ ] **Step 4: Materialize exact provider values**

Change `config/game.ts` from `{enabled: false}` to the enabled structure. Copy every public value exactly from `docs/site-builder/adsterra-provider-evidence.json`; derive only stable local script IDs such as `adsterra-top-leaderboard`, `adsterra-inline-one`, `adsterra-inline-two`, `adsterra-desktop-rail`, and `adsterra-native-end`.

Do not import the evidence JSON at runtime and do not place provider credentials in environment variables or source.

- [ ] **Step 5: Run GREEN and regression tests**

Run:

```bash
pnpm vitest run tests/config/production-config.test.ts tests/architecture/residue.test.ts
```

Expected: PASS. Mutating any placement to duplicate another unit ID, to an HTTP URL, or to the wrong viewport policy must make schema parsing fail.

- [ ] **Step 6: Commit**

```bash
git add config/schema.ts config/game.ts tests/config/production-config.test.ts
git commit -m "feat: configure Warhounds Adsterra placements"
```

---

### Task 3: Build One Safe Consent and Viewport Boundary

**Files:**
- Create: `tests/components/adsterra-placement.test.tsx`
- Create: `components/adsterra-placement.tsx`
- Create: `components/adsterra-placement.module.css`
- Remove: `components/adsterra-native-banner.tsx`
- Remove: `components/adsterra-native-banner.module.css`

**Interfaces:**
- Consumes: `AdsterraPlacement` records and `useConsentChoice()`.
- Produces: `AdsterraPlacement({placement, position})`, where `position` is `"leaderboard" | "inline" | "rail" | "native"`.

- [ ] **Step 1: Write failing component tests against real DOM behavior**

Cover these independent behaviors in `tests/components/adsterra-placement.test.tsx`:

```ts
it("creates no provider frame before optional consent", () => {
  render(<AdsterraPlacement placement={displayFixture} position="inline" />);
  expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
});

it("mounts the exact provider contract once after consent", () => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
  render(<AdsterraPlacement placement={displayFixture} position="inline" />);
  const frame = screen.getByTitle("Advertisement content");
  expect(frame).toHaveAttribute("data-adsterra-unit", displayFixture.unitId);
  expect(frame.getAttribute("srcdoc")).toContain(displayFixture.scriptUrl);
  expect(frame.getAttribute("srcdoc")).toContain(displayFixture.key);
  expect(screen.getAllByTitle("Advertisement content")).toHaveLength(1);
});

it("does not mount desktop-only inventory below 1200 pixels", () => {
  setMatchMedia(false);
  window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
  render(<AdsterraPlacement placement={desktopFixture} position="rail" />);
  expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
});
```

Add cases for denied consent, a consent-change event after initial render, Native container/script serialization, a visible `Advertisement` label, and cleanup when consent changes from granted to denied. The `matchMedia` test double must return the complete methods used by production and restore the original after each test.

Define the placement fixtures by parsing literal objects with the real exported config schema, and use this complete test helper:

```ts
function setMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
    matches,
    media: "(min-width: 1200px)",
    onchange: null,
    addEventListener: (_type: "change", listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: "change", listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } satisfies MediaQueryList));
}
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
pnpm vitest run tests/components/adsterra-placement.test.tsx
```

Expected: FAIL because `AdsterraPlacement` does not exist.

- [ ] **Step 3: Implement exact snippet serialization**

Implement two pure internal serializers in `components/adsterra-placement.tsx`:

```ts
type EnabledAdsterra = Extract<RootConfig["integrations"]["adsterra"], {enabled: true}>;
type AdsterraPlacementRecord = EnabledAdsterra["placements"][keyof EnabledAdsterra["placements"]];
type DisplayPlacement = Extract<AdsterraPlacementRecord, {format: "BANNER"}>;
type NativePlacement = Extract<AdsterraPlacementRecord, {format: "NATIVE_BANNER"}>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function displaySrcDoc(placement: DisplayPlacement): string {
  const options = JSON.stringify({
    key: placement.key,
    format: "iframe",
    height: placement.height,
    width: placement.width,
    params: {},
  }).replaceAll("<", "\\u003c");
  return `<!doctype html><html><body><script>window.atOptions=${options}<\/script><script src="${escapeHtml(placement.scriptUrl)}"><\/script></body></html>`;
}

function nativeSrcDoc(placement: NativePlacement): string {
  return `<!doctype html><html><body><div id="${escapeHtml(placement.containerId)}"></div><script async data-cfasync="false" src="${escapeHtml(placement.scriptUrl)}"><\/script></body></html>`;
}
```

The iframe uses `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"`, `referrerPolicy="strict-origin-when-cross-origin"`, explicit width/height, and no `allow-same-origin`. Do not use `dangerouslySetInnerHTML` in the parent document and do not create a root-layout script.

- [ ] **Step 4: Implement consent and desktop visibility**

Use `useConsentChoice()` and a `useDesktopAdViewport()` hook based on `window.matchMedia("(min-width: 1200px)")`. Render the visible label and reserved wrapper immediately, but create the iframe only when consent is `granted` and the viewport policy is satisfied. Listen for viewport changes and remove the frame when the desktop query stops matching.

- [ ] **Step 5: Run GREEN and mutation checks**

Run:

```bash
pnpm vitest run tests/components/adsterra-placement.test.tsx tests/components/consent-gated-google-analytics.test.tsx
```

Expected: PASS. Removing the consent check, changing the 1200-pixel query, reusing a wrong key, or adding `allow-same-origin` must fail at least one test.

- [ ] **Step 6: Remove the old Native-only component and commit**

```bash
git rm components/adsterra-native-banner.tsx components/adsterra-native-banner.module.css
git add components/adsterra-placement.tsx components/adsterra-placement.module.css tests/components/adsterra-placement.test.tsx
git commit -m "feat: add consent-gated Adsterra boundary"
```

---

### Task 4: Materialize Benchmark Density in the Four Guides

**Files:**
- Modify: `tests/content/content-registry.test.ts`
- Modify: `components/article-renderer.tsx`
- Modify: `components/article-shell.tsx`
- Modify: `components/article-shell.module.css`
- Modify: `content/guides/en/beginner-guide.mdx`
- Modify: `content/guides/en/squad-guide.mdx`
- Modify: `content/guides/en/base-upgrades.mdx`
- Modify: `content/guides/en/weapons-guide.mdx`

**Interfaces:**
- Consumes: `AdsterraPlacement` and the five typed config records.
- Produces: `AdsterraInlineOne` and `AdsterraInlineTwo` MDX component names plus the shell-owned desktop and final placements.

- [ ] **Step 1: Write the failing density contract**

Extend `tests/content/content-registry.test.ts`:

```ts
it("places two inline ads after complete H2 sections two and four", () => {
  for (const entry of contentRegistry) {
    const tokens = entry.source.split(/\n(?=## |<AdsterraInline)/);
    const h2Indexes = tokens.flatMap((token, index) => token.startsWith("## ") ? [index] : []);
    const firstAd = tokens.findIndex((token) => token.startsWith("<AdsterraInlineOne"));
    const secondAd = tokens.findIndex((token) => token.startsWith("<AdsterraInlineTwo"));
    expect(firstAd, entry.slug).toBe(h2Indexes[1] + 1);
    expect(secondAd, entry.slug).toBe(h2Indexes[3] + 1);
    expect(entry.source.match(/<AdsterraInline(?:One|Two) \/>/g)).toHaveLength(2);
  }
});
```

If the literal token indexing needs adjustment for the parser boundary, keep the hand-derived requirement: marker one occurs after the complete second H2 block and before H2 three; marker two occurs after the complete fourth H2 block and before H2 five.

- [ ] **Step 2: Run RED**

```bash
pnpm vitest run tests/content/content-registry.test.ts
```

Expected: FAIL because none of the guides has inline markers.

- [ ] **Step 3: Add the two MDX components**

In `components/article-renderer.tsx`, bind exact components instead of allowing arbitrary placement props from content:

```tsx
const adsterra = rootConfig.integrations.adsterra;
const adComponents = adsterra.enabled ? {
  AdsterraInlineOne: () => <AdsterraPlacement placement={adsterra.placements.inlineBannerOne} position="inline" />,
  AdsterraInlineTwo: () => <AdsterraPlacement placement={adsterra.placements.inlineBannerTwo} position="inline" />,
} : {};

<MDXRemote components={{EvidenceBadge, ...adComponents}} />
```

This prevents MDX from selecting a provider key, URL, or other placement.

- [ ] **Step 4: Insert markers at editorial boundaries**

In every guide, add `<AdsterraInlineOne />` after all content belonging to H2 section two and immediately before H2 section three. Add `<AdsterraInlineTwo />` after all content belonging to H2 section four and immediately before H2 section five. Do not move or rewrite factual guide content.

- [ ] **Step 5: Build the desktop guide grid and shell placements**

In `ArticleShell`, when Adsterra is enabled:

- Render `topLeaderboard` after the source note.
- Wrap the article and a rail element in `styles.articleGrid`.
- Render `desktopRail` inside a `styles.railSticky` element.
- Keep related guides after the grid.
- Render `nativeBanner` after related guides.

In CSS, keep the existing single column below 1200 pixels. At `min-width: 1200px`, set a bounded grid such as `minmax(0, 780px) 300px`, use a gap that fits the existing page width, and make only the rail inner wrapper sticky. The grid container ends before related guides and footer, so sticky containment prevents footer overlap.

- [ ] **Step 6: Run GREEN and build**

```bash
pnpm vitest run tests/content/content-registry.test.ts tests/components/adsterra-placement.test.tsx
pnpm typecheck
pnpm build
```

Expected: all pass; all four guide routes remain statically generated.

- [ ] **Step 7: Commit**

```bash
git add components/article-renderer.tsx components/article-shell.tsx components/article-shell.module.css content/guides/en tests/content/content-registry.test.ts
git commit -m "feat: add benchmark guide ad layout"
```

---

### Task 5: Update Privacy, QA Instrumentation, and Run Records

**Files:**
- Modify: `lib/legal-content.ts`
- Modify: `config/game.ts`
- Modify: `docs/site-builder/root-config.md`
- Modify: `docs/site-builder/run-record.md`

**Interfaces:**
- Consumes: the enabled integration and exact provider evidence.
- Produces: accurate human-facing disclosure and auditable integration status. Human legal prose is verified by rendered-page review rather than a brittle source-text unit test.

- [ ] **Step 1: Update legal and metadata copy**

Change the Privacy intro, Browser storage and consent section, Analytics and advertising status section, and Terms external-services section to name consent-gated Adsterra Banner/Native Banner delivery accurately. Do not claim serving, impressions, approval, or revenue unless provider evidence proves it. Change the Privacy SEO description from “disabled advertising” to “consent-gated advertising.”

- [ ] **Step 2: Update run records**

Set Adsterra to `CODE_IMPLEMENTED` or the exact higher provider state observed in Task 1. Record the website ID, five unit IDs, Adult/forbidden-format state, and pending QA. Do not modify historical Preview incident/waiver evidence.

- [ ] **Step 3: Render and inspect the legal page**

Run a local production server and inspect `/privacy-policy` in the browser. Verify the built page says Adsterra is consent-gated, AdSense serving remains disabled, Cookie Settings is available, and no Adsterra request occurs on the legal page even after consent.

- [ ] **Step 4: Run the regression gate and commit**

```bash
pnpm vitest run tests/config/production-config.test.ts
pnpm lint
pnpm typecheck
pnpm build
git diff --check
git add lib/legal-content.ts config/game.ts docs/site-builder/root-config.md docs/site-builder/run-record.md
git commit -m "docs: disclose and audit Warhounds ads"
```

Expected: every command exits 0.

---

### Task 6: Full Local Gate, Preview Deployment, and Preview QA

**Files:**
- Modify only if a failing test or QA observation requires an in-scope fix.

**Interfaces:**
- Consumes: the complete implementation commits.
- Produces: a verified Vercel Preview deployment for the exact project/team/commit.

- [ ] **Step 1: Run the full local release gate**

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
git status --short
```

Expected: all tests pass, build succeeds, diff check succeeds, and the worktree is clean.

- [ ] **Step 2: Push the feature branch and create an explicit Preview**

Push `codex/adsterra-benchmark-layout`. Deploy through the existing Warhounds Vercel project with an explicit Preview target. Read back and require:

```text
project_id = prj_U0KeNuy8RLq0mrvLUnA0w0zUDojA
scope_id = team_tNWNDROwADhcfYibzr6NX0I3
target/environment = preview
state = READY
commit_sha = exact feature HEAD
```

If the provider classifies the deployment as Production, stop the release chain, record the incident, and use the hardened recovery path. Do not reuse the historical Warhounds waiver.

- [ ] **Step 3: Verify no-consent Preview behavior**

For all four guide routes at 1440×900 and 390×844, verify:

```text
HTTP 200
Advertisement labels present
Adsterra iframe/script/request count = 0
horizontal overflow = false
console errors = 0
page errors = 0
URL unchanged
new windows = 0
```

- [ ] **Step 4: Verify consented Preview behavior**

Grant optional consent through the visible Cookie UI, then verify each guide:

```text
Desktop rendered units <= 5 and include top, inline one, inline two, rail, Native
Mobile rendered units <= 3 and exclude top and rail
Each unit ID is Warhounds-specific and unique per page position
Provider requests use only exact Task 1 script hosts/paths
No bottom adhesion
No footer overlap
No horizontal overflow
No console/page errors attributable to site code
No automatic navigation or popup
```

Provider ad clicks are not part of QA and must not be triggered.

- [ ] **Step 5: Fix and repeat if needed**

For any deterministic site bug, first add a failing test reproducing it, implement the smallest fix, rerun the full local gate, deploy a new Preview, and repeat Steps 3–4. If the provider itself returns no inventory, record `NO_FILL_OBSERVED`; do not invent an impression.

---

### Task 7: Production Release, Provider Read-Back, and Case Export

**Files:**
- Modify: Factory `cases/warhounds-release-20260813/release-observations.json`
- Modify: Factory `cases/warhounds-release-20260813/production-qa-observations.json`
- Modify: Factory `cases/warhounds-release-20260813/case-export-input.json`
- Regenerate: Factory `artifacts/site-builder/warhounds-release-20260813/case-export.json`
- Regenerate: Factory `artifacts/site-builder/warhounds-release-20260813/case-export.md`

**Interfaces:**
- Consumes: verified Preview, exact feature commit, Adsterra provider state, and formal-domain QA.
- Produces: promoted Production plus current structured release evidence without rewriting history.

- [ ] **Step 1: Fast-forward `main` and push without force**

After Preview QA passes, fast-forward local `main` to the verified feature commit and push `origin/main`. Do not rebase or force push after Preview verification.

- [ ] **Step 2: Read back the Production deployment**

Require exact Vercel evidence before declaring release:

```text
project_id = prj_U0KeNuy8RLq0mrvLUnA0w0zUDojA
scope_id = team_tNWNDROwADhcfYibzr6NX0I3
target/environment = production
state = READY
promotion = PROMOTED
commit_sha = exact main HEAD
apex and www aliases target the same deployment
```

- [ ] **Step 3: Run formal-domain QA**

Repeat Task 6 no-consent and consented checks on `https://warhoundsguide.online`. Also verify canonical, sitemap, robots, JSON-LD, GA consent behavior, AdSense verification meta, exact `ads.txt`, redirects, favicon, internal links, and Vercel runtime error scan.

- [ ] **Step 4: Read provider operating state**

Return to the Warhounds website and five units in Adsterra. Record the exact website/unit states. Mark impressions and revenue `UNKNOWN` unless the provider UI shows source-bound nonzero observations for these exact Warhounds unit IDs. Valid operational progression is:

```text
CODE_IMPLEMENTED → SITE_SUBMITTED → REVIEW_PENDING → APPROVED → SERVING → IMPRESSION_CONFIRMED → REVENUE_CONFIRMED
```

- [ ] **Step 5: Update Factory evidence without altering history**

Record current Production ID/URL/commit/times, five Adsterra units, consent QA, provider state, and live request/no-fill observations. Preserve the original Preview ledger digest, initial Production incident, rejected candidate, and one-time `reusable=false` waiver byte-for-byte where required. Recompute source digests in `case-export-input.json`.

- [ ] **Step 6: Regenerate and verify Case Export**

```bash
node scripts/warhounds-case-export.mjs cases/warhounds-release-20260813/case-export-input.json
node --test dist/tests/site-operations-feedback-contract.test.js
pnpm test
pnpm lint
pnpm build
git diff --check
```

Expected: export state is `WARHOUNDS_CASE_EXPORT_READY`, all source digests verify, incident history is preserved, waiver remains non-reusable, and the full Factory gate passes.

- [ ] **Step 7: Commit and push Factory evidence**

```bash
git add cases/warhounds-release-20260813/case-export-input.json cases/warhounds-release-20260813/production-qa-observations.json cases/warhounds-release-20260813/release-observations.json
git commit -m "docs: record Warhounds Adsterra release"
git push origin codex/vercel-preview-safety-hardening
```

- [ ] **Step 8: Report only proven state**

Report the formal URL, GitHub commit, Vercel deployment, provider website/unit IDs, desktop/mobile placement counts, consent behavior, Adsterra review/serving state, impressions/revenue state, tests/build/QA, Factory commit, and Case Export paths/digests. Do not call code presence “serving” or provider review “revenue.”
