import fs from "node:fs";
import path from "node:path";

import {describe, expect, it} from "vitest";

const roots = ["app", "components", "config", "content", "docs", "i18n", "lib", "messages", "public", "research"];
const forbidden = [
  ["se", "phiria"].join(""),
  ["grain", " rot"].join(""),
  ["grain", "rot"].join(""),
  ["grain", "-rot"].join(""),
  ["ob", "sidian"].join(""),
];

function walk(directory: string): string[] {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target);
    return [target];
  });
}

describe("project isolation", () => {
  it("contains no identity or content residue from another site", () => {
    const files = roots.flatMap((root) => walk(path.join(process.cwd(), root)));
    for (const file of files) {
      const source = fs.readFileSync(file, "utf8").toLowerCase();
      for (const residue of forbidden) {
        expect(source, `${file} contains ${residue}`).not.toContain(residue);
      }
    }
  });
});
