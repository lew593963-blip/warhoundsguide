import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";

import {InformationPage} from "@/components/information-page";
import type {Locale} from "@/i18n/routing";
import {contactContent} from "@/lib/information";
import {buildLocalizedMetadata} from "@/lib/seo";
import {routes, siteLinks} from "@/lib/site";

export async function generateMetadata({params}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  return buildLocalizedMetadata(locale, "contact", routes.contact);
}

export default async function ContactPage({params}: PageProps<"/[locale]/contact">) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <InformationPage content={contactContent[locale]} ctaHref={siteLinks.repository} external />;
}
