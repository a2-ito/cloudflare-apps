"use client";
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import type { Locale } from "@/i18n/config";

type Tool = {
  slug: string;
  name: string;
};

type Props = {
  lang: Locale;
  utilitiesLabel: string;
  tools: Tool[];
  isOpen?: boolean;
  onClose?: () => void;
};

export default function SidebarClient({
  lang,
  utilitiesLabel,
  tools,
  isOpen = false,
  onClose,
}: Props) {
  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 transform transition-transform duration-300 ease-in-out
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {utilitiesLabel}
            </span>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {/* 閉じるボタン（モバイルのみ表示） */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${lang}/tools/${tool.slug}`}
                onClick={onClose}
                className="block rounded px-4 py-3 text-sm font-medium
                text-gray-700 dark:text-gray-300
                bg-gray-50 dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                hover:bg-gray-100 dark:hover:bg-gray-700
                hover:border-gray-300 dark:hover:border-gray-600
                transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
