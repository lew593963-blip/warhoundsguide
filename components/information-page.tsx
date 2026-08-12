import {ArrowRight, ExternalLink} from "lucide-react";
import Link from "next/link";

import type {InformationContent} from "@/lib/information";

type InformationPageProps = {
  content: InformationContent;
  ctaHref: string;
  external?: boolean;
};

export function InformationPage({content, ctaHref, external = false}: InformationPageProps) {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero page-width page-width--narrow">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="legal-intro">{content.intro}</p>
      </header>
      <article className="legal-content page-width page-width--narrow">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {external ? (
          <a className="button button--primary legal-cta" href={ctaHref} target="_blank" rel="noreferrer">
            {content.cta}<ExternalLink aria-hidden="true" size={15} />
          </a>
        ) : (
          <Link className="button button--primary legal-cta" href={ctaHref}>
            {content.cta}<ArrowRight aria-hidden="true" size={15} />
          </Link>
        )}
      </article>
    </main>
  );
}
