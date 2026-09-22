"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import { getHighScores } from "@/lib/highscore";

export default function Home() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
    "normal",
  );
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  const startGame = () => {
    router.push(`/game?difficulty=${difficulty}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative gap-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-80 space-y-6">
        {/* 🌙 ダークモード切り替え（右上） */}
        <button
          onClick={toggle}
          className="
          absolute top-4 right-4
          px-3 py-1
          rounded-full
          text-sm
          bg-cell
          hover:ring
          transition
        "
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Number Logic
        </h1>

        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>🏆 High Scores</p>
          <p className="text-green-400">Easy: {scores.easy ?? "-"}</p>
          <p className="text-yellow-400">Normal: {scores.normal ?? "-"}</p>
          <p className="text-red-400">Hard: {scores.hard ?? "-"}</p>
        </div>

        {/* 難易度選択 */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "easy" | "normal" | "hard")
            }
            className="w-full px-3 py-2 rounded-md
              bg-gray-100 dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring"
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Start ボタン */}
        <button
          onClick={startGame}
          className="w-full py-2 rounded-md
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold"
        >
          Start Game
        </button>
      </div>
    </main>
  );
}
