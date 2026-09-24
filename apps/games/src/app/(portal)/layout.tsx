import type { Metadata } from "next";
import "./portal.css";
import { ServiceWorkerRegistrar } from "@/components/service-worker";
import { APPLE_TOUCH_ICON, PWA_METADATA } from "@/lib/pwa";

export const metadata: Metadata = {
  ...PWA_METADATA,
  title: "a2ito games",
  description: "ブラウザですぐ遊べる小さなゲーム集",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: APPLE_TOUCH_ICON,
  },
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
      <body>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
