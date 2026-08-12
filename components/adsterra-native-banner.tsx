"use client";

import Script from "next/script";

import type {RootConfig} from "@/config";
import {useConsentChoice} from "@/lib/use-consent";

import styles from "./adsterra-native-banner.module.css";

type AdsterraPlacement = Extract<
  RootConfig["integrations"]["adsterra"],
  {enabled: true}
>;

export function AdsterraNativeBanner({placement}: {placement: AdsterraPlacement}) {
  const consentChoice = useConsentChoice();
  const allowed = !placement.consentRequired || consentChoice === "granted";

  return (
    <aside className={styles.banner} aria-label="Advertisement">
      {allowed ? (
        <>
          <Script
            id={placement.scriptId}
            async
            data-cfasync="false"
            src={placement.scriptUrl}
            strategy="afterInteractive"
          />
          <div className={styles.slot} id={placement.containerId} />
        </>
      ) : null}
    </aside>
  );
}
