"use client";

import { useEffect, useState } from "react";

interface Exam {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  items: T[];
}

export default function CategoriesPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [examId, setExamId] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories/exams")
      .then((r) => r.json())
      .then((d) => setExams((d as ApiResponse<Exam>).items));
  }, []);

  useEffect(() => {
    if (!examId) return;
    fetch(`/api/categories/groups?examId=${examId}`)
      .then((r) => r.json())
      .then((d) => setGroups((d as ApiResponse<Group>).items));
  }, [examId]);

  useEffect(() => {
    if (!groupId) return;
    fetch(`/api/categories/categories?groupId=${groupId}`)
      .then((r) => r.json())
      .then((d) => setCategories((d as ApiResponse<Category>).items));
  }, [groupId]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">カテゴリ管理</h1>

      <section>
        <h2 className="font-semibold">資格</h2>
        {exams.map((e) => (
          <button
            key={e.id}
            onClick={() => setExamId(e.id)}
            className="block text-left"
          >
            {e.name}
          </button>
        ))}
      </section>

      {groups.length > 0 && (
        <section>
          <h2 className="font-semibold">大分類</h2>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupId(g.id)}
              className="block text-left"
            >
              {g.name}
            </button>
          ))}
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="font-semibold">小分類</h2>
          <ul className="list-disc pl-5">
            {categories.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
