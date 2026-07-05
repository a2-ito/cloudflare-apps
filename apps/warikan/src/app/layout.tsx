import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "warikan | みんなで割り勘",
  description:
    "ログイン不要。旅行やイベントの立替を記録して、最小回数で精算できる割り勘アプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-dvh flex flex-col">
          <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-10">
            <div className="mx-auto max-w-3xl px-4 h-14 flex items-center">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-emerald-500 text-white text-sm">
                  W
                </span>
                <span>warikan</span>
              </Link>
            </div>
          </header>
          <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-3xl px-4 py-8 text-center text-xs text-black/40">
            warikan — みんなで割り勘
          </footer>
        </div>
      </body>
    </html>
  );
}
