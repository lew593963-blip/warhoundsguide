import {describe, expect, it} from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {buildArticleJsonLd, buildArticleMetadata} from "@/lib/article-metadata";
import {contentRegistry} from "@/lib/content-registry";
import {siteConfig} from "@/lib/site";

describe("canonical indexing and structured data", () => {
  it("publishes exactly nine canonical English URLs", () => {
    expect(sitemap().map((entry) => entry.url).sort()).toEqual([
      "https://warhoundsguide.online",
      "https://warhoundsguide.online/about",
      "https://warhoundsguide.online/base-upgrades",
      "https://warhoundsguide.online/beginner-guide",
      "https://warhoundsguide.online/contact",
      "https://warhoundsguide.online/privacy-policy",
      "https://warhoundsguide.online/squad-guide",
      "https://warhoundsguide.online/terms-of-service",
      "https://warhoundsguide.online/weapons-guide",
    ]);
  });

  it("points robots at the target canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: {userAgent: "*", allow: "/"},
      sitemap: "https://warhoundsguide.online/sitemap.xml",
      host: "https://warhoundsguide.online",
    });
  });

  it("gives every guide canonical metadata and Article JSON-LD", () => {
    for (const entry of contentRegistry) {
      expect(buildArticleMetadata(entry).alternates?.canonical).toBe(entry.route);
      const jsonLd = buildArticleJsonLd(entry);
      expect(jsonLd["@type"]).toBe("Article");
      expect(jsonLd.mainEntityOfPage).toBe(`${siteConfig.url}${entry.route}`);
    }
  });

  it("emits no www or preview hostname", () => {
    const payload = JSON.stringify(sitemap());
    expect(payload).not.toContain("www.");
    expect(payload).not.toContain("vercel.app");
  });
});
