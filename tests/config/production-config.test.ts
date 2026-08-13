import {readFileSync} from "node:fs";
import {resolve} from "node:path";

import {describe, expect, it} from "vitest";

import {rootConfig} from "@/config";

describe("Warhounds production target config", () => {
  it("owns the correct game, domain, legal identity, and repository", () => {
    expect(rootConfig.game.name).toBe("Warhounds");
    expect(rootConfig.game.steamAppId).toBe("3929470");
    expect(rootConfig.site.url).toBe("https://warhoundsguide.online");
    expect(rootConfig.site.copyright.holder).toBe("Warhounds Guide");
    expect(rootConfig.links.repository).toBe("https://github.com/lew593963-blip/warhoundsguide");
  });

  it("keeps analytics isolated and AdSense serving disabled", () => {
    expect(rootConfig.integrations.analytics).toEqual({
      enabled: true,
      measurementIdEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    });
    expect(rootConfig.integrations.adsense).toEqual({
      enabled: false,
      siteVerification: {
        publisherId: "ca-pub-4904968441728478",
        metaName: "google-adsense-account",
      },
    });
    expect(JSON.stringify(rootConfig.integrations)).not.toMatch(
      /G-RY8XD6LH7X|atOptions/,
    );
  });

  it("enables five isolated consent-gated Warhounds Adsterra placements", () => {
    const adsterra = rootConfig.integrations.adsterra;
    expect(adsterra.enabled).toBe(true);
    if (!adsterra.enabled) throw new Error("Adsterra must be enabled");

    expect(adsterra.consentRequired).toBe(true);
    expect(Object.keys(adsterra.placements)).toEqual([
      "topLeaderboard",
      "inlineBannerOne",
      "inlineBannerTwo",
      "desktopRail",
      "nativeBanner",
    ]);
    expect(
      new Set(Object.values(adsterra.placements).map((item) => item.unitId)),
    ).toHaveLength(5);
    expect(
      Object.values(adsterra.placements).every((item) =>
        item.scriptUrl.startsWith("https://"),
      ),
    ).toBe(true);
    expect(Object.values(adsterra.placements).map((item) => item.unitId)).toEqual([
      "30725311",
      "30725327",
      "30725331",
      "30725336",
      "30725310",
    ]);
    expect(JSON.stringify(adsterra)).not.toMatch(
      /popunder|smartlink|social.?bar|adult|anti.?adblock|bottom.?adhesion/i,
    );
  });

  it("publishes only the account-level AdSense ads.txt declaration", () => {
    const adsTxt = readFileSync(
      resolve(process.cwd(), "public/ads.txt"),
      "utf8",
    );

    expect(adsTxt).toBe(
      "google.com, pub-4904968441728478, DIRECT, f08c47fec0942fa0\n",
    );
  });
});
