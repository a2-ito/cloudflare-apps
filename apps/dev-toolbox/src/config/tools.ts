// src/config/tools.ts
export type Tool = {
  slug: string;
  //icon?: string;
  enabled: boolean;
  path: string;
};

export type ToolSlug =
  | "password-generator"
  | "unix-time"
  | "json-formatter"
  | "sql-formatter"
  | "regex-tester"
  | "jwt-decoder"
  | "base64-tool"
  | "scratchpad"
  | "markdown-scratchpad"
  | "url-encoder-decoder"
  | "cron-expression-tester"
  | "keypair-generator";

export const tools: Tool[] = [
  {
    slug: "password-generator",
    enabled: true,
    path: "password-generator",
  },
  {
    slug: "unix-time",
    enabled: true,
    path: "unix-time",
  },
  {
    slug: "json-formatter",
    enabled: true,
    path: "json-formatter",
  },
  {
    slug: "sql-formatter",
    enabled: true,
    path: "sql-formatter",
  },
  {
    slug: "regex-tester",
    enabled: true,
    path: "regex-tester",
  },
  {
    slug: "jwt-decoder",
    enabled: true,
    path: "jwt-decoder",
  },
  {
    slug: "base64-tool",
    enabled: true,
    path: "base64-tool",
  },
  {
    slug: "scratchpad",
    enabled: true,
    path: "scratchpad",
  },
  {
    slug: "markdown-scratchpad",
    enabled: true,
    path: "markdown-scratchpad",
  },
  {
    slug: "url-encoder-decoder",
    enabled: true,
    path: "url-encoder-decoder",
  },
  {
    slug: "cron-expression-tester",
    enabled: true,
    path: "cron-expression-tester",
  },
  {
    slug: "keypair-generator",
    enabled: true,
    path: "keypair-generator",
  },
];
