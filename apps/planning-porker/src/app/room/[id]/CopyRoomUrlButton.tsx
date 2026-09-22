"use client";

import { useState } from "react";

export function CopyRoomUrlButton() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("URLのコピーに失敗しました");
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow transition hover:bg-slate-100 active:scale-95"
    >
      {copied ? "✓ コピーしました" : "ルームURLをコピー"}
    </button>
  );
}
