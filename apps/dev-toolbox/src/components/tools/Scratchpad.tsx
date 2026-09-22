"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "dev-toolbox:scratchpad";

type Props = {
  t: {
    name: string;
    description: string;
    note: string;
  };
};

export default function Scratchpad({ t }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // 初期ロード
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (ref.current && saved) {
      ref.current.innerHTML = saved;
    }
  }, []);

  // 入力保存
  const handleInput = () => {
    if (!ref.current) return;
    sessionStorage.setItem(STORAGE_KEY, ref.current.innerHTML);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      <p className="text-sm text-zinc-500">{t.description}</p>

      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="
          min-h-[300px]
          border rounded
          p-4
          focus:outline-none
          bg-white text-black
          dark:bg-zinc-900 dark:text-zinc-100
          prose dark:prose-invert max-w-none
        "
      />

      <div className="text-xs text-zinc-400">{t.note}</div>
    </div>
  );
}
