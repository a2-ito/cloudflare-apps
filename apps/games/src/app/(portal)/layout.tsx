import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: "a2ito games",
  description: "ブラウザですぐ遊べる小さなゲーム集",
};

// ゲームごとに root layout を分けているため、ここはトップページ専用の root layout。
// ゲーム側の globals.css（klondike の class ベースのダークモードなど）と混ざらない。
export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
