"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Question = {
  id: number;
  title: string;
  categoryId: number;
  createdAt: number;
};

type QuestionsResponse = {
  items: Question[];
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await fetch(`/api/questions`);

        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data: QuestionsResponse = await res.json();
        setQuestions(data.items);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">問題一覧</h1>

        <Link
          href="/questions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          ＋ 新規問題
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {questions.length === 0 && (
          <p className="text-gray-500 text-sm">まだ問題が登録されていません</p>
        )}

        {questions.map((q) => (
          <Link
            key={q.id}
            href={`/questions/${q.id}`}
            className="block border rounded-md p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{q.title}</h2>
              <span className="text-xs text-gray-500">
                {new Date(q.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="text-xs text-gray-400 mt-1">
              categoryId: {q.categoryId}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
