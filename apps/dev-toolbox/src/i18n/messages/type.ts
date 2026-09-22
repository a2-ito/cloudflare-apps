// src/i18n/messages/type.ts
//export type ToolsMessages = {
//  [slug: string]: {
//    name: string
//    description: string
//    generate: string
//    copy: string
//		length: string
//		lowercase: string
//		uppercase: string
//		numbers: string
//		symbols: string
//  }
//}

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

export type JsonFormatterMessages = {
  name: string;
  description: string;
  input: string;
  output: string;
  format: string;
  minify: string;
  copy: string;
  indent: string;
  error: string;
};

export type SqlFormatterMessages = {
  name: string;
  description: string;
  input: string;
  output: string;
  format: string;
  minify: string;
  copy: string;
  indent: string;
  error: string;
};

export type Messages = {
  app: {
    title: string;
  };
  menu: {
    utilities: string;
  };
  // tools: ToolMessages;
  tools: {
    "password-generator": PasswordGeneratorMessages;
    "unix-time": UnixTimeConverterMessages;
    "json-formatter": JsonFormatterMessages;
  };
};
