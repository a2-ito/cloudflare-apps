// src/i18n/config.ts
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export function isLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale)
}
