import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";

import {InformationPage} from "@/components/information-page";
import type {Locale} from "@/i18n/routing";
import {aboutContent} from "@/lib/information";
import {localizePath} from "@/lib/locale-path";
import {buildLocalizedMetadata} from "@/lib/seo";
import {routes} from "@/lib/site";

export async function generateMetadata({params}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  return buildLocalizedMetadata(locale, "about", routes.about);
}

export default async function AboutPage({params}: PageProps<"/[locale]/about">) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <InformationPage content={aboutContent[locale]} ctaHref={localizePath(routes.beginnerGuide, locale)} />;
}
