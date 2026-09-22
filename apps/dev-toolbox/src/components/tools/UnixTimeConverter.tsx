"use client";

import { useState } from "react";
import { unixToDate, dateToUnix } from "@/lib/time";
import type { UnixTimeConverterMessages } from "@/types/tools";

type Props = {
  t: UnixTimeConverterMessages;
};

export default function UnixTimeConverter({ t }: Props) {
  const [unix, setUnix] = useState("");
  const [datetime, setDatetime] = useState("");
  const [ms, setMs] = useState(false);

  function handleUnixChange(value: string) {
    setUnix(value);
    const num = Number(value);
    if (Number.isNaN(num)) return;

    const d = unixToDate(num, ms);
    setDatetime(d.toISOString().slice(0, 19));
  }

  function handleDateChange(value: string) {
    setDatetime(value);
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return;

    setUnix(String(dateToUnix(d, ms)));
  }

  function setNow() {
    const d = new Date();
    setDatetime(d.toISOString().slice(0, 19));
    setUnix(String(dateToUnix(d, ms)));
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">{t.name}</h1>

      {/* Unix */}
      <div className="space-y-2">
        <label className="font-medium">{t.unix}</label>
        <input
          value={unix}
          onChange={(e) => handleUnixChange(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-background"
        />
      </div>

      {/* DateTime */}
      <div className="space-y-2">
        <label className="font-medium">{t.datetime}</label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-background"
        />
      </div>

      {/* Options */}
      <div className="flex gap-4 items-center">
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={ms} onChange={() => setMs(!ms)} />
          {t.milliseconds}
        </label>

        <button
          onClick={setNow}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          {t.now}
        </button>
      </div>
    </div>
  );
}
