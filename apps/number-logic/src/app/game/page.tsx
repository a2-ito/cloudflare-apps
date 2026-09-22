import { Suspense } from "react";
import GameClient from "./GameClient";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <GameClient />
    </Suspense>
  );
}
