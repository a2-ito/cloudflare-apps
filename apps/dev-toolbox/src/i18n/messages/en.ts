// src/i18n/messages/en.ts
import type { ToolSlug } from "@/config/tools";

export default {
  app: {
    title: "Utilities",
    description: "Useful utilities for software engineers",
  },
  menu: {
    utilities: "Utilities",
  },
  tools: {
    "password-generator": {
      name: "Password Generator",
      description: "Generate secure random passwords",
      generate: "Generate",
      copy: "Copy",
      length: "Length",
      lowercase: "lowercase",
      uppercase: "Uppercase",
      numbers: "Number",
      symbols: "Symbol",
    },
    "unix-time": {
      name: "Unix Time Converter",
      description: "Convert Unix time and datetime",
      unix: "Unix Time",
      datetime: "Datetime",
      milliseconds: "milliseconds",
      now: "Now",
      utc: "UTC",
      local: "Local",
    },
    "json-formatter": {
      name: "JSON Formatter",
      description: "Format JSON for readability",
      input: "Input",
      output: "Output",
      format: "Format",
      minify: "Compress",
      copy: "Copy",
      indent: "Indent",
      error: "JSON Format Error",
    },
    "sql-formatter": {
      name: "SQL Formatter",
      description: "Format SQL for readability",
      input: "Input",
      output: "Output",
      format: "Format",
      minify: "Compress",
      copy: "Copy",
      indent: "Indent",
      error: "SQL Format Error",
    },
    "regex-tester": {
      name: "Regex Tester",
      description: "Test Regex",
      pattern: "Pattern",
      flags: "Flags",
      testString: "Test String",
      result: "Result",
    },
    "jwt-decoder": {
      name: "JWT Decoder",
      description: "Decode JWT header and payload",
      token: "JWT Token",
      header: "Header",
      payload: "Payload",
    },
    "base64-tool": {
      name: "Base64 Encode / Decode",
      description: "Convert text to Base64 and decode it back",
      encode: "Encode",
      decode: "Decode",
      result: "Result",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } satisfies Record<ToolSlug, any>,
};
