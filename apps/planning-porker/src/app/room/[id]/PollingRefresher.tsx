"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PollingRefresher({
  intervalMs = 3000,
  participantsCount,
}: {
  intervalMs?: number;
  participantsCount: number;
}) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [polling, setPolling] = useState(false);

  const canPoll = participantsCount > 1;

  const startPolling = () => {
    if (!canPoll) return;
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setPolling(true);
      router.refresh();

      setTimeout(() => setPolling(false), 400);
    }, intervalMs);
  };

  const stopPolling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPolling(false);
  };

  useEffect(() => {
    if (!canPoll) {
      stopPolling();
      return;
    }

    startPolling();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopPolling();
      } else {
        router.refresh();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, intervalMs, canPoll]);

  if (!polling) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 shadow-lg">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
      <span className="text-xs text-slate-200">更新中…</span>
    </div>
  );
}
