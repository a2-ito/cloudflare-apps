"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HIGH_SCORE_KEY = "toeic-high-score";

export default function HomePage() {
  const [highScore, setHighScore] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    setHighScore(stored ? Number(stored) : 0);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 rounded-2xl p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-2">English Vocabulary Quiz</h1>

        <p className="text-gray-400 mb-6">
          Answer 10 questions and test your business English
        </p>

        <div className="mb-6">
          <p className="text-sm text-gray-400">High Score</p>
          <p className="text-2xl font-semibold">{highScore} / 10</p>
        </div>

        <Link
          href="/english-vocabulary-quiz/game"
          className="
            inline-block w-full
            bg-sky-500 hover:bg-sky-400
            text-white font-medium
            py-3 rounded-xl
            transition
          "
        >
          Start Game
        </Link>
      </div>
    </main>
  );
}
