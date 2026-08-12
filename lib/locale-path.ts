import type {Locale} from "@/i18n/routing";

export function localizePath(pathname: string, locale: Locale): string {
  void locale;
  return pathname;
}
