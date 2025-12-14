"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // クライアントマウント後にだけ実行
  useEffect(() => {
    setMounted(true);

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  if (!mounted) {
    return null; // ← これが超重要
  }

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button onClick={toggle} className="rounded border px-3 py-1 text-sm">
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
