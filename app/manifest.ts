import type {MetadataRoute} from "next";

import {rootConfig} from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: rootConfig.site.name,
    short_name: rootConfig.site.shortName,
    description: rootConfig.brand.manifestDescription,
    start_url: "/",
    display: "standalone",
    background_color: rootConfig.brand.colors.background,
    theme_color: rootConfig.brand.colors.theme,
    icons: [
      {src: rootConfig.brand.mark192, sizes: "any", type: "image/svg+xml"},
    ],
  };
}
