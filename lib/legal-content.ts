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
    updated: "Last updated: August 12, 2026",
    privacyTitle: "Privacy Policy",
    privacyIntro:
      "This policy explains how the independent Warhounds Guide handles technical delivery, local browser storage, external links, and currently disabled analytics and advertising integrations.",
    privacySections: [
      {
        title: "Information collected",
        body: "The site has no user accounts, comments, checkout, newsletter, or contact form. Its hosting provider may process standard request data such as IP address, browser, requested URL, and time for security, reliability, abuse prevention, and delivery.",
      },
      {
        title: "Browser storage and consent",
        body: "The current configuration does not enable Google Analytics, Google AdSense, or Adsterra and does not load their scripts. The reusable technical template includes consent controls for a future reviewed configuration, but this build does not ask for or store an optional advertising or analytics choice.",
      },
      {
        title: "Analytics and advertising status",
        body: "No site-specific analytics measurement ID, AdSense account or slot, or Adsterra placement is configured. If an integration is added later, this policy and the consent interface must be reviewed before its script is enabled.",
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
        body: "The current build contains external links but no active analytics or advertising integration. Warhounds Guide does not control external content, purchases, accounts, availability, or privacy practices, and a link is not an endorsement.",
      },
      {
        title: "Changes and contact",
        body: "Content, features, and these terms may change as the game and site evolve. Use the Contact page to report a factual, legal, accessibility, or privacy concern.",
      },
    ],
    contactLabel: "Contact Warhounds Guide",
  },
};
