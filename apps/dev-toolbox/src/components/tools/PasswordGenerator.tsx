"use client";

import { useState } from "react";
import { generatePassword } from "@/lib/password";
import type { PasswordGeneratorMessages } from "@/types/tools";

type Props = {
  t: PasswordGeneratorMessages;
};

type PasswordOptionKey = "lowercase" | "uppercase" | "numbers" | "symbols";

export default function PasswordGenerator({ t }: Props) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  console.log(t);

  function generate() {
    setPassword(
      generatePassword({
        length,
        ...options,
      }),
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* 出力 */}
      <div className="flex gap-2">
        <input
          value={password}
          readOnly
          className="flex-1 rounded border px-3 py-2 bg-background"
        />
        <button
          onClick={() => navigator.clipboard.writeText(password)}
          className="px-3 py-2 rounded bg-blue-600 text-white"
        >
          {t.copy}
        </button>
      </div>

      {/* 長さ */}
      <div>
        <label>
          {t.length}: {length}
        </label>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* オプション */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(options) as [PasswordOptionKey, boolean][]).map(
          ([key, value]) => (
            <label key={key} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setOptions({ ...options, [key]: !value })}
              />
              {t[key]}
            </label>
          ),
        )}
      </div>

      <button
        onClick={generate}
        className="w-full py-2 rounded bg-green-600 text-white"
      >
        {t.generate}
      </button>
    </div>
  );
}
