// src/components/admin/Sidebar.tsx
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
};

export default function SidebarClient({
  lang,
  utilitiesLabel,
  tools,
}: Props) {

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700">
      {/*
      <div className="p-4 font-bold text-lg text-gray-900 dark:text-gray-100">
        Utility Admin
      </div>
			*/}
      <div className="p-4 flex justify-between items-center">
        <span className="font-bold">{utilitiesLabel}</span>
        <LanguageSwitcher />
      </div>

      <nav className="px-2 space-y-1">
        {tools
          //.filter((t) => t.enabled)
          .map((tool) => (
            <Link
              key={tool.slug}
              href={`/${lang}/tools/${tool.slug}`}
              className="block rounded px-3 py-2
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {tool.name}
            </Link>
          ))}
      </nav>


    </aside>
  );
}
