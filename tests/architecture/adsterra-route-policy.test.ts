import {readFileSync} from "node:fs";
import {resolve} from "node:path";

import {describe, expect, it} from "vitest";

import {contentRegistry} from "@/lib/content-registry";

describe("Adsterra route policy", () => {
  it("limits ad-bearing content to the four evidence-backed guide routes", () => {
    expect(contentRegistry.map((entry) => entry.route)).toEqual([
      "/beginner-guide",
      "/squad-guide",
      "/base-upgrades",
      "/weapons-guide",
    ]);

    const guidePage = readFileSync(
      resolve(process.cwd(), "app/[locale]/[guide]/page.tsx"),
      "utf8",
    );
    expect(guidePage).toContain("<ArticleRenderer");

    for (const path of [
      "app/[locale]/page.tsx",
      "app/[locale]/about/page.tsx",
      "app/[locale]/contact/page.tsx",
      "app/[locale]/privacy-policy/page.tsx",
      "app/[locale]/terms-of-service/page.tsx",
    ]) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      expect(source, path).not.toMatch(/ArticleRenderer|ArticleShell|AdsterraPlacement/);
    }
  });
});
