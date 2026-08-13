import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";

import {CookieConsent} from "@/components/cookie-consent";
import {consentContent} from "@/lib/consent";

describe("CookieConsent disclosure", () => {
  it("names both optional services before the visitor accepts", () => {
    render(
      <CookieConsent
        content={consentContent.en}
        privacyHref="/privacy-policy"
      />,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Google Analytics");
    expect(screen.getByRole("dialog")).toHaveTextContent("Adsterra");
    expect(screen.getByRole("dialog")).toHaveTextContent("Banner and Native Banner");
    expect(screen.getByRole("dialog")).not.toHaveTextContent(
      "advertising remains disabled",
    );
  });
});
