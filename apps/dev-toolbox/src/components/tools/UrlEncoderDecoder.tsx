"use client";

import { useState } from "react";

type Props = {
  t: {
    name: string;
    encode: string;
    decode: string;
    run: string;
  };
};

export default function UrlEncoderDecoder({ t }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const run = () => {
    try {
      const result =
        mode === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);
      setOutput(result);
    } catch {
      setOutput("❌ Invalid encoded string");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* Mode */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded border ${
            mode === "encode"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
              : ""
          }`}
          onClick={() => setMode("encode")}
        >
          {t.encode}
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            mode === "decode"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
              : ""
          }`}
          onClick={() => setMode("decode")}
        >
          {t.decode}
        </button>
      </div>

      {/* Input */}
      <textarea
        className="w-full h-28 border rounded p-2 dark:bg-zinc-900"
        placeholder="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Action */}
      <button
        onClick={run}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        {t.run}
      </button>

      {/* Output */}
      <textarea
        className="w-full h-28 border rounded p-2 dark:bg-zinc-900"
        value={output}
        readOnly
      />

      {/* Copy */}
      <button
        onClick={copy}
        disabled={!output}
        className="px-3 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
