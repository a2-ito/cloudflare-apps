import ja from "./ja";
import en from "./en";

export const messages = {
  ja,
  en,
} as const;

export type Lang = keyof typeof messages;
export type Messages = (typeof messages)[Lang];
