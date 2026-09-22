// src/hooks/useTheme.ts
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "number-logic:theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const t = saved ?? "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
  };

  return { theme, toggle };
}
