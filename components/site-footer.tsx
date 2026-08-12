import {ExternalLink} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type {RootConfig} from "@/config";
import type {Locale} from "@/i18n/routing";
import {localizePath} from "@/lib/locale-path";
import type {Messages} from "@/lib/messages";
import {routes} from "@/lib/site";

import {CookieSettingsButton} from "./cookie-consent";

type SiteFooterProps = {
  locale: Locale;
  nav: Messages["nav"];
  footer: Messages["footer"];
  siteName: string;
  brandMark: string;
  officialLinks: RootConfig["links"];
  copyright: RootConfig["site"]["copyright"];
  consentLabel?: string;
};

export function SiteFooter({
  locale,
  nav,
  footer,
  siteName,
  brandMark,
  officialLinks,
  copyright,
  consentLabel,
}: SiteFooterProps) {
  const home = localizePath(routes.home, locale);
  const guides = [
    [routes.beginnerGuide, nav.beginnerGuide],
    [routes.squadGuide, nav.squadGuide],
    [routes.baseUpgrades, nav.baseUpgrades],
    [routes.weaponsGuide, nav.weaponsGuide],
  ] as const;

  return (
    <footer className="site-footer">
      <div className="page-width footer-grid">
        <div className="footer-about">
          <Link className="brand-lockup brand-lockup--footer" href={home} aria-label={siteName}>
            <Image src={brandMark} alt="" width={46} height={46} />
            <span>{siteName}</span>
          </Link>
          <p>{footer.about}</p>
          <p className="footer-description">{footer.description}</p>
        </div>

        <div className="footer-column">
          <h2>{footer.guides}</h2>
          {guides.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </div>

        <div className="footer-column">
          <h2>{footer.official}</h2>
          <a href={officialLinks.steam} target="_blank" rel="noreferrer">
            {footer.steam}<ExternalLink aria-hidden="true" size={13} />
          </a>
        </div>

        <div className="footer-column">
          <h2>{footer.legal}</h2>
          <Link href={localizePath(routes.about, locale)}>{nav.about}</Link>
          <Link href={localizePath(routes.contact, locale)}>{nav.contact}</Link>
          <Link href={localizePath(routes.privacy, locale)}>{footer.privacy}</Link>
          <Link href={localizePath(routes.terms, locale)}>{footer.terms}</Link>
          {consentLabel ? <CookieSettingsButton label={consentLabel} /> : null}
        </div>
      </div>
      <div className="page-width footer-bottom">
        <span>© {copyright.year} {copyright.holder}</span>
        <span>{footer.copyright}</span>
      </div>
    </footer>
  );
}
