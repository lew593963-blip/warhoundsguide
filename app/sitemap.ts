import type {MetadataRoute} from "next";

import {rootConfig} from "@/config";
import {locales} from "@/i18n/routing";
import {contentRegistry} from "@/lib/content-registry";
import {localizePath} from "@/lib/locale-path";
import {localizedStaticRoutes, routes} from "@/lib/site";

function absoluteUrl(pathname: string): string {
  return pathname === "/"
    ? rootConfig.site.url
    : `${rootConfig.site.url}${pathname}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = locales.flatMap((locale) =>
    localizedStaticRoutes.map((route) => {
      const pathname = localizePath(route, locale);
      return {
        url: absoluteUrl(pathname),
        lastModified: new Date("2026-08-12T00:00:00.000Z"),
        changeFrequency: route === routes.home ? "weekly" as const : "monthly" as const,
        priority: route === routes.home ? 1 : 0.7,
      };
    }),
  );

  const contentEntries = contentRegistry.map((entry) => ({
    url: absoluteUrl(localizePath(entry.route, entry.locale)),
    lastModified: new Date(`${entry.frontmatter.updatedAt}T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...contentEntries];
}
