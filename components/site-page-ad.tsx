import {rootConfig} from "@/config";

import {AdsterraPlacement} from "./adsterra-placement";

export function SitePageAd() {
  const adsterra = rootConfig.integrations.adsterra;
  if (!adsterra.enabled) return null;

  return (
    <AdsterraPlacement
      placement={adsterra.placements.inlineBannerOne}
      position="inline"
    />
  );
}
