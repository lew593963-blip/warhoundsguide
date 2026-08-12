import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";

import {LegalPage} from "@/components/legal-page";
import type {Locale} from "@/i18n/routing";
import {legalContent} from "@/lib/legal-content";
import {localizePath} from "@/lib/locale-path";
import {buildLocalizedMetadata} from "@/lib/seo";
import {routes} from "@/lib/site";

export async function generateMetadata({params}: PageProps<"/[locale]/terms-of-service">): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  return buildLocalizedMetadata(locale, "terms", routes.terms);
}

export default async function TermsPage({params}: PageProps<"/[locale]/terms-of-service">) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const legal = legalContent[locale];

  return (
    <LegalPage
      title={legal.termsTitle}
      intro={legal.termsIntro}
      updated={legal.updated}
      sections={legal.termsSections}
      contactHref={localizePath(routes.contact, locale)}
      contactLabel={legal.contactLabel}
    />
  );
}
