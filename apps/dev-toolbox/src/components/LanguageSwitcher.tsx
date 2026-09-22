// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/config";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname.split("/")[1];

  const switchLang = (lang: string) => {
    const rest = pathname.replace(/^\/(ja|en)/, "");
    router.push(`/${lang}${rest}`);
  };

  return (
    <select
      value={currentLang}
      onChange={(e) => switchLang(e.target.value)}
      className="rounded border px-2 py-1
        bg-white dark:bg-gray-800"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
