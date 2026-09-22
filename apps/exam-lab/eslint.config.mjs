import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // next lint は Next 16 で廃止された。eslint を直接呼ぶと生成物も対象に
  // 入ってしまうため、明示的に外す。
  globalIgnores([
    ".open-next/**",
    ".wrangler/**",
    ".next/**",
    "cloudflare-env.d.ts",
    "next-env.d.ts",
  ]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
