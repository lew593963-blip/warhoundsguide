import {rootConfig} from "@/config";
import {getContentEntries, getContentEntry} from "@/lib/content-registry";

function requireGuideRoute(slug: string): string {
  const entry = getContentEntry("guide", "en", slug);
  if (!entry) throw new Error(`Missing registered guide route: ${slug}`);
  return entry.route;
}

export const routes = {
  home: "/",
  beginnerGuide: requireGuideRoute("beginner-guide"),
  squadGuide: requireGuideRoute("squad-guide"),
  baseUpgrades: requireGuideRoute("base-upgrades"),
  weaponsGuide: requireGuideRoute("weapons-guide"),
  about: "/about",
  contact: "/contact",
  privacy: "/privacy-policy",
  terms: "/terms-of-service",
} as const;

export const coreGuides = getContentEntries({type: "guide", locale: "en"}).map(
  (entry) => ({
    slug: entry.slug,
    route: entry.route,
    keyword: entry.frontmatter.primaryKeyword,
    label: entry.frontmatter.navigationLabel,
  }),
);

export type GuideSlug = string;

export const localizedStaticRoutes = [
  routes.home,
  routes.about,
  routes.contact,
  routes.privacy,
  routes.terms,
] as const;

export const officialLinks = rootConfig.links;

export const siteLinks = {
  repository: rootConfig.links.repository ?? rootConfig.links.steam,
} as const;

export const siteConfig = {
  name: rootConfig.site.name,
  url: rootConfig.site.url,
  homeTitle: rootConfig.site.homeTitle,
  homeDescription: rootConfig.site.homeDescription,
  keywords: rootConfig.site.keywords.join(", "),
} as const;
