"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Choice = {
  id: number;
  text: string;
  isCorrect: boolean;
};

type QuestionDetail = {
  id: number;
  title: string;
  body: string;
  explanation?: string;
  choices: Choice[];
};

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/questions/${id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json: QuestionDetail = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!data) {
    return <p className="p-4">問題が見つかりません</p>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <Link href="/questions" className="text-sm text-blue-600">
          ← 一覧へ
        </Link>
      </div>

      {/* Body */}
      <p className="whitespace-pre-wrap">{data.body}</p>

      {/* Choices */}
      <div className="space-y-2">
        {data.choices.map((c) => {
          const isSelected = selected === c.id;
          const isCorrect = showExplanation && c.isCorrect;

          return (
            <label
              key={c.id}
              className={`block border rounded-md p-3 cursor-pointer
                ${isSelected ? "border-blue-500" : ""}
                ${isCorrect ? "bg-green-50 border-green-500" : ""}
              `}
            >
              <input
                type="radio"
                name="choice"
                className="mr-2"
                checked={isSelected}
                onChange={() => setSelected(c.id)}
              />
              {c.text}
            </label>
          );
        })}
      </div>

      {/* Actions */}
      <div className="space-x-3">
        <button
          onClick={() => setShowExplanation(true)}
          disabled={selected === null}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          解説を見る
        </button>

        {showExplanation && data.explanation && (
          <div className="mt-4 border-l-4 border-blue-500 pl-4 text-sm">
            {data.explanation}
          </div>
        )}
      </div>
    </main>
  );
}
