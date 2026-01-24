"use client";

import { useMemo, useState } from "react";

type DecodedPart = Record<string, unknown>;

function decodePart(part: string): DecodedPart {
  const json = base64UrlDecode(part);
  return JSON.parse(json);
}

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

function formatDate(value: unknown) {
  if (typeof value !== "number") return value;
  return new Date(value * 1000).toLocaleString();
}

type Props = {
  t: {
    name: string;
    description: string;
    token: string;
    header: string;
    payload: string;
  };
};

type DecodeOk = {
  header: DecodedPart;
  payload: DecodedPart;
};

type DecodeError = {
  error: string;
};



export default function JwtDecoder({ t }: Props) {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length < 2) {
        throw new Error("Invalid JWT format");
      }

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      return { header, payload };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Invalid token",
      };
    }
  }, [token]);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      <p className="text-sm text-zinc-500">{t.description}</p>

      {/* Input */}
      <textarea
        className="w-full h-32 border rounded px-3 py-2 font-mono dark:bg-zinc-900"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        value={token}
        onChange={(e) => setToken(e.target.value.trim())}
      />

      {/* Error */}
      {result && "error" in (result ?? {}) && (
        <div className="text-red-500 font-mono">{result.error}</div>
      )}

      {/* Output */}
      {result && "header" in result && "payload" in result && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">{t.header}</h2>
            <pre className="text-sm bg-zinc-100 dark:bg-zinc-900 p-3 rounded overflow-auto">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold mb-2">{t.payload}</h2>
            <pre className="text-sm bg-zinc-100 dark:bg-zinc-900 p-3 rounded overflow-auto">
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries(result.payload!).map(([k, v]) => [
                    k,
                    ["exp", "iat", "nbf"].includes(k) ? formatDate(v) : v,
                  ]),
                ),
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
