
"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    // 初期値：OS設定
    setDark(
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  useEffect(() => {
    if (dark === null) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (dark === null) return null;

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 text-sm rounded border border-gray-500"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

