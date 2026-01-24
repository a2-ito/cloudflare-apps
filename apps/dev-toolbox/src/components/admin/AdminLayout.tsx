// src/components/admin/AdminLayout.tsx
import Sidebar from "./Sidebar";
import type { Locale } from "@/i18n/config";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  lang: Locale;
};

export default function AdminLayout({ children, lang }: Props) {
  return (
    <div
      className="
        flex min-h-screen
        bg-gray-100 text-gray-900
        dark:bg-gray-950 dark:text-gray-100
      "
    >
      <Sidebar lang={lang} />
      <main className="flex-1 p-6">
        {/* トップ画面に戻るボタン */}
        <div className="mb-6">
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
            ← トップ画面に戻る
          </Link>
        </div>
        
        {children}
      </main>
    </div>
  );
}
