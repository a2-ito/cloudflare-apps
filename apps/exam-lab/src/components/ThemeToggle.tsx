"use client";

import { useDarkMode } from "@/hooks/useDarkMode";

export function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-all dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label="テーマ切り替え"
    >
      {isDark ? (
        <img
          src="/light.svg"
          alt="ライトモード"
          className="w-5 h-5 filter dark:invert"
        />
      ) : (
        <img
          src="/dark.svg"
          alt="ダークモード"
          className="w-5 h-5 filter dark:invert"
        />
      )}
    </button>
  );
}
