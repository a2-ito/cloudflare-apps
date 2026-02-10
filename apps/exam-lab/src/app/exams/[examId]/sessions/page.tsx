"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Session = {
  id: number;
  name: string;
};

type ApiResponse = {
  items: Session[];
};

export default function ExamSessionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const [items, setItems] = useState<Session[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await fetch(`/api/exam-sessions?examId=${examId}`);
    const data = (await res.json()) as ApiResponse;
    setItems(data.items);
  };

  useEffect(() => {
    load();
  }, [examId]);

  /** 追加 */
  const add = async () => {
    if (!name) return;

    await fetch("/api/exam-sessions", {
      method: "POST",
      body: JSON.stringify({
        examId: Number(examId),
        name,
      }),
    });

    setName("");
    load();
  };

  /** 削除 */
  const remove = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/exam-sessions/${id}`, { method: "DELETE" });
    load();
  };

  /** 更新（名前） */
  const update = async (id: number, patch: Partial<Session>) => {
    await fetch(`/api/exam-sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    load();
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">試験日程管理</h1>

      {/* 一覧 */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border p-2 text-left">試験名</th>
            <th className="border p-2 w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">
                <input
                  className="w-full bg-transparent"
                  defaultValue={s.name}
                  onBlur={(e) =>
                    e.target.value !== s.name &&
                    update(s.id, { name: e.target.value })
                  }
                />
              </td>
              <td className="border p-2 text-center">
                <button className="text-red-500" onClick={() => remove(s.id)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 追加 */}
      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">＋ 新しい試験を追加</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="例：2026年 春期"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={add}
        >
          追加
        </button>
      </section>
    </main>
  );
}
