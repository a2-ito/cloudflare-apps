import type { MetadataRoute } from "next";

/** ホーム画面に追加したときの見た目と起動方法を定義する */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "a2ito games",
    short_name: "games",
    description: "ブラウザですぐ遊べる小さなゲーム集",
    // どのゲームのページから追加しても、起動するとトップページのゲーム一覧が開く
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "ja",
    background_color: "#f7f7f5",
    theme_color: "#2f6fdb",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // 端末ごとの形に切り抜かれるため、余白を持たせた版を別に用意する
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Klondike", url: "/klondike" },
      { name: "Tetris", url: "/tetris" },
      { name: "English Vocabulary Quiz", url: "/english-vocabulary-quiz" },
      { name: "BounceLab", url: "/ball-bounce" },
      { name: "2048", url: "/2048" },
      { name: "マインスイーパー", url: "/minesweeper" },
      { name: "Snake", url: "/snake" },
      { name: "Hexspin", url: "/hexspin" },
    ],
  };
}
