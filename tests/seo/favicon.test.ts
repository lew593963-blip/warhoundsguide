import {readFileSync} from "node:fs";
import {resolve} from "node:path";

import {describe, expect, it} from "vitest";

describe("favicon asset", () => {
  it("ships a valid stable public favicon for Google Search", () => {
    const favicon = readFileSync(
      resolve(process.cwd(), "public/favicon.ico"),
    );

    expect([...favicon.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(favicon.byteLength).toBeGreaterThan(100);
  });
});
