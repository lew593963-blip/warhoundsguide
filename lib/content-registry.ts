import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import {z} from "zod";

import {locales, type Locale} from "@/i18n/routing";

export const contentTypes = ["guide"] as const;
export type ContentType = (typeof contentTypes)[number];

const rawFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  displayTitle: z.string().min(1),
  eyebrow: z.string().min(1),
  reviewed: z.string().min(1),
  readingTime: z.string().min(1),
  sourceSummary: z.string().min(1),
  sourceLabel: z.string().min(1),
  parentLabel: z.string().min(1),
  navigationLabel: z.string().min(1),
  libraryDescription: z.string().min(1),
  primaryKeyword: z.string().min(1),
  order: z.number().int().nonnegative(),
  updatedAt: z.iso.date(),
});

export type ContentFrontmatter = z.infer<typeof rawFrontmatterSchema>;

export type ContentEntry = {
  id: string;
  type: ContentType;
  locale: Locale;
  slug: string;
  route: string;
  sourcePath: string;
  frontmatter: ContentFrontmatter;
  source: string;
};

function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

function readContentEntries(): ContentEntry[] {
  const guidesRoot = path.join(process.cwd(), "content", "guides");
  const entries = fs.readdirSync(guidesRoot, {withFileTypes: true}).flatMap(
    (localeEntry) => {
      if (!localeEntry.isDirectory() || !isLocale(localeEntry.name)) return [];

      const locale = localeEntry.name;
      const localeRoot = path.join(guidesRoot, locale);
      return fs
        .readdirSync(localeRoot, {withFileTypes: true})
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => {
          const slug = entry.name.slice(0, -4);
          const sourcePath = path.join(localeRoot, entry.name);
          const file = fs.readFileSync(sourcePath, "utf8");
          const {data, content} = matter(file);

          return {
            id: `guide:${locale}:${slug}`,
            type: "guide" as const,
            locale,
            slug,
            route: `/${slug}`,
            sourcePath,
            frontmatter: rawFrontmatterSchema.parse(data),
            source: content.trim(),
          } satisfies ContentEntry;
        });
    },
  );

  const routeKeys = entries.map(({locale, route}) => `${locale}:${route}`);
  if (new Set(routeKeys).size !== routeKeys.length) {
    throw new Error("Duplicate content route in guide registry");
  }

  return entries.sort(
    (left, right) => left.frontmatter.order - right.frontmatter.order,
  );
}

export const contentRegistry = readContentEntries();

export function getContentEntries(filter: {
  type?: ContentType;
  locale?: Locale;
} = {}): ContentEntry[] {
  return contentRegistry.filter(
    (entry) =>
      (!filter.type || entry.type === filter.type) &&
      (!filter.locale || entry.locale === filter.locale),
  );
}

export function getContentEntry(
  type: ContentType,
  locale: Locale,
  slug: string,
): ContentEntry | undefined {
  return contentRegistry.find(
    (entry) =>
      entry.type === type && entry.locale === locale && entry.slug === slug,
  );
}
