"use client";

import React, { useState } from "react";
import SidebarClient from "./SidebarClient";
import ThemeToggle from "./ThemeToggle";
import MenuButton from "./MenuButton";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { getMessages } from "@/i18n/getMessages";
import { getAvailableTools } from "@/lib/getAvailableTools";
import LanguageSwitcher from "../LanguageSwitcher";

type Props = {
  children: React.ReactNode;
  lang: Locale;
};

export default function AdminLayout({ children, lang }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tools, setTools] = useState<Array<{ slug: string; name: string }>>([]);
  const [t, setT] = useState<{
    common: { backToHome: string };
    menu: { utilities: string };
  } | null>(null);

  React.useEffect(() => {
    getMessages(lang).then(setT);
    getAvailableTools(lang).then(setTools);
  }, [lang]);

  if (!t || tools.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <SidebarClient
        lang={lang}
        utilitiesLabel={t.menu.utilities}
        tools={tools}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* ヘッダー */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            {/* モバイル用メニューボタン */}
            <MenuButton
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              isOpen={isSidebarOpen}
            />

            {/* トップ画面に戻るボタン */}
            <Link
              href={`/${lang}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2
                text-sm font-medium
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors"
            >
              ← {t.common.backToHome}
            </Link>

            {/* スマホ用省略版 */}
            <Link
              href={`/${lang}`}
              className="sm:hidden inline-flex items-center gap-2 px-3 py-2
                text-sm font-medium
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors"
            >
              ← Home
            </Link>
          </div>

          {/* 言語切替 */}
          <LanguageSwitcher />

          {/* ダークモード切り替えボタン */}
          <ThemeToggle />
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
