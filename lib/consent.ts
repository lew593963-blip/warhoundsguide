import type {Locale} from "@/i18n/routing";

export const CONSENT_STORAGE_KEY = "warhounds-guide-consent";
export const CONSENT_CHANGE_EVENT = "warhounds-guide:consent-changed";
export const CONSENT_OPEN_EVENT = "warhounds-guide:open-consent";

export type ConsentChoice = "granted" | "denied";

export const GOOGLE_CONSENT_DEFAULTS = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`;

export type ConsentContent = {
  title: string;
  description: string;
  accept: string;
  reject: string;
  necessary: string;
  privacy: string;
  settings: string;
};

export const consentContent: Record<Locale, ConsentContent> = {
  en: {
    title: "Privacy choices",
    description:
      "Necessary browser storage remembers this choice. Google Analytics loads only after you accept optional analytics; advertising remains disabled.",
    accept: "Accept optional",
    reject: "Reject optional",
    necessary: "Necessary only",
    privacy: "Privacy Policy",
    settings: "Privacy choices",
  },
};
