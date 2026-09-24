import type { Metadata } from "next";

/**
 * ゲームごとに root layout が分かれているので、どのページからホーム画面に
 * 追加しても同じ名前とアイコンになるよう、各 layout の metadata に混ぜる。
 * マニフェストへの <link> は app/manifest.ts から Next.js が全ページに足す。
 */
export const PWA_METADATA = {
  applicationName: "a2ito games",
  // iOS はマニフェストの display を見ないため、こちらで単独起動を指定する
  appleWebApp: {
    capable: true,
    title: "a2ito games",
    statusBarStyle: "default",
  },
} satisfies Metadata;

/** iOS のホーム画面用アイコン。ゲームごとの favicon と並べて使う */
export const APPLE_TOUCH_ICON = [
  { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
];
