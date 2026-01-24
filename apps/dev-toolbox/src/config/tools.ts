// src/config/tools.ts
export type Tool = {
  slug: string;
  name: string;
  description: string;
  //icon?: string;
  enabled: boolean;
  path: string;
};

export type ToolSlug = "password-generator" | "unix-time" | "json-formatter" | "sql-formatter" | "regex-tester" | "jwt-decoder" | "base64-tool" | "scratchpad" | "markdown-scratchpad" | "url-encoder-decoder";

export const tools: Tool[] = [
  {
    slug: "password-generator",
    name: "password-generator",
    description: "password-generator",
    enabled: true,
    path: "password-generator",
  },
  {
    slug: "unix-time",
    name: "unix-time",
    description: "unix-time",
    enabled: true,
    path: "unix-time",
  },
  {
    slug: "json-formatter",
    name: "json-formatter",
    description: "json-formatter",
    enabled: true,
    path: "json-formatter",
  },
  {
    slug: "sql-formatter",
    name: "sql-formatter",
    description: "sql-formatter",
    enabled: true,
    path: "sql-formatter",
  },
  {
    slug: "regex-tester",
    name: "regex-tester",
    description: "regex-tester",
    enabled: true,
    path: "regex-tester",
  },
  {
    slug: "jwt-decoder",
    name: "jwt-decoder",
    description: "jwt-decoder",
    enabled: true,
    path: "jwt-decoder",
  },
  {
    slug: "base64-tool",
    name: "base64-tool",
    description: "base64-tool",
    enabled: true,
    path: "base64-tool",
  },
  {
    slug: "scratchpad",
    name: "scratchpad",
    description: "scratchpad",
    enabled: true,
    path: "scratchpad",
  },
  {
    slug: "markdown-scratchpad",
    name: "markdown-scratchpad",
    description: "markdown-scratchpad",
    enabled: true,
    path: "markdown-scratchpad",
  },
  {
    slug: "url-encoder-decoder",
    name: "url-encoder-decoder",
    description: "url-encoder-decoder",
    enabled: true,
    path: "url-encoder-decoder",
  },
];