import {BookOpenText, ChevronRight, Database, ShieldCheck} from "lucide-react";
import Link from "next/link";
import type {ReactNode} from "react";

import {rootConfig} from "@/config";
import type {Locale} from "@/i18n/routing";
import type {GuideFrontmatter} from "@/lib/content";
import {localizePath} from "@/lib/locale-path";
import {routes} from "@/lib/site";

import {AdsterraNativeBanner} from "./adsterra-native-banner";
import styles from "./article-shell.module.css";

type ArticleShellProps = {
  locale: Locale;
  frontmatter: GuideFrontmatter;
  parentHref?: string;
  relatedGuides?: ReadonlyArray<{href: string; label: string}>;
  children: ReactNode;
};

type EvidenceBadgeProps = {
  type: "official" | "verified" | "community" | "pending";
  children: ReactNode;
};

export function EvidenceBadge({type, children}: EvidenceBadgeProps) {
  return (
    <span className={styles.evidenceBadge} data-evidence={type}>
      <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.8} />
      {children}
    </span>
  );
}

export function ArticleShell({
  locale,
  frontmatter,
  parentHref,
  relatedGuides = [],
  children,
}: ArticleShellProps) {
  const resolvedParentHref = parentHref ?? localizePath(routes.home, locale);
  const adsterra = rootConfig.integrations.adsterra;

  return (
    <main id="main-content" className={styles.articlePage}>
      <header className={styles.articleHero}>
        <div className="page-width page-width--narrow">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href={localizePath(routes.home, locale)}>{rootConfig.site.name}</Link>
            <ChevronRight aria-hidden="true" size={13} />
            <Link href={resolvedParentHref}>{frontmatter.parentLabel}</Link>
          </nav>
          <p className="eyebrow">{frontmatter.eyebrow}</p>
          <h1>{frontmatter.displayTitle}</h1>
          <p className={styles.articleDeck}>{frontmatter.description}</p>
          <div className={styles.articleMeta}>
            <span><BookOpenText aria-hidden="true" size={14} />{frontmatter.readingTime}</span>
            <span>{frontmatter.reviewed}</span>
          </div>
        </div>
      </header>

      <div className={`page-width page-width--narrow ${styles.sourceNote}`}>
        <Database aria-hidden="true" size={20} strokeWidth={1.5} />
        <div>
          <strong>{frontmatter.sourceLabel}</strong>
          <p>{frontmatter.sourceSummary}</p>
        </div>
      </div>

      <article className={`page-width page-width--narrow ${styles.prose}`}>
        {children}
      </article>
      {relatedGuides.length > 0 ? (
        <nav className={`page-width page-width--narrow ${styles.related}`} aria-label="Related guides">
          <strong>Continue with an evidence-checked guide</strong>
          <div>
            {relatedGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>{guide.label}</Link>
            ))}
          </div>
        </nav>
      ) : null}
      {adsterra.enabled ? <AdsterraNativeBanner placement={adsterra} /> : null}
    </main>
  );
}
