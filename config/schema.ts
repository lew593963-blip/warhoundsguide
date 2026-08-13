import {z} from "zod";

const urlSchema = z.url();
const publicPathSchema = z.string().startsWith("/");

const localizedSeoCopySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const siteSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  url: urlSchema,
  titleTemplate: z.string().includes("%s"),
  homeTitle: z.string().min(1),
  homeDescription: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
  localizedSeo: z.record(z.string(), z.record(z.string(), localizedSeoCopySchema)),
  copyright: z.object({
    year: z.number().int().min(2000),
    holder: z.string().min(1),
  }),
});

const gameSchema = z.object({
  name: z.string().min(1),
  developer: z.string().min(1),
  publisher: z.string().min(1),
  releaseDate: z.iso.date(),
  currentVersion: z.string().min(1),
  steamAppId: z.string().regex(/^\d+$/),
  genres: z.array(z.string().min(1)).min(1),
  platforms: z.array(z.string().min(1)).min(1),
});

const brandSchema = z.object({
  mark192: publicPathSchema,
  mark512: publicPathSchema,
  favicon: publicPathSchema,
  appleIcon: publicPathSchema,
  defaultOgImage: publicPathSchema,
  manifestDescription: z.string().min(1),
  colors: z.object({
    background: z.string().regex(/^#[0-9a-f]{6}$/i),
    theme: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),
});

const linksSchema = z.object({
  steam: urlSchema,
  discord: urlSchema.optional(),
  youtube: urlSchema.optional(),
  repository: urlSchema.optional(),
});

const analyticsSchema = z.discriminatedUnion("enabled", [
  z.object({enabled: z.literal(false)}),
  z.object({
    enabled: z.literal(true),
    measurementIdEnv: z.literal("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
  }),
]);

const adsenseSchema = z.discriminatedUnion("enabled", [
  z.object({
    enabled: z.literal(false),
    siteVerification: z
      .object({
        publisherId: z.string().regex(/^ca-pub-\d+$/),
        metaName: z.literal("google-adsense-account"),
      })
      .optional(),
  }),
  z.object({
    enabled: z.literal(true),
    publisherId: z.string().regex(/^ca-pub-\d+$/),
    metaName: z.literal("google-adsense-account"),
    consentScriptId: z.literal("google-consent-mode-defaults"),
    scriptId: z.string().min(1),
    scriptBaseUrl: urlSchema,
    autoAds: z.boolean(),
  }),
]);

const displayAdsterraPlacementSchema = z
  .object({
    format: z.literal("BANNER"),
    unitId: z.string().regex(/^\d+$/),
    scriptId: z.string().min(1),
    scriptUrl: z.url().startsWith("https://"),
    key: z.string().regex(/^[a-f0-9]{32}$/),
    width: z.number().int().positive().max(780),
    height: z.number().int().positive().max(600),
    viewport: z.enum(["ALL", "DESKTOP_ONLY"]),
  })
  .strict();

const nativeAdsterraPlacementSchema = z
  .object({
    format: z.literal("NATIVE_BANNER"),
    unitId: z.string().regex(/^\d+$/),
    scriptId: z.string().min(1),
    scriptUrl: z.url().startsWith("https://"),
    containerId: z.string().startsWith("container-"),
    viewport: z.literal("ALL"),
  })
  .strict();

const enabledAdsterraSchema = z
  .object({
    enabled: z.literal(true),
    consentRequired: z.literal(true),
    placements: z
      .object({
        topLeaderboard: displayAdsterraPlacementSchema,
        inlineBannerOne: displayAdsterraPlacementSchema,
        inlineBannerTwo: displayAdsterraPlacementSchema,
        desktopRail: displayAdsterraPlacementSchema,
        nativeBanner: nativeAdsterraPlacementSchema,
      })
      .strict(),
  })
  .strict()
  .superRefine(({placements}, context) => {
    const allPlacements = Object.values(placements);
    const uniqueFields = ["unitId", "scriptId"] as const;

    for (const field of uniqueFields) {
      const values = allPlacements.map((placement) => placement[field]);
      if (new Set(values).size !== values.length) {
        context.addIssue({
          code: "custom",
          message: `Adsterra ${field} values must be unique`,
          path: ["placements"],
        });
      }
    }

    const displayKeys = allPlacements
      .filter((placement) => placement.format === "BANNER")
      .map((placement) => placement.key);
    if (new Set(displayKeys).size !== displayKeys.length) {
      context.addIssue({
        code: "custom",
        message: "Adsterra Banner keys must be unique",
        path: ["placements"],
      });
    }

    if (
      placements.topLeaderboard.viewport !== "DESKTOP_ONLY" ||
      placements.desktopRail.viewport !== "DESKTOP_ONLY" ||
      placements.inlineBannerOne.viewport !== "ALL" ||
      placements.inlineBannerTwo.viewport !== "ALL"
    ) {
      context.addIssue({
        code: "custom",
        message: "Adsterra placement viewport policies are fixed",
        path: ["placements"],
      });
    }
  });

const adsterraSchema = z.discriminatedUnion("enabled", [
  z.object({enabled: z.literal(false)}).strict(),
  enabledAdsterraSchema,
]);

export const rootConfigSchema = z.object({
  site: siteSchema,
  game: gameSchema,
  brand: brandSchema,
  links: linksSchema,
  integrations: z.object({
    analytics: analyticsSchema,
    adsense: adsenseSchema,
    adsterra: adsterraSchema,
  }),
});

export type RootConfig = z.infer<typeof rootConfigSchema>;
