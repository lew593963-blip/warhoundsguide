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
  z.object({enabled: z.literal(false)}),
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

const adsterraSchema = z.discriminatedUnion("enabled", [
  z.object({enabled: z.literal(false)}),
  z.object({
    enabled: z.literal(true),
    scriptId: z.string().min(1),
    scriptUrl: urlSchema,
    containerId: z.string().min(1),
    consentRequired: z.boolean(),
  }),
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
