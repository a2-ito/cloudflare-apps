"use client";

import { useState } from "react";

export function ShareLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // クリップボード不可の環境では何もしない
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-white border border-black/5 px-3 py-2.5 text-sm">
      <span className="text-black/40 shrink-0">🔗 共有</span>
      <span className="flex-1 truncate text-black/60" suppressHydrationWarning>
        このページのURLを共有すると誰でも編集できます
      </span>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-lg bg-black/5 hover:bg-black/10 px-3 py-1.5 font-medium transition-colors"
      >
        {copied ? "コピーしました" : "URLをコピー"}
      </button>
    </div>
  );
}
