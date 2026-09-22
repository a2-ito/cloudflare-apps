"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";

const STORAGE_KEY = "dev-toolbox:markdown-scratchpad";

type Props = {
  t: {
    name: string;
    description: string;
  };
};

export default function MarkdownScratchpad({ t }: Props) {
  const [text, setText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState<null | "md" | "html">(null);

  // 初期ロード
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setText(saved);
  }, []);

  // 保存
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  const html: string = useMemo(
    () => marked.parse(text, { async: false }),
    [text],
  );

  const copy = async (value: string, type: "md" | "html") => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.name}</h1>

        <div className="flex items-center gap-2 text-sm">
          <button
            className="px-2 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>

          <button
            className="px-2 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => copy(text, "md")}
          >
            {copied === "md" ? "Copied!" : "Copy MD"}
          </button>

          <button
            className="px-2 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => copy(html, "html")}
          >
            {copied === "html" ? "Copied!" : "Copy HTML"}
          </button>
        </div>
      </div>

      <p className="text-sm text-zinc-500">{t.description}</p>

      <div
        className={`grid gap-4 ${
          showPreview ? "md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Editor */}
        <textarea
          className="
            h-[400px]
            w-full
            border rounded
            p-3
            font-mono text-sm
            dark:bg-zinc-900
          "
          placeholder={`# Memo\n\n- item\n- item\n\n\`\`\`ts\nconsole.log("hello")\n\`\`\``}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Preview */}
        {showPreview && (
          <div
            className="
              h-[400px]
              overflow-auto
              border rounded
              p-4
              prose prose-sm
              dark:prose-invert
              dark:bg-zinc-900
            "
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
