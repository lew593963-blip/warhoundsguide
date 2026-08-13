import {act, render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {ConsentGatedGoogleAnalytics} from "@/components/consent-gated-google-analytics";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
} from "@/lib/consent";

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({gaId}: {gaId: string}) => (
    <div data-testid="google-analytics">{gaId}</div>
  ),
}));

describe("ConsentGatedGoogleAnalytics", () => {
  beforeEach(() => window.localStorage.clear());

  it("does not load analytics without explicit consent", () => {
    render(<ConsentGatedGoogleAnalytics gaId="G-WARHOUNDS" />);
    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("does not load analytics after optional tracking is denied", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    render(<ConsentGatedGoogleAnalytics gaId="G-WARHOUNDS" />);
    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("loads the isolated measurement ID only after consent is granted", () => {
    const {rerender} = render(
      <ConsentGatedGoogleAnalytics gaId="G-WARHOUNDS" />,
    );

    act(() => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
      window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    });
    rerender(<ConsentGatedGoogleAnalytics gaId="G-WARHOUNDS" />);

    expect(screen.getByTestId("google-analytics")).toHaveTextContent(
      "G-WARHOUNDS",
    );
  });
});
