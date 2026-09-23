"use client";

import { useEffect, useState } from "react";
import { calculateScore } from "@/games/english-vocabulary-quiz/lib/game";
import { Question } from "@/games/english-vocabulary-quiz/data/questions";
import Link from "next/link";
import { RESULT_STORAGE_KEY } from "@/games/english-vocabulary-quiz/lib/storage-keys";

export default function ResultPage() {
  const [score, setScore] = useState<number | null>(null);
  const HIGH_SCORE_KEY = "toeic-high-score";

  useEffect(() => {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return;

    const { questions, answers } = JSON.parse(raw);
    const currentScore = calculateScore(questions, answers);

    setScore(currentScore);

    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    const highScore = stored ? Number(stored) : 0;

    if (currentScore > highScore) {
      localStorage.setItem(HIGH_SCORE_KEY, String(currentScore));
    }
  }, []);

  if (score === null) return <p>Loading...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-950 p-8 rounded-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Result</h1>
        <p className="text-xl mb-6">{score} / 10 correct</p>

        <Link
          href="/english-vocabulary-quiz"
          className="inline-block bg-sky-500 px-6 py-3 rounded-xl hover:bg-sky-400 transition"
        >
          Play Again
        </Link>
      </div>
    </main>
  );
}
