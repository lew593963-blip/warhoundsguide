import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";
import {notFound, redirect} from "next/navigation";

import {ArticleRenderer} from "@/components/article-renderer";
import type {Locale} from "@/i18n/routing";
import {buildArticleMetadata} from "@/lib/article-metadata";
import {getContentEntries} from "@/lib/content-registry";

type GuidePageProps = {
  params: Promise<{locale: Locale; guide: string}>;
};

export const dynamicParams = false;
const guideEntries = getContentEntries({type: "guide", locale: "en"});

export function generateStaticParams() {
  return guideEntries.map(({slug}) => ({guide: slug}));
}

export async function generateMetadata({params}: GuidePageProps): Promise<Metadata> {
  const {guide: requestedSlug} = await params;
  const guide = guideEntries.find(({slug}) => slug === requestedSlug);
  if (!guide) notFound();

  return buildArticleMetadata(guide);
}

export default async function GuidePage({params}: GuidePageProps) {
  const {locale, guide: requestedSlug} = await params;
  const guide = guideEntries.find(({slug}) => slug === requestedSlug);
  if (!guide) notFound();
  if (locale !== "en") redirect(guide.route);

  setRequestLocale(locale);
  const relatedGuides = guideEntries
    .filter(({slug}) => slug !== guide.slug)
    .slice(0, 4)
    .map(({route, frontmatter}) => ({
      href: route,
      label: frontmatter.navigationLabel,
    }));

  return (
    <ArticleRenderer
      entry={guide}
      relatedGuides={relatedGuides}
    />
  );
}
