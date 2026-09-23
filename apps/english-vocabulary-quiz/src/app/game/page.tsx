"use client";

import { useState, useEffect } from "react";
import { pickRandomQuestions } from "@/lib/game";
import { Question } from "@/data/questions";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setQuestions(pickRandomQuestions(10));
  }, []);

  if (questions.length === 0) return <p>Loading...</p>;

  const q = questions[current];

  function selectAnswer(choice: string) {
    const next = {
      ...answers,
      [q.id]: choice,
    };
    setAnswers(next);

    if (current === 9) {
      sessionStorage.setItem(
        "result",
        JSON.stringify({ questions, answers: next }),
      );
      router.push("/result");
    } else {
      setCurrent(current + 1);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 rounded-2xl p-6 shadow-lg">
        <div className="text-sm text-gray-400 mb-2">
          Question {current + 1} / 10
        </div>
        <div className="h-1 bg-slate-700 rounded">
          <div
            className="h-1 bg-sky-400"
            style={{ width: `${((current + 1) / 10) * 100}%` }}
          />
        </div>

        <p className="text-lg font-medium mb-6 leading-relaxed">{q.sentence}</p>

        <div className="space-y-3">
          {q.choices.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelected(c);
                setTimeout(() => selectAnswer(c), 600);
              }}
              className={`
    w-full py-3 rounded-xl px-4 text-left
    ${
      selected === c
        ? c === q.answer
          ? "bg-green-500"
          : "bg-red-500"
        : "bg-slate-800 hover:bg-slate-700"
    }
  `}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
