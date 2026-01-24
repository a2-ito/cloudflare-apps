"use client";

import { useMemo, useState } from "react";

type Mode = "encode" | "decode";

function encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

function decodeBase64(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

type Props = {
  t: {
    name: string;
    description: string;
    encode: string;
    decode: string;
    result: string;
  };
};

export default function Base64Tool({ t }: Props) {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return "";

    try {
      return mode === "encode" ? encodeBase64(input) : decodeBase64(input);
    } catch {
      return "⚠️ Invalid Base64 string";
    }
  }, [input, mode]);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* Mode Switch */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`px-3 py-1 rounded border ${
            mode === "encode" ? "bg-blue-600 text-white" : "dark:bg-zinc-900"
          }`}
        >
          {t.encode}
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-3 py-1 rounded border ${
            mode === "decode" ? "bg-blue-600 text-white" : "dark:bg-zinc-900"
          }`}
        >
          {t.decode}
        </button>
      </div>

      {/* Input */}
      <textarea
        className="w-full h-40 border rounded px-3 py-2 font-mono dark:bg-zinc-900"
        placeholder={mode === "encode" ? "Plain text" : "Base64 string"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Output */}
      <div>
        <h2 className="font-semibold mb-2">{t.result}</h2>
        <pre className="text-sm bg-zinc-100 dark:bg-zinc-900 p-3 rounded overflow-auto whitespace-pre-wrap">
          {result}
        </pre>
      </div>
    </div>
  );
}
