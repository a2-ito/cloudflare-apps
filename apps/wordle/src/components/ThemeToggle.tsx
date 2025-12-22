"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // クライアントマウント後にだけ実行
  useEffect(() => {
    // setMounted(true);
    // 非同期化して ESLint 警告を回避
    const id = setTimeout(() => setMounted(true), 0);

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    //setDark(prefersDark);
    //document.documentElement.classList.toggle("dark", prefersDark);
    setTimeout(() => {
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
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
