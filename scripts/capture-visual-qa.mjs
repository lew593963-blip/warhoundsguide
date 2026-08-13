import {chromium} from "playwright";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const outputRoot = path.resolve("artifacts/visual-qa");
const routes = [
  {key: "home", pathname: "/"},
  {key: "beginner-guide", pathname: "/beginner-guide"},
  {key: "squad-guide", pathname: "/squad-guide"},
  {key: "base-upgrades", pathname: "/base-upgrades"},
  {key: "weapons-guide", pathname: "/weapons-guide"},
  {key: "about", pathname: "/about"},
  {key: "contact", pathname: "/contact"},
  {key: "privacy", pathname: "/privacy-policy"},
  {key: "terms", pathname: "/terms-of-service"},
];
const viewports = [
  {key: "desktop", width: 1440, height: 900},
  {key: "mobile", width: 390, height: 844},
];
const captureKeys = process.env.CAPTURE_KEYS?.split(",").filter(Boolean);

const browser = await chromium.launch({channel: "chrome", headless: true});
const results = [];

try {
  for (const route of routes) {
    for (const viewport of viewports) {
      const captureKey = `${route.key}-${viewport.key}`;
      if (captureKeys && !captureKeys.includes(captureKey)) continue;

      const outputDir = path.join(outputRoot, captureKey);
      await mkdir(outputDir, {recursive: true});
      const context = await browser.newContext({
        viewport: {width: viewport.width, height: viewport.height},
        deviceScaleFactor: 1,
        colorScheme: "dark",
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const response = await page.goto(`${baseUrl}${route.pathname}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      await page.screenshot({path: path.join(outputDir, "top.png")});
      await page.screenshot({
        path: path.join(outputDir, "full-page.png"),
        fullPage: true,
      });

      const evidence = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const internalLinks = Array.from(document.querySelectorAll("a[href]"))
          .map((link) => link.getAttribute("href"))
          .filter((href) => href?.startsWith("/"));

        return {
          url: location.href,
          title: document.title,
          lang: document.documentElement.lang,
          h1: document.querySelector("h1")?.textContent?.trim(),
          h2Count: document.querySelectorAll("h2").length,
          hasMain: Boolean(document.querySelector("main#main-content")),
          hasHeader: Boolean(document.querySelector("header.site-header")),
          hasFooter: Boolean(document.querySelector("footer.site-footer")),
          hasHorizontalOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          internalLinks: [...new Set(internalLinks)],
          unexpectedBrandPresent: !bodyText.toLowerCase().includes("warhounds"),
          metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content"),
        };
      });

      const result = {
        route: route.pathname,
        viewport,
        status: response?.status(),
        consoleErrors,
        pageErrors,
        ...evidence,
      };
      results.push(result);
      console.log(`Captured ${captureKey}: ${result.status}, ${result.h1}`);
      await writeFile(
        path.join(outputDir, "evidence.json"),
        `${JSON.stringify(result, null, 2)}\n`,
      );
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputRoot, "summary.json"),
  `${JSON.stringify(results, null, 2)}\n`,
);

const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.hasHorizontalOverflow ||
    result.unexpectedBrandPresent ||
    !result.hasMain ||
    !result.hasHeader ||
    !result.hasFooter,
);

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    `Captured ${results.length} route/viewport combinations with no structural failures.`,
  );
}
