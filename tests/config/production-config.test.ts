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

  it("ships analytics and every advertising integration disabled", () => {
    expect(rootConfig.integrations).toEqual({
      analytics: {enabled: false},
      adsense: {enabled: false},
      adsterra: {enabled: false},
    });
    expect(JSON.stringify(rootConfig.integrations)).not.toMatch(/G-|ca-pub-|atOptions/);
  });
});
