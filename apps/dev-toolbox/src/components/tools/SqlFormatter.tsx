"use client";

import { format, FormatOptionsWithLanguage } from "sql-formatter";
import { useState } from "react";

const DIALECTS = [
  { label: "Standard SQL", value: "sql" },
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "SQLite", value: "sqlite" },
];

type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "bigquery" | "clickhouse" | "db2" | "db2i" | "duckdb" | "hive" | "mariadb" | "tidb" | "n1ql" | "plsql" | "redshift" | "spark" | "trino";

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

export default function SqlFormatterPage({ t }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("sql");

  const handleFormat = () => {
    try {
      const formatted = format(input, {
        language: dialect,
        indent: 2,
        uppercase: true,
      } as FormatOptionsWithLanguage);
      setOutput(formatted);
    } catch {
      setOutput("❌ SQL parse error");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t.name}</h1>

      <div className="flex gap-2">
        <select
          className="border rounded px-2 py-1 dark:bg-zinc-900"
          value={dialect}
          onChange={(e) => setDialect(e.target.value as SqlDialect)}
        >
          {DIALECTS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleFormat}
          className="px-4 py-1 rounded bg-blue-600 text-white"
        >
          {t.format}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          className="h-64 w-full p-2 font-mono text-sm border rounded dark:bg-zinc-900"
          placeholder="SELECT * FROM users WHERE id=1;"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <textarea
          className="h-64 w-full p-2 font-mono text-sm border rounded dark:bg-zinc-900"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
}
