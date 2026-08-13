import type {Metadata} from "next";

import {rootConfig} from "@/config";
import {
  getContentEntries,
  type ContentEntry,
} from "@/lib/content-registry";
import {localizePath} from "@/lib/locale-path";

function localizedRoute(entry: ContentEntry): string {
  return localizePath(entry.route, entry.locale);
}

function languageAlternates(entry: ContentEntry): Record<string, string> {
  const variants = getContentEntries({type: entry.type}).filter(
    (candidate) => candidate.slug === entry.slug,
  );
  const defaultEntry = variants.find((candidate) => candidate.locale === "en") ?? entry;

  return Object.fromEntries([
    ...variants.map((candidate) => [candidate.locale, localizedRoute(candidate)]),
    ["x-default", localizedRoute(defaultEntry)],
  ]);
}

export function buildArticleMetadata(entry: ContentEntry): Metadata {
  const canonical = localizedRoute(entry);

  return {
    title: {absolute: entry.frontmatter.title},
    description: entry.frontmatter.description,
    alternates: {
      canonical,
      languages: languageAlternates(entry),
    },
    openGraph: {
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      type: "article",
      url: canonical,
      images: [rootConfig.brand.defaultOgImage],
    },
  };
}

export function buildArticleJsonLd(
  entry: ContentEntry,
  options: {headline?: "title" | "displayTitle"} = {},
) {
  const headline = options.headline ?? "displayTitle";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.frontmatter[headline],
    description: entry.frontmatter.description,
    dateModified: entry.frontmatter.updatedAt,
    inLanguage: entry.locale,
    mainEntityOfPage: `${rootConfig.site.url}${localizedRoute(entry)}`,
    author: {"@type": "Organization", name: rootConfig.site.name},
  };
}

export function buildBreadcrumbJsonLd(entry: ContentEntry) {
  const canonical = `${rootConfig.site.url}${localizedRoute(entry)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: rootConfig.site.name,
        item: rootConfig.site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: entry.frontmatter.navigationLabel,
        item: canonical,
      },
    ],
  };
}
