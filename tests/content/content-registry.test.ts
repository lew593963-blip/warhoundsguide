import {describe, expect, it} from "vitest";

import {contentRegistry} from "@/lib/content-registry";
import {coreGuides, routes} from "@/lib/site";

describe("search-led guide cluster", () => {
  it("publishes five substantial non-overlapping guides", () => {
    expect(contentRegistry.map((entry) => entry.slug)).toEqual([
      "beginner-guide",
      "squad-guide",
      "base-upgrades",
      "weapons-guide",
      "trainer-cheats",
    ]);
    expect(coreGuides).toHaveLength(5);
    expect(routes.trainerCheats).toBe("/trainer-cheats");
    expect(routes).not.toHaveProperty("classesGuide");
    expect(routes).not.toHaveProperty("combatGuide");
    expect(routes).not.toHaveProperty("missionWalkthrough");
  });

  it("consolidates trainer, cheats, and console status into one evidence-bounded page", () => {
    const entry = contentRegistry.find(({slug}) => slug === "trainer-cheats");

    expect(entry?.frontmatter.primaryKeyword).toBe("warhounds trainer");
    expect(entry?.source).toContain("No official trainer or built-in cheat menu");
    expect(entry?.source).toContain("third-party");
    expect(entry?.source).not.toContain("disable your antivirus");
  });

  it("keeps every article above the thin-content floor", () => {
    for (const entry of contentRegistry) {
      const words = entry.source.split(/\s+/).filter(Boolean);
      expect(words.length, entry.slug).toBeGreaterThan(700);
      expect(entry.frontmatter.description.length, entry.slug).toBeLessThanOrEqual(180);
    }
  });

  it("places two ad markers after the second and fourth complete H2 sections", () => {
    for (const entry of contentRegistry) {
      const tokens = entry.source.split(/\n(?=## |<AdsterraInline)/);
      const h2Indexes = tokens
        .map((token, index) => (token.startsWith("## ") ? index : -1))
        .filter((index) => index >= 0);
      const firstAd = tokens.findIndex((token) =>
        token.startsWith("<AdsterraInlineOne"),
      );
      const secondAd = tokens.findIndex((token) =>
        token.startsWith("<AdsterraInlineTwo"),
      );

      expect(
        entry.source.match(/<AdsterraInline(?:One|Two) \/>/g),
        entry.slug,
      ).toHaveLength(2);
      expect(firstAd, entry.slug).toBeGreaterThan(h2Indexes[1]);
      expect(firstAd, entry.slug).toBeLessThan(h2Indexes[2]);
      expect(secondAd, entry.slug).toBeGreaterThan(h2Indexes[3]);
      expect(secondAd, entry.slug).toBeLessThan(h2Indexes[4]);
    }
  });
});
