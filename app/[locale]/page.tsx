import type {Metadata} from "next";
import {setRequestLocale} from "next-intl/server";

import {rootConfig} from "@/config";
import {HomeContent} from "@/components/home-content";
import {JsonLd} from "@/components/json-ld";
import type {Locale} from "@/i18n/routing";
import {loadMessages} from "@/lib/messages";
import {buildLocalizedMetadata} from "@/lib/seo";
import {routes, siteConfig} from "@/lib/site";

export async function generateMetadata({params}: PageProps<"/[locale]">): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  return {
    ...buildLocalizedMetadata(locale, "home", routes.home),
    keywords: siteConfig.keywords.split(", "),
  };
}

export default async function HomePage({params}: PageProps<"/[locale]">) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const messages = await loadMessages(locale);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            inLanguage: locale,
            description: siteConfig.homeDescription,
          },
          {
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: rootConfig.game.name,
            genre: rootConfig.game.genres,
            gamePlatform: rootConfig.game.platforms,
            datePublished: rootConfig.game.releaseDate,
            developer: {"@type": "Organization", name: rootConfig.game.developer},
            publisher: {"@type": "Organization", name: rootConfig.game.publisher},
            url: rootConfig.links.steam,
          },
        ]}
      />
      <HomeContent locale={locale} messages={messages} />
    </>
  );
}
