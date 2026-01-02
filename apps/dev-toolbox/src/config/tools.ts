// src/config/tools.ts
export type Tool = {
  slug: string;
  name: string;
  description: string;
  //icon?: string;
  enabled: boolean;
};

export const toolsConfig = {
  "password-generator": {
    path: "password-generator",
  },
  "unix-time": {
    path: "unix-time",
  },
  "json-formatter": {
    path: "json-formatter",
  },
} as const

export type ToolSlug = keyof typeof toolsConfig

export const tools: Tool[] = [
  {
		slug: "password-generator",
		name: "password-generator",
		description: "password-generator",
		enabled: true
	},
  {
		slug: "unix-time",
		name: "unix-time",
		description: "unix-time",
		enabled: true
	},
  {
		slug: "json-formatter",
		name: "json-formatter",
		description: "json-formatter",
		enabled: true
	},
];
//export const tools: Tool[] = [
//  {
//    slug: "password-generator",
//    name: "パスワード生成",
//    description: "安全なランダムパスワードを生成",
//    enabled: true,
//  },
//  {
//    slug: "unix-time",
//    name: "Unix Time 変換",
//    description: "Unix Time ↔ 日時",
//    enabled: true,
//  },
//  {
//    slug: "json-formatter",
//    name: "JSON 整形",
//    description: "JSON を見やすくフォーマット",
//    enabled: true,
//  },
//]
