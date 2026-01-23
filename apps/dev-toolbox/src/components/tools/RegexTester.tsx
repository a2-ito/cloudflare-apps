"use client";

import { useMemo, useState } from "react";

type Props = {
  t: {
    name: string;
    description: string;
    pattern: string;
    flags: string;
    testString: string;
    result: string;
  };
};

export default function RegexTester({ t }: Props) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null };

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(regex)].map((m, i) => ({
        index: i,
        value: m[0],
        position: m.index ?? 0,
      }));

      return { matches, error: null };
    } catch (e) {
      return {
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regex",
      };
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* Regex input */}
      <div className="space-y-2">
        <label className="block font-medium">Pattern</label>
        <input
          className="w-full border rounded px-3 py-2 dark:bg-zinc-900"
          placeholder="e.g. \\w+"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <label className="block font-medium">Flags</label>
        <input
          className="w-full border rounded px-3 py-2 dark:bg-zinc-900"
          placeholder="gim"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
        />
      </div>

      {/* Test text */}
      <div className="space-y-2">
        <label className="block font-medium">Test String</label>
        <textarea
          className="w-full h-40 border rounded px-3 py-2 font-mono dark:bg-zinc-900"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Result */}
      <div className="space-y-2">
        <h2 className="font-semibold">
          Result ({result.matches.length} matches)
        </h2>

        {result.error && (
          <div className="text-red-500 font-mono">{result.error}</div>
        )}

        {!result.error && (
          <ul className="space-y-1 text-sm font-mono">
            {result.matches.map((m) => (
              <li
                key={m.index}
                className="border rounded px-2 py-1 dark:border-zinc-700"
              >
                [{m.position}] {m.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
