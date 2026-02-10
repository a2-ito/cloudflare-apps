import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExamLab",
  description: "資格学習を、構造化する。",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";

  return (
    <html lang="ja">
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
        <GoogleOAuthProvider clientId={googleClientId}>
          <div className="min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-50 light:bg-white border-b border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  ExamLab
                </Link>
                <nav className="flex items-center space-x-6">
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition dark:text-zinc-400 dark:hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
                  >
                    ダッシュボード
                  </Link>
                  <Link
                    href="/questions"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
                  >
                    問題一覧
                  </Link>
                  <Link
                    href="/exams"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
                  >
                    試験管理
                  </Link>
                  <Link
                    href="/categories"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-900"
                  >
                    カテゴリ管理
                  </Link>
                  <ThemeToggle />
                  <form action="/" method="post">
                    <button
                      type="submit"
                      className="text-sm text-zinc-600 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                      ログアウト
                    </button>
                  </form>
                </nav>
              </div>
            </header>

            <main className="pt-16">{children}</main>
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
