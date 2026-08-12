import {describe, expect, it} from "vitest";

import {contentRegistry} from "@/lib/content-registry";
import {coreGuides, routes} from "@/lib/site";

describe("first guide cluster", () => {
  it("publishes four substantial non-overlapping guides", () => {
    expect(contentRegistry.map((entry) => entry.slug)).toEqual([
      "beginner-guide",
      "squad-guide",
      "base-upgrades",
      "weapons-guide",
    ]);
    expect(coreGuides).toHaveLength(4);
    expect(routes).not.toHaveProperty("classesGuide");
    expect(routes).not.toHaveProperty("combatGuide");
    expect(routes).not.toHaveProperty("missionWalkthrough");
  });

  it("keeps every article above the thin-content floor", () => {
    for (const entry of contentRegistry) {
      const words = entry.source.split(/\s+/).filter(Boolean);
      expect(words.length, entry.slug).toBeGreaterThan(700);
      expect(entry.frontmatter.description.length, entry.slug).toBeLessThanOrEqual(180);
    }
  });
});
