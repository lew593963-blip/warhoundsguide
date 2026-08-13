import {MDXRemote} from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import type {ComponentType} from "react";
import remarkGfm from "remark-gfm";

import {rootConfig, type RootConfig} from "@/config";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/article-metadata";
import type {ContentEntry} from "@/lib/content-registry";

import {AdsterraPlacement} from "./adsterra-placement";
import {ArticleShell, EvidenceBadge} from "./article-shell";
import {JsonLd} from "./json-ld";

type ArticleRendererProps = {
  entry: ContentEntry;
  parentHref?: string;
  relatedGuides?: ReadonlyArray<{href: string; label: string}>;
  jsonLdHeadline?: "title" | "displayTitle";
};

function AdsterraInlineOne() {
  const adsterra = rootConfig.integrations.adsterra;
  if (!adsterra.enabled) return null;
  return (
    <AdsterraPlacement
      placement={adsterra.placements.inlineBannerOne}
      position="inline"
    />
  );
}

function AdsterraInlineTwo() {
  const adsterra = rootConfig.integrations.adsterra;
  if (!adsterra.enabled) return null;
  return (
    <AdsterraPlacement
      placement={adsterra.placements.inlineBannerTwo}
      position="inline"
    />
  );
}

function DisabledAdsterraPlacement() {
  return null;
}

const NO_AD_COMPONENTS: Record<string, ComponentType> = {
  AdsterraInlineOne: DisabledAdsterraPlacement,
  AdsterraInlineTwo: DisabledAdsterraPlacement,
};
const AD_COMPONENTS: Record<string, ComponentType> = {
  AdsterraInlineOne,
  AdsterraInlineTwo,
};

export function createArticleAdComponents(
  integration: RootConfig["integrations"]["adsterra"],
) {
  return integration.enabled ? AD_COMPONENTS : NO_AD_COMPONENTS;
}

export function ArticleRenderer({
  entry,
  parentHref,
  relatedGuides,
  jsonLdHeadline,
}: ArticleRendererProps) {
  const adsterra = rootConfig.integrations.adsterra;
  const adComponents = createArticleAdComponents(adsterra);

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd(entry, {headline: jsonLdHeadline})}
      />
      <JsonLd data={buildBreadcrumbJsonLd(entry)} />
      <ArticleShell
        locale={entry.locale}
        frontmatter={entry.frontmatter}
        parentHref={parentHref}
        relatedGuides={relatedGuides}
      >
        <MDXRemote
          source={entry.source}
          components={{EvidenceBadge, ...adComponents}}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </ArticleShell>
    </>
  );
}
