import {
  ArrowRight,
  Binoculars,
  Crosshair,
  ExternalLink,
  Gamepad2,
  Shield,
  ShieldAlert,
  UsersRound,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {rootConfig} from "@/config";
import type {Locale} from "@/i18n/routing";
import type {Messages} from "@/lib/messages";
import {routes} from "@/lib/site";

import styles from "./home-content.module.css";
import {SitePageAd} from "./site-page-ad";

type HomeContentProps = {
  locale: Locale;
  messages: Messages;
};

const guideIcons = [Binoculars, UsersRound, Warehouse, Crosshair, ShieldAlert];

export function HomeContent({messages}: HomeContentProps) {
  const guideRoutes = [
    routes.beginnerGuide,
    routes.squadGuide,
    routes.baseUpgrades,
    routes.weaponsGuide,
    routes.trainerCheats,
  ];

  return (
    <main id="main-content">
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`page-width ${styles.heroInner}`}>
          <div className={styles.heroMark} aria-hidden="true">
            <Image
              src={rootConfig.brand.mark512}
              alt=""
              width={136}
              height={136}
              priority
            />
          </div>
          <p className="eyebrow">{messages.hero.eyebrow}</p>
          <h1 id="home-title">{messages.hero.title}</h1>
          <p className={styles.heroDescription}>{messages.hero.description}</p>
          <div className={styles.heroActions}>
            <Link className="button button--primary" href={routes.beginnerGuide}>
              {messages.hero.primaryCta}<ArrowRight aria-hidden="true" size={16} />
            </Link>
            <a
              className={`button ${styles.secondaryButton}`}
              href={rootConfig.links.steam}
              target="_blank"
              rel="noreferrer"
            >
              {messages.hero.secondaryCta}<ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
          <ul className={styles.heroStats} aria-label={`${rootConfig.game.name} facts`}>
            {messages.hero.stats.map((stat) => <li key={stat}>{stat}</li>)}
          </ul>
        </div>
      </section>

      <section id="guides" className={styles.startSection} aria-labelledby="start-title">
        <div className="page-width">
          <header className={styles.sectionHeader}>
            <p className="eyebrow">{messages.start.eyebrow}</p>
            <h2 id="start-title">{messages.start.title}</h2>
            <p>{messages.start.description}</p>
          </header>
          <div className={`${styles.startGrid} warhounds-guide-grid`}>
            {messages.start.cards.map((card, index) => {
              const Icon = guideIcons[index] ?? Gamepad2;
              const href = guideRoutes[index] ?? routes.beginnerGuide;
              return (
                <article key={card.number} className={styles.startCard} data-testid="start-card">
                  <div className={styles.startCardTop}>
                    <span className={styles.startIcon} aria-hidden="true">
                      <Icon size={21} strokeWidth={1.5} />
                    </span>
                    <span className={styles.cardNumber}>{card.number.padStart(2, "0")}</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link href={href} aria-label={`Read ${card.title}`}>
                    {messages.start.read}<ArrowRight aria-hidden="true" size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className={`page-width ${styles.aboutSection}`} aria-labelledby="about-title">
        <div className={styles.aboutCopy}>
          <p className="eyebrow">{messages.about.eyebrow}</p>
          <h2 id="about-title">{messages.about.title}</h2>
          {messages.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link className="button button--primary" href={routes.beginnerGuide}>
            {messages.about.cta}<ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className={styles.aboutStats}>
          {messages.about.stats.map((stat, index) => {
            const Icon = index < 2 ? UsersRound : index === 2 ? Shield : Gamepad2;
            return (
              <div key={stat.label} className={styles.aboutStat}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.5} />
                <span>{stat.label}</span><strong>{stat.value}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={`page-width ${styles.finalCtaInner}`}>
          <div>
            <p className="eyebrow">{messages.finalCta.eyebrow}</p>
            <h2 id="final-cta-title">{messages.finalCta.title}</h2>
            <p>{messages.finalCta.description}</p>
          </div>
          <div className={styles.finalActions}>
            <Link className="button button--primary" href={routes.beginnerGuide}>
              {messages.finalCta.primary}<ArrowRight aria-hidden="true" size={16} />
            </Link>
            <a
              className={`button ${styles.secondaryButton}`}
              href={rootConfig.links.steam}
              target="_blank"
              rel="noreferrer"
            >
              {messages.finalCta.secondary}<ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
        </div>
      </section>
      <SitePageAd />
    </main>
  );
}
