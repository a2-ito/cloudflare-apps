"use client";

import { useMemo, useState } from "react";
import * as cronParser from "cron-parser";
import cronstrue from "cronstrue";

type Props = {
  t: {
    name: string;
    description: string;
    cronExpression: string;
    timezone: string;
    nextRuns: string;
    previousRuns: string;
    explanation: string;
    error: string;
    copy: string;
    invalidExpression: string;
    loading: string;
  };
};

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "local", label: "Local Time" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "America/New_York", label: "New York" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
];

export default function CronExpressionTester({ t }: Props) {
  const [expression, setExpression] = useState("0 12 * * *");
  const [timezone, setTimezone] = useState("local");
  const [count, setCount] = useState(10);

  const result = useMemo(() => {
    if (!expression.trim()) {
      return {
        valid: false,
        nextRuns: [],
        previousRuns: [],
        explanation: "",
        error: null,
      };
    }

    try {
      const options: cronParser.ParserOptions = {
        currentDate: new Date(),
      };

      if (timezone !== "local") {
        options.tz = timezone;
      }

      const interval = cronParser.parseExpression(expression, options);

      // Get next runs
      const nextRuns: string[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const nextDate = interval.next();
          nextRuns.push(nextDate.toLocaleString());
        } catch {
          break;
        }
      }

      // Reset and get previous runs
      interval.reset();
      const previousRuns: string[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const prevDate = interval.prev();
          previousRuns.unshift(prevDate.toLocaleString());
        } catch {
          break;
        }
      }

      // Get explanation
      let explanation = "";
      try {
        explanation = cronstrue.toString(expression);
      } catch {
        explanation = "Cannot generate explanation for this expression";
      }

      return {
        valid: true,
        nextRuns,
        previousRuns,
        explanation,
        error: null,
      };
    } catch (error) {
      return {
        valid: false,
        nextRuns: [],
        previousRuns: [],
        explanation: "",
        error: error instanceof Error ? error.message : t.invalidExpression,
      };
    }
  }, [expression, timezone, count, t.invalidExpression]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold">{t.name}</h1>

      {/* Cron Expression Input */}
      <div className="space-y-2">
        <label className="block font-medium">{t.cronExpression}</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
          placeholder="e.g. 0 12 * * *"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timezone Selection */}
        <div className="space-y-2">
          <label className="block font-medium">{t.timezone}</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Count Selection */}
        <div className="space-y-2">
          <label className="block font-medium">Number of results</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {result.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
            {t.error}
          </h3>
          <p className="text-red-600 dark:text-red-300 font-mono text-sm">
            {result.error}
          </p>
        </div>
      )}

      {/* Valid Results */}
      {result.valid && (
        <>
          {/* Explanation */}
          {result.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1 text-sm sm:text-base">
                {t.explanation}
              </h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                {result.explanation}
              </p>
            </div>
          )}

          {/* Next Runs */}
          {result.nextRuns.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  {t.nextRuns} ({result.nextRuns.length})
                </h3>
                <button
                  onClick={() => copyToClipboard(result.nextRuns.join("\n"))}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.copy}
                </button>
              </div>
              <div className="bg-white border rounded-lg p-2 sm:p-3 dark:bg-zinc-800 dark:border-zinc-700">
                <ul className="space-y-1 text-xs sm:text-sm font-mono">
                  {result.nextRuns.map((run, index) => (
                    <li
                      key={index}
                      className="border-b border-gray-100 dark:border-zinc-700 last:border-b-0 pb-1 last:pb-0"
                    >
                      {run}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Previous Runs */}
          {result.previousRuns.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  {t.previousRuns} ({result.previousRuns.length})
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(result.previousRuns.join("\n"))
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.copy}
                </button>
              </div>
              <div className="bg-white border rounded-lg p-2 sm:p-3 dark:bg-zinc-800 dark:border-zinc-700">
                <ul className="space-y-1 text-xs sm:text-sm font-mono">
                  {result.previousRuns.map((run, index) => (
                    <li
                      key={index}
                      className="border-b border-gray-100 dark:border-zinc-700 last:border-b-0 pb-1 last:pb-0"
                    >
                      {run}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
