import {render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {AdsterraPlacement} from "@/components/adsterra-placement";
import {ArticleShell} from "@/components/article-shell";
import {rootConfig} from "@/config";
import {contentRegistry} from "@/lib/content-registry";
import {CONSENT_STORAGE_KEY} from "@/lib/consent";

const adsterra = rootConfig.integrations.adsterra;
if (!adsterra.enabled) throw new Error("Adsterra fixture must be enabled");
const placements = adsterra.placements;

function setDesktopViewport(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      media: "(min-width: 1200px)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } satisfies MediaQueryList),
  );
}

function renderGuideShell() {
  const guide = contentRegistry[0];
  return render(
    <ArticleShell locale="en" frontmatter={guide.frontmatter}>
      <AdsterraPlacement
        placement={placements.inlineBannerOne}
        position="inline"
      />
      <AdsterraPlacement
        placement={placements.inlineBannerTwo}
        position="inline"
      />
    </ArticleShell>,
  );
}

describe("guide route ad density", () => {
  beforeEach(() => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("renders exactly five distinct placements on desktop", () => {
    setDesktopViewport(true);
    renderGuideShell();

    const frames = screen.getAllByTitle("Advertisement content");
    expect(frames).toHaveLength(5);
    expect(new Set(frames.map((frame) => frame.dataset.adsterraUnit))).toHaveLength(5);
  });

  it("renders only two inline and one Native placement below 1200px", () => {
    setDesktopViewport(false);
    renderGuideShell();

    const frames = screen.getAllByTitle("Advertisement content");
    expect(frames.map((frame) => frame.dataset.adsterraUnit)).toEqual([
      "30725327",
      "30725331",
      "30725310",
    ]);
  });
});
