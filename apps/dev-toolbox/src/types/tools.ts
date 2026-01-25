// src/types/tools.ts
export type PasswordGeneratorMessages = {
  name: string;
  description: string;
  generate: string;
  copy: string;
  length: string;
  lowercase: string;
  uppercase: string;
  numbers: string;
  symbols: string;
};

export type UnixTimeConverterMessages = {
  name: string;
  description: string;
  unix: string;
  datetime: string;
  milliseconds: string;
  now: string;
  utc: string;
  local: string;
};

export type OgpCheckerMessages = {
  name: string;
  description: string;
  urlInput: string;
  check: string;
  title: string;
  type: string;
  image: string;
  ogpDescription: string;
  siteName: string;
  locale: string;
  ogpError: string;
  loading: string;
  noOgpData: string;
  invalidUrl: string;
  copy: string;
};
