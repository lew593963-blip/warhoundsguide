"use client";

import {useSyncExternalStore} from "react";

import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
} from "@/lib/consent";

function getConsentSnapshot(): ConsentChoice | null {
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

function getServerConsentSnapshot(): null {
  return null;
}

function subscribeToConsent(callback: () => void) {
  const handleChange = () => callback();
  window.addEventListener(CONSENT_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function useConsentChoice() {
  return useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
}

export function saveConsentChoice(choice: ConsentChoice) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, {detail: choice}));
}
