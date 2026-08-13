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

  it("enables only the isolated Warhounds analytics integration", () => {
    expect(rootConfig.integrations).toEqual({
      analytics: {
        enabled: true,
        measurementIdEnv: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      },
      adsense: {
        enabled: false,
        siteVerification: {
          publisherId: "ca-pub-4904968441728478",
          metaName: "google-adsense-account",
        },
      },
      adsterra: {enabled: false},
    });
    expect(JSON.stringify(rootConfig.integrations)).not.toMatch(
      /G-RY8XD6LH7X|atOptions/,
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
