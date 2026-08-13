"use client";

import {useSyncExternalStore} from "react";

import type {RootConfig} from "@/config";
import {useConsentChoice} from "@/lib/use-consent";

import styles from "./adsterra-placement.module.css";

type EnabledAdsterra = Extract<
  RootConfig["integrations"]["adsterra"],
  {enabled: true}
>;
type AdsterraPlacementRecord =
  EnabledAdsterra["placements"][keyof EnabledAdsterra["placements"]];
type DisplayPlacement = Extract<AdsterraPlacementRecord, {format: "BANNER"}>;
type NativePlacement = Extract<
  AdsterraPlacementRecord,
  {format: "NATIVE_BANNER"}
>;

type AdsterraPlacementProps = {
  placement: AdsterraPlacementRecord;
  position: "leaderboard" | "inline" | "rail" | "native";
};

const DESKTOP_AD_QUERY = "(min-width: 1200px)";

function subscribeToDesktopViewport(callback: () => void) {
  const media = window.matchMedia(DESKTOP_AD_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(DESKTOP_AD_QUERY).matches;
}

function getServerDesktopViewportSnapshot() {
  return false;
}

function useDesktopAdViewport() {
  return useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getServerDesktopViewportSnapshot,
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function displaySrcDoc(placement: DisplayPlacement): string {
  const options = JSON.stringify({
    key: placement.key,
    format: "iframe",
    height: placement.height,
    width: placement.width,
    params: {},
  }).replaceAll("<", "\\u003c");

  return `<!doctype html><html><head><meta name="referrer" content="strict-origin-when-cross-origin"><style>html,body{margin:0;width:100%;height:100%;display:grid;place-items:center;overflow:hidden;background:transparent}</style></head><body><script>window.atOptions=${options}<\/script><script src="${escapeHtml(placement.scriptUrl)}"><\/script></body></html>`;
}

function nativeSrcDoc(placement: NativePlacement): string {
  return `<!doctype html><html><head><meta name="referrer" content="strict-origin-when-cross-origin"><style>html,body{margin:0;width:100%;min-height:100%;overflow-x:hidden;background:transparent}</style></head><body><div id="${escapeHtml(placement.containerId)}"></div><script async data-cfasync="false" src="${escapeHtml(placement.scriptUrl)}"><\/script></body></html>`;
}

export function AdsterraPlacement({
  placement,
  position,
}: AdsterraPlacementProps) {
  const consentChoice = useConsentChoice();
  const desktopViewport = useDesktopAdViewport();
  const viewportAllowed =
    placement.viewport === "ALL" || desktopViewport;

  if (!viewportAllowed) return null;

  const isNative = placement.format === "NATIVE_BANNER";
  const width = isNative ? "100%" : placement.width;
  const height = isNative ? 300 : placement.height;
  const srcDoc = isNative
    ? nativeSrcDoc(placement)
    : displaySrcDoc(placement);

  return (
    <aside
      className={`${styles.placement} ${styles[position]}`}
      aria-label="Advertisement"
      data-adsterra-position={position}
    >
      <span className={styles.label}>Advertisement</span>
      <div
        className={styles.slot}
        style={{
          "--ad-width": typeof width === "number" ? `${width}px` : width,
          "--ad-height": `${height}px`,
        } as React.CSSProperties}
      >
        {consentChoice === "granted" ? (
          <iframe
            title="Advertisement content"
            data-adsterra-unit={placement.unitId}
            data-adsterra-script={placement.scriptId}
            srcDoc={srcDoc}
            width={width}
            height={height}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          />
        ) : null}
      </div>
    </aside>
  );
}
