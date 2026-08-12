import type enMessages from "@/messages/en.json";

import type {Locale} from "@/i18n/routing";

export type Messages = typeof enMessages;

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await import(`../messages/${locale}.json`)).default as Messages;
}
