"use client";

import {GoogleAnalytics} from "@next/third-parties/google";

import {useConsentChoice} from "@/lib/use-consent";

export function ConsentGatedGoogleAnalytics({gaId}: {gaId: string}) {
  const choice = useConsentChoice();

  if (choice !== "granted") return null;

  return <GoogleAnalytics gaId={gaId} />;
}
