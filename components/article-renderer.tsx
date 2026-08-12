import {MDXRemote} from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import {buildArticleJsonLd} from "@/lib/article-metadata";
import type {ContentEntry} from "@/lib/content-registry";

import {ArticleShell, EvidenceBadge} from "./article-shell";
import {JsonLd} from "./json-ld";

type ArticleRendererProps = {
  entry: ContentEntry;
  parentHref?: string;
  relatedGuides?: ReadonlyArray<{href: string; label: string}>;
  jsonLdHeadline?: "title" | "displayTitle";
};

export function ArticleRenderer({
  entry,
  parentHref,
  relatedGuides,
  jsonLdHeadline,
}: ArticleRendererProps) {
  return (
    <>
      <JsonLd
        data={buildArticleJsonLd(entry, {headline: jsonLdHeadline})}
      />
      <ArticleShell
        locale={entry.locale}
        frontmatter={entry.frontmatter}
        parentHref={parentHref}
        relatedGuides={relatedGuides}
      >
        <MDXRemote
          source={entry.source}
          components={{EvidenceBadge}}
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
