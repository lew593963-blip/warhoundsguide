import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

const visualQaSource = readFileSync(
  path.join(process.cwd(), "scripts/capture-visual-qa.mjs"),
  "utf8",
);

describe("Warhounds visual QA route configuration", () => {
  it("covers every public Warhounds route", () => {
    const expectedRoutes = [
      "/",
      "/beginner-guide",
      "/squad-guide",
      "/base-upgrades",
      "/weapons-guide",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms-of-service",
    ];

    for (const route of expectedRoutes) {
      expect(visualQaSource).toContain(`pathname: "${route}"`);
    }
  });

  it("contains no retired game route or brand residue", () => {
    const retiredTokens = [
      ["seph", "iria"].join(""),
      ["grain", " rot"].join(""),
      ["grain", "rot", "hub"].join(""),
      ["obsi", "dian"].join(""),
      ["multi", "player"].join(""),
      ["rot", "-sickness"].join(""),
      ["spark", "-abilities"].join(""),
      ["solo", "-guide"].join(""),
      ["ves", "sels"].join(""),
    ];

    for (const token of retiredTokens) {
      expect(visualQaSource.toLowerCase()).not.toContain(token);
    }
  });
});
