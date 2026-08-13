import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import Script from "next/script";

import {CookieConsent} from "@/components/cookie-consent";
import {ConsentGatedGoogleAnalytics} from "@/components/consent-gated-google-analytics";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {rootConfig} from "@/config";
import {routing} from "@/i18n/routing";
import {consentContent, GOOGLE_CONSENT_DEFAULTS} from "@/lib/consent";
import {localizePath} from "@/lib/locale-path";
import {loadMessages} from "@/lib/messages";
import {routes, siteConfig} from "@/lib/site";

import "../globals.css";
import "../warhounds.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.homeTitle,
    template: rootConfig.site.titleTemplate,
  },
  description: siteConfig.homeDescription,
  keywords: rootConfig.site.keywords,
  icons: {
    icon: rootConfig.brand.favicon,
    apple: rootConfig.brand.appleIcon,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await loadMessages(locale);
  const {analytics, adsense, adsterra} = rootConfig.integrations;
  const hasGoogleIntegration = analytics.enabled || adsense.enabled;
  const hasOptionalIntegration = hasGoogleIntegration || adsterra.enabled;
  const gaMeasurementId = analytics.enabled
    ? process.env[analytics.measurementIdEnv]
    : undefined;
  const adsenseVerification = adsense.enabled
    ? {metaName: adsense.metaName, publisherId: adsense.publisherId}
    : adsense.siteVerification;

  return (
    <html lang={locale} data-theme="dark" data-scroll-behavior="smooth">
      <head>
        {adsenseVerification ? (
          <meta
            name={adsenseVerification.metaName}
            content={adsenseVerification.publisherId}
          />
        ) : null}
        {hasGoogleIntegration ? (
          <Script
            id="google-consent-mode-defaults"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{__html: GOOGLE_CONSENT_DEFAULTS}}
          />
        ) : null}
        {adsense.enabled ? (
          <Script
            id={adsense.scriptId}
            async
            src={`${adsense.scriptBaseUrl}?client=${adsense.publisherId}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        ) : null}
      </head>
      <body>
        <div className="site-shell">
          <SiteHeader
            locale={locale}
            common={messages.common}
            nav={messages.nav}
            guidesLabel={messages.footer.guides}
            brandMark={rootConfig.brand.mark192}
            siteName={rootConfig.site.name}
            steamHref={rootConfig.links.steam}
            navigationRoutes={routes}
          />
          {children}
          <SiteFooter
            locale={locale}
            nav={messages.nav}
            footer={messages.footer}
            siteName={rootConfig.site.name}
            brandMark={rootConfig.brand.mark192}
            officialLinks={rootConfig.links}
            copyright={rootConfig.site.copyright}
            consentLabel={
              hasOptionalIntegration ? consentContent[locale].settings : undefined
            }
          />
        </div>
        {hasOptionalIntegration ? (
          <CookieConsent
            content={consentContent[locale]}
            privacyHref={localizePath(routes.privacy, locale)}
          />
        ) : null}
      </body>
      {gaMeasurementId ? (
        <ConsentGatedGoogleAnalytics gaId={gaMeasurementId} />
      ) : null}
    </html>
  );
}
