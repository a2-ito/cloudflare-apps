"use client";

import { useState } from "react";

type Props = {
  t: {
    name: string;
    input: string;
    output: string;
    format: string;
    minify: string;
    copy: string;
    error: string;
    indent: string;
  };
};

export default function JsonFormatter({ t }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  function format(minify = false) {
    try {
      const parsed = JSON.parse(input);
      const space = minify ? 0 : indent;
      const result = JSON.stringify(parsed, null, space);
      setOutput(result);
      setError(null);
    } catch {
      setError(t.error);
      setOutput("");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex gap-2 items-center">
          {t.indent}
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border px-2 py-1 bg-background"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </label>

        <button
          onClick={() => format(false)}
          className="px-3 py-1 rounded bg-green-600 text-white"
        >
          {t.format}
        </button>

        <button
          onClick={() => format(true)}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          {t.minify}
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(output)}
          disabled={!output}
          className="px-3 py-1 rounded bg-gray-600 text-white disabled:opacity-50"
        >
          {t.copy}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded border border-red-500 bg-red-50 dark:bg-red-950 p-3 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">{t.input}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            className="w-full rounded border px-3 py-2 font-mono text-sm bg-background"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t.output}</label>
          <textarea
            value={output}
            readOnly
            rows={16}
            className="w-full rounded border px-3 py-2 font-mono text-sm bg-background"
          />
        </div>
      </div>
    </div>
  );
}
