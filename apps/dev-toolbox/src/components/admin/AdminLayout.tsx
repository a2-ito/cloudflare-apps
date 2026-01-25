// src/components/admin/AdminLayout.tsx
import Sidebar from "./Sidebar";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getMessages } from "@/i18n/getMessages";

type Props = {
  children: React.ReactNode;
  lang: Locale;
};

export default async function AdminLayout({ children, lang }: Props) {
  const t = await getMessages(lang);

  return (
    <div
      className="
        flex min-h-screen
        bg-gray-100 text-gray-900
        dark:bg-gray-950 dark:text-gray-100
      "
    >
      <Sidebar lang={lang} />
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* トップ画面に戻るボタン */}
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-4 py-2 
              text-sm font-medium
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-colors"
          >
            ← {t.common.backToHome}
          </Link>

          {/* ダークモード切り替えボタン */}
          <ThemeToggle />
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
