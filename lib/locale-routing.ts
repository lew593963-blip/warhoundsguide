import type {Locale} from "@/i18n/routing";

type LocaleRouteAction = {
  type: "next" | "redirect" | "rewrite";
  locale: Locale;
  pathname: string;
};

export function getLocaleRouteAction(pathname: string): LocaleRouteAction {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const canonical = pathname.slice(3) || "/";
    return {type: "redirect", locale: "en", pathname: canonical};
  }

  const internalPath = pathname === "/" ? "/en" : `/en${pathname}`;
  return {type: "rewrite", locale: "en", pathname: internalPath};
}
