"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="
        px-3 py-1 rounded
        bg-gray-200 dark:bg-gray-700
        text-gray-800 dark:text-gray-100
        hover:opacity-80
        text-sm
      "
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
