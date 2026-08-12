import {hasLocale} from "next-intl";
import {getLocale} from "next-intl/server";
import Link from "next/link";

import {routing, type Locale} from "@/i18n/routing";
import {localizePath} from "@/lib/locale-path";
import {loadMessages} from "@/lib/messages";
import {routes} from "@/lib/site";

export default async function NotFound() {
  const requested = await getLocale();
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : "en";
  const {notFound} = await loadMessages(locale);

  return (
    <main id="main-content" className="not-found-page">
      <div className="page-width page-width--narrow">
        <p className="eyebrow">{notFound.eyebrow}</p>
        <h1>{notFound.title}</h1>
        <p>{notFound.description}</p>
        <Link className="button button--primary" href={localizePath(routes.home, locale)}>
          {notFound.cta}
        </Link>
      </div>
    </main>
  );
}
