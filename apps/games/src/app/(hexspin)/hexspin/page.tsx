"use client";

import dynamic from "next/dynamic";

// 盤面の乱数やベスト記録（localStorage）をサーバー側の描画と食い違わせないよう、
// ゲーム本体はブラウザでだけ描画する
const Game = dynamic(() => import("@/games/hexspin/components/Game"), {
  ssr: false,
  loading: () => <p className="text-center opacity-60">読み込み中…</p>,
});

export default function Page() {
  return <Game />;
}
