import {readFileSync} from "node:fs";
import {resolve} from "node:path";

import {describe, expect, it} from "vitest";

describe("favicon asset", () => {
  it("ships a valid top-level App Router favicon", () => {
    const favicon = readFileSync(
      resolve(process.cwd(), "app/favicon.ico"),
    );

    expect([...favicon.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(favicon.byteLength).toBeGreaterThan(100);
  });
});
