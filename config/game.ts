import {rootConfigSchema} from "./schema";

export const rootConfig = rootConfigSchema.parse({
  site: {
    name: "Warhounds Guide",
    shortName: "Warhounds Guide",
    url: "https://warhoundsguide.online",
    titleTemplate: "%s | Warhounds Guide",
    homeTitle: "Warhounds Guide — Squads, Base & Combat",
    homeDescription:
      "Independent Warhounds guides for beginner priorities, classes and squad building, base management, weapons, tools, and tactical combat.",
    keywords: [
      "Warhounds",
      "Warhounds guide",
      "Warhounds beginner guide",
      "Warhounds classes",
      "Warhounds squad",
      "Warhounds base upgrades",
      "Warhounds weapons",
      "Warhounds combat",
    ],
    localizedSeo: {
      en: {
        home: {
          title: "Warhounds Guide — Squads, Base & Combat",
          description:
            "Independent Warhounds guides for beginner priorities, classes and squad building, base management, weapons, tools, and tactical combat.",
        },
        about: {
          title: "About Warhounds Guide — Sources & Editorial Policy",
          description:
            "Learn how Warhounds Guide separates official facts, transparent tactical inference, current evidence gaps, and independent fan-site status.",
        },
        contact: {
          title: "Contact Warhounds Guide — Corrections & Feedback",
          description:
            "Report a factual correction, broken link, accessibility issue, or privacy concern to the independent Warhounds Guide project.",
        },
        privacy: {
          title: "Privacy Policy — Warhounds Guide",
          description:
            "Read how Warhounds Guide handles hosting logs, consent-gated analytics, browser storage, external links, and disabled advertising.",
        },
        terms: {
          title: "Terms of Service — Warhounds Guide",
          description:
            "Review the terms for using Warhounds Guide, an independent fan resource with explicit evidence limits and no official affiliation.",
        },
      },
    },
    copyright: {year: 2026, holder: "Warhounds Guide"},
  },
  game: {
    name: "Warhounds",
    developer: "Everplay DMCC",
    publisher: "Brightika, Inc.",
    releaseDate: "2026-08-11",
    currentVersion: "Launch build; sources reviewed August 12, 2026",
    steamAppId: "3929470",
    genres: ["Turn-Based Tactics", "Strategy", "Role-Playing"],
    platforms: ["Windows PC", "Steam"],
  },
  brand: {
    mark192: "/brand/warhounds-mark.svg",
    mark512: "/brand/warhounds-mark.svg",
    favicon: "/brand/warhounds-mark.svg",
    appleIcon: "/brand/warhounds-mark.svg",
    defaultOgImage: "/brand/warhounds-og.svg",
    manifestDescription:
      "Independent Warhounds guides for squads, base management, weapons, tools, and tactical combat.",
    colors: {background: "#07100f", theme: "#e05a32"},
  },
  links: {
    steam: "https://store.steampowered.com/app/3929470/Warhounds/",
    repository: "https://github.com/lew593963-blip/warhoundsguide",
  },
  integrations: {
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
  },
});
