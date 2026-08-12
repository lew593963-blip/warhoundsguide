import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";

import {LegalPage} from "@/components/legal-page";
import type {Locale} from "@/i18n/routing";
import {legalContent} from "@/lib/legal-content";
import {localizePath} from "@/lib/locale-path";
import {buildLocalizedMetadata} from "@/lib/seo";
import {routes} from "@/lib/site";

export async function generateMetadata({params}: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  return buildLocalizedMetadata(locale, "privacy", routes.privacy);
}

export default async function PrivacyPage({params}: PageProps<"/[locale]/privacy-policy">) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const legal = legalContent[locale];

  return (
    <LegalPage
      title={legal.privacyTitle}
      intro={legal.privacyIntro}
      updated={legal.updated}
      sections={legal.privacySections}
      contactHref={localizePath(routes.contact, locale)}
      contactLabel={legal.contactLabel}
    />
  );
}
