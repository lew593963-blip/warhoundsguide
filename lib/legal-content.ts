import type {Locale} from "@/i18n/routing";

export type LegalContent = {
  updated: string;
  privacyTitle: string;
  privacyIntro: string;
  privacySections: Array<{title: string; body: string}>;
  termsTitle: string;
  termsIntro: string;
  termsSections: Array<{title: string; body: string}>;
  contactLabel: string;
};

export const legalContent: Record<Locale, LegalContent> = {
  en: {
    updated: "Last updated: August 13, 2026",
    privacyTitle: "Privacy Policy",
    privacyIntro:
      "This policy explains how the independent Warhounds Guide handles technical delivery, local browser storage, consent-gated analytics and advertising, and external links.",
    privacySections: [
      {
        title: "Information collected",
        body: "The site has no user accounts, comments, checkout, newsletter, or contact form. Its hosting provider may process standard request data such as IP address, browser, requested URL, and time for security, reliability, abuse prevention, and delivery.",
      },
      {
        title: "Browser storage and consent",
        body: "Necessary local browser storage records whether you accept or reject optional analytics and advertising. Google Analytics and Adsterra advertising are not loaded unless you actively accept. You can reopen Privacy choices from the footer and change that decision. Google AdSense ad serving remains disabled while its account review is separate.",
      },
      {
        title: "Analytics and advertising status",
        body: "If you accept, this site loads its own Google Analytics 4 web stream and may load Adsterra Banner or Native Banner placements on guide pages. Those providers may process standard request, device, referral, and approximate location data under their policies. Before acceptance, the site creates no Adsterra provider frame or request. A non-executable AdSense account meta tag and account-level ads.txt declaration remain only for review; no AdSense advertising script or ad slot is enabled.",
      },
      {
        title: "External links",
        body: "Links to Steam and GitHub are governed by those services' own policies. Following an external link may allow that provider to receive standard request and account information under its terms. Avoid placing sensitive personal information in public project issues.",
      },
    ],
    termsTitle: "Terms of Service",
    termsIntro:
      "By using Warhounds Guide, you agree to these terms for an independent fan-made information resource.",
    termsSections: [
      {
        title: "Independent fan resource",
        body: "Warhounds Guide is not affiliated with, endorsed by, or operated by Everplay DMCC, Brightika, Inc., Valve, Steam, or GitHub. Game names, images, and marks belong to their respective owners.",
      },
      {
        title: "Information and evidence limits",
        body: "Guides are provided for general informational purposes. Official facts are separated from transparent tactical inference and documented unknowns, but patches and campaign context can make a reviewed page incomplete or inaccurate.",
      },
      {
        title: "Acceptable use",
        body: "You may read and link to the site for lawful purposes. Do not disrupt the service, bypass security, misrepresent an official affiliation, scrape in a way that harms availability, or republish the site's original presentation as your own.",
      },
      {
        title: "External services and future integrations",
        body: "The site contains external links, optional consent-gated Google Analytics, and consent-gated Adsterra Banner and Native Banner placements on guide pages. Google AdSense ad serving remains disabled. Warhounds Guide does not control external content, ads, purchases, accounts, availability, or privacy practices, and a link is not an endorsement.",
      },
      {
        title: "Changes and contact",
        body: "Content, features, and these terms may change as the game and site evolve. Use the Contact page to report a factual, legal, accessibility, or privacy concern.",
      },
    ],
    contactLabel: "Contact Warhounds Guide",
  },
};
