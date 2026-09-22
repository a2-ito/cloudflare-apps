"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_PREFIX = "planning-poker:";

export function ClientLastRoom() {
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const id = key.replace(STORAGE_PREFIX, "");
        setRoomId(id);
        break;
      }
    }
  }, []);

  if (!roomId) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <p>前回参加していたルームがあります</p>
      <Link href={`/room/${roomId}`}>
        <button>ルームに戻る</button>
      </Link>
    </div>
  );
}
