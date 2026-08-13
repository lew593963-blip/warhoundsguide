import {act, cleanup, render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {AdsterraPlacement} from "@/components/adsterra-placement";
import {rootConfig} from "@/config";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
} from "@/lib/consent";

const adsterra = rootConfig.integrations.adsterra;
if (!adsterra.enabled) throw new Error("Adsterra fixture must be enabled");

const displayFixture = adsterra.placements.inlineBannerOne;
const desktopFixture = adsterra.placements.desktopRail;
const nativeFixture = adsterra.placements.nativeBanner;

function setMatchMedia(matches: boolean) {
  let currentMatches = matches;
  let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
  const mediaQueryList = {
    get matches() {
      return currentMatches;
    },
    media: "(min-width: 1200px)",
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: EventListener) => {
      changeListener = listener as (event: MediaQueryListEvent) => void;
    }) as unknown as MediaQueryList["addEventListener"],
    removeEventListener: vi.fn() as unknown as MediaQueryList["removeEventListener"],
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } satisfies MediaQueryList;
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue(mediaQueryList),
  );
  return {
    change(nextMatches: boolean) {
      currentMatches = nextMatches;
      changeListener?.({matches: nextMatches} as MediaQueryListEvent);
    },
  };
}

describe("AdsterraPlacement", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setMatchMedia(true);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates no provider frame before optional consent", () => {
    render(<AdsterraPlacement placement={displayFixture} position="inline" />);

    expect(screen.getByText("Advertisement")).toBeInTheDocument();
    expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
  });

  it("keeps denied inventory inactive", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    render(<AdsterraPlacement placement={displayFixture} position="inline" />);

    expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
  });

  it("mounts the exact display contract once after consent", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    render(<AdsterraPlacement placement={displayFixture} position="inline" />);

    const frame = screen.getByTitle("Advertisement content");
    expect(frame).toHaveAttribute("data-adsterra-unit", displayFixture.unitId);
    expect(frame).toHaveAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
    expect(frame).not.toHaveAttribute("sandbox", expect.stringContaining("allow-same-origin"));
    expect(frame.getAttribute("srcdoc")).toContain(displayFixture.scriptUrl);
    expect(frame.getAttribute("srcdoc")).toContain(displayFixture.key);
    expect(screen.getAllByTitle("Advertisement content")).toHaveLength(1);
  });

  it("mounts the exact Native container and script", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    render(<AdsterraPlacement placement={nativeFixture} position="native" />);

    const frame = screen.getByTitle("Advertisement content");
    expect(frame.getAttribute("srcdoc")).toContain(nativeFixture.containerId);
    expect(frame.getAttribute("srcdoc")).toContain(nativeFixture.scriptUrl);
  });

  it("does not mount desktop-only inventory below 1200 pixels", () => {
    setMatchMedia(false);
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    render(<AdsterraPlacement placement={desktopFixture} position="rail" />);

    expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
  });

  it("removes desktop-only inventory when the viewport becomes narrow", () => {
    const viewport = setMatchMedia(true);
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    render(<AdsterraPlacement placement={desktopFixture} position="rail" />);
    expect(screen.getByTitle("Advertisement content")).toBeInTheDocument();

    act(() => viewport.change(false));

    expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
  });

  it("responds to consent changes and removes a previously mounted frame", () => {
    const {rerender} = render(
      <AdsterraPlacement placement={displayFixture} position="inline" />,
    );

    act(() => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    });
    rerender(<AdsterraPlacement placement={displayFixture} position="inline" />);
    expect(screen.getByTitle("Advertisement content")).toBeInTheDocument();

    act(() => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    });
    rerender(<AdsterraPlacement placement={displayFixture} position="inline" />);
    expect(screen.queryByTitle("Advertisement content")).not.toBeInTheDocument();
  });
});
