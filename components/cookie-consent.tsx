"use client";

import Link from "next/link";
import {useEffect, useState} from "react";

import {
  CONSENT_OPEN_EVENT,
  type ConsentChoice,
  type ConsentContent,
} from "@/lib/consent";
import {saveConsentChoice, useConsentChoice} from "@/lib/use-consent";

import styles from "./cookie-consent.module.css";

type CookieConsentProps = {
  content: ConsentContent;
  privacyHref: string;
};

function updateGoogleConsent(choice: ConsentChoice) {
  const value = choice === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

export function CookieConsent({content, privacyHref}: CookieConsentProps) {
  const choice = useConsentChoice();
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    if (choice) updateGoogleConsent(choice);
  }, [choice]);

  useEffect(() => {
    const open = () => setForceOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  function save(choice: ConsentChoice) {
    updateGoogleConsent(choice);
    saveConsentChoice(choice);
    setForceOpen(false);
  }

  if (choice && !forceOpen) return null;

  return (
    <section className={styles.banner} role="dialog" aria-label={content.title} aria-live="polite">
      <div className={styles.copy}>
        <strong>{content.title}</strong>
        <p>{content.description} <Link href={privacyHref}>{content.privacy}</Link></p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={() => save("denied")}>
          {content.reject}
        </button>
        <button type="button" className={styles.secondary} onClick={() => save("denied")}>
          {content.necessary}
        </button>
        <button type="button" className={styles.primary} onClick={() => save("granted")}>
          {content.accept}
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsButton({label}: {label: string}) {
  return (
    <button
      className="footer-settings"
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {label}
    </button>
  );
}
