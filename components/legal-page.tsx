import Link from "next/link";

import {rootConfig} from "@/config";

type LegalSection = {
  title: string;
  body: string;
};

type LegalPageProps = {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  contactHref?: string;
  contactLabel?: string;
};

export function LegalPage({title, intro, updated, sections, contactHref, contactLabel}: LegalPageProps) {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero page-width page-width--narrow">
        <p className="eyebrow">{rootConfig.site.name}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        <p className="legal-updated">{updated}</p>
      </header>
      <article className="legal-content page-width page-width--narrow">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {contactHref && contactLabel ? (
          <Link className="button button--primary legal-cta" href={contactHref}>
            {contactLabel}
          </Link>
        ) : null}
      </article>
    </main>
  );
}
