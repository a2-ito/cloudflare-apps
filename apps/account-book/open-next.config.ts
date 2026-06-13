import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig({
    // Uncomment to enable R2 cache,
    // It should be imported as:
    // `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
    // See https://opennext.js.org/cloudflare/caching for more details
    // incrementalCache: r2IncrementalCache,
  }),
  // `npm run build` を opennextjs-cloudflare build に統一しているため、
  // opennext が内部で実行する Next.js ビルドのコマンドを明示する。
  // 未指定だとデフォルトで `npm run build`（= 自分自身）を呼び無限再帰するため、
  // `build:next`（= next build）を指定する。
  buildCommand: "npm run build:next",
};
