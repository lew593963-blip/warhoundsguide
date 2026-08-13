// @vitest-environment node

import {spawn, type ChildProcess} from "node:child_process";
import {existsSync} from "node:fs";
import {resolve} from "node:path";

import {chromium, type Browser, type BrowserContext} from "playwright";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

const port = 3417;
const origin = `http://127.0.0.1:${port}`;
const guideRoutes = [
  "/en/beginner-guide",
  "/en/squad-guide",
  "/en/base-upgrades",
  "/en/weapons-guide",
];
const zeroAdRoutes = [
  "/en",
  "/en/about",
  "/en/contact",
  "/en/privacy-policy",
  "/en/terms-of-service",
  "/en/not-a-real-page",
  "/robots.txt",
  "/sitemap.xml",
];

let server: ChildProcess;
let browser: Browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/en`);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error("Warhounds test server did not start in time");
}

async function createContext(width: number): Promise<BrowserContext> {
  const context = await browser.newContext({viewport: {width, height: 900}});
  await context.addInitScript(() => {
    window.localStorage.setItem("warhounds-guide-consent", "granted");
  });
  await context.route(/(?:highperformanceformat|effectivecpmnetwork)\.com/, (route) =>
    route.abort(),
  );
  return context;
}

beforeAll(async () => {
  server = spawn(
    resolve(process.cwd(), "node_modules/.bin/next"),
    ["dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {cwd: process.cwd(), detached: true, stdio: "ignore"},
  );
  await waitForServer();
  const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  browser = await chromium.launch({
    headless: true,
    executablePath: existsSync(localChrome) ? localChrome : undefined,
  });
}, 30_000);

afterAll(async () => {
  await browser?.close();
  if (server?.pid) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      // The process may already have exited after the browser closes.
    }
  }
});

describe("actual Adsterra route composition", () => {
  it("renders five distinct placements on every desktop guide route", async () => {
    const context = await createContext(1440);
    const page = await context.newPage();

    for (const route of guideRoutes) {
      await page.goto(`${origin}${route}`, {waitUntil: "domcontentloaded"});
      const frames = page.locator('iframe[title="Advertisement content"]');
      await expect.poll(() => frames.count()).toBe(5);
      const unitIds = await frames.evaluateAll((items) =>
        items.map((item) => item.getAttribute("data-adsterra-unit")),
      );
      expect(new Set(unitIds), route).toHaveLength(5);
    }

    await context.close();
  });

  it("renders only the two inline units and Native unit on every mobile guide", async () => {
    const context = await createContext(390);
    const page = await context.newPage();

    for (const route of guideRoutes) {
      await page.goto(`${origin}${route}`, {waitUntil: "domcontentloaded"});
      const frames = page.locator('iframe[title="Advertisement content"]');
      await expect.poll(() => frames.count()).toBe(3);
      await expect(frames.evaluateAll((items) =>
        items.map((item) => item.getAttribute("data-adsterra-unit")),
      )).resolves.toEqual(["30725327", "30725331", "30725310"]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        route,
      ).toBe(true);
    }

    await context.close();
  });

  it("keeps every non-guide surface free of Adsterra frames", async () => {
    const context = await createContext(1440);
    const page = await context.newPage();

    for (const route of zeroAdRoutes) {
      await page.goto(`${origin}${route}`, {waitUntil: "domcontentloaded"});
      expect(
        await page.locator('iframe[title="Advertisement content"]').count(),
        route,
      ).toBe(0);
    }

    await context.close();
  });
});
