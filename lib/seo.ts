import type {Metadata} from "next";

import {rootConfig} from "@/config";
import {locales, type Locale} from "@/i18n/routing";
import {localizePath} from "@/lib/locale-path";
import {routes} from "@/lib/site";

export type LocalizedPageKey = "home" | "about" | "contact" | "privacy" | "terms";

type SeoCopy = {title: string; description: string};

const seoCopy = rootConfig.site.localizedSeo as Record<
  Locale,
  Record<LocalizedPageKey, SeoCopy>
>;

export function getSeoCopy(locale: Locale, page: LocalizedPageKey): SeoCopy {
  return seoCopy[locale][page];
}

export function buildLocalizedMetadata(
  locale: Locale,
  page: LocalizedPageKey,
  route: (typeof routes)[keyof typeof routes],
): Metadata {
  const copy = getSeoCopy(locale, page);
  const canonical = localizePath(route, locale);
  const languages = Object.fromEntries([
    ...locales.map((item) => [item, localizePath(route, item)]),
    ["x-default", route],
  ]);

  return {
    title: {absolute: copy.title},
    description: copy.description,
    alternates: {canonical, languages},
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      url: canonical,
      locale: "en_US",
      images: [rootConfig.brand.defaultOgImage],
    },
  };
}
