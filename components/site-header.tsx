"use client";

import {BookOpenText, ExternalLink, Menu} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

import type {Locale} from "@/i18n/routing";
import {localizePath} from "@/lib/locale-path";
import type {Messages} from "@/lib/messages";

type NavigationRoutes = {
  home: string;
  beginnerGuide: string;
  squadGuide: string;
  baseUpgrades: string;
  weaponsGuide: string;
  trainerCheats: string;
  about: string;
};

type SiteHeaderProps = {
  locale: Locale;
  common: Messages["common"];
  nav: Messages["nav"];
  guidesLabel: string;
  brandMark: string;
  siteName: string;
  steamHref: string;
  navigationRoutes: NavigationRoutes;
};

export function SiteHeader({
  locale,
  common,
  nav,
  guidesLabel,
  brandMark,
  siteName,
  steamHref,
  navigationRoutes,
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const home = localizePath(navigationRoutes.home, locale);
  const guides = [
    [navigationRoutes.beginnerGuide, nav.beginnerGuide],
    [navigationRoutes.squadGuide, nav.squadGuide],
    [navigationRoutes.baseUpgrades, nav.baseUpgrades],
    [navigationRoutes.weaponsGuide, nav.weaponsGuide],
    [navigationRoutes.trainerCheats, nav.trainerCheats],
  ] as const;

  return (
    <header className="site-header" data-mobile-open={mobileOpen}>
      <a className="skip-link" href="#main-content">{common.skip}</a>
      <div className="site-header__main page-width">
        <Link className="brand-lockup" href={home} aria-label={siteName}>
          <span className="brand-lockup__mark" aria-hidden="true">
            <Image src={brandMark} alt="" width={42} height={42} priority />
          </span>
          <span>{siteName}</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href={home}>{nav.home}</Link>
          <Link href={navigationRoutes.beginnerGuide}>{nav.guides}</Link>
          <Link href={localizePath(navigationRoutes.about, locale)}>{nav.about}</Link>
        </nav>

        <a className="button button--steam header-steam" href={steamHref} target="_blank" rel="noreferrer">
          {nav.play}<ExternalLink aria-hidden="true" size={15} strokeWidth={1.8} />
        </a>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="site-guide-navigation"
          aria-label={nav.menu}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Menu aria-hidden="true" size={19} /><span>{nav.menu}</span>
        </button>
      </div>

      <div className="site-header__sub" id="site-guide-navigation">
        <div className="page-width subnav-row">
          <span className="subnav-label">
            <BookOpenText aria-hidden="true" size={16} />{guidesLabel}
          </span>
          <nav className="secondary-nav" aria-label="Guide navigation">
            {guides.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
