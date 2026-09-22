// src/i18n/getMessages.ts
import type { Locale } from "./config";

export async function getMessages(locale: Locale) {
  switch (locale) {
    case "en":
      return (await import("./messages/en")).default;
    case "ja":
    default:
      return (await import("./messages/ja")).default;
  }
}
