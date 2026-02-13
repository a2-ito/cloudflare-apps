"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
  id: number;
  title: string;
  categoryId: number;
  createdAt: number;
  categoryName: string;
  groupName: string;
  examName: string;
  examSession: string;
};

type QuestionsResponse = {
  items: Question[];
};

export default function QuestionsPage() {
  const router = useRouter();
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
    <div className="max-w-4xl mx-auto px-4 py-8">
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
          <div
            key={q.id}
            className="block rounded-md p-4 dark:bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
            onClick={() => router.push(`/questions/${q.id}`)}
          >
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div>
                試験: {q.examName} {q.examSession} {q.groupName}{" "}
                {q.categoryName}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="font-medium dark:text-white text-gray-900">
                {q.title}
              </h2>
              <div className="flex items-center gap-3">
                <Link
                  href={`/questions/${q.id}/edit`}
                  className="text-xs bg-gray-600 text-white px-2 py-1 rounded-md"
                >
                  編集
                </Link>
                <span className="text-xs text-gray-500">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
