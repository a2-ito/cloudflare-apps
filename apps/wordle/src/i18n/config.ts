export const languages = ["ja", "en"] as const;
export type Lang = (typeof languages)[number];

export const defaultNS = "common";
