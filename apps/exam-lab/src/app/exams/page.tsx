"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Exam = {
  id: number;
  name: string;
};

type ApiResponse = {
  items: Exam[];
};

export default function ExamsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Exam[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await fetch("/api/exams");
    const data = (await res.json()) as ApiResponse;
    setItems(data.items);
  };

  useEffect(() => {
    load();
  }, []);

  /** 追加 */
  const add = async () => {
    if (!name) return;

    await fetch("/api/exams", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    setName("");
    load();
  };

  /** 削除 */
  const remove = async (id: number) => {
    if (!confirm("この試験を削除しますか？")) return;
    await fetch(`/api/exams/${id}`, { method: "DELETE" });
    load();
  };

  /** 更新 */
  const update = async (id: number, value: string) => {
    await fetch(`/api/exams/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: value }),
    });
    load();
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">試験一覧管理</h1>

      {/* 一覧 */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border p-2 text-left">試験名</th>
            <th className="border p-2 w-32 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((exam) => (
            <tr key={exam.id}>
              <td className="border p-2">
                <input
                  className="w-full bg-transparent"
                  defaultValue={exam.name}
                  onBlur={(e) =>
                    e.target.value !== exam.name &&
                    update(exam.id, e.target.value)
                  }
                />
              </td>
              <td className="border p-2 text-center space-x-2">
                <button
                  title="試験日程"
                  onClick={() => router.push(`/exams/${exam.id}/sessions`)}
                >
                  📅
                </button>
                <button
                  className="text-red-500"
                  title="削除"
                  onClick={() => remove(exam.id)}
                >
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
          placeholder="例：基本情報技術者試験"
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
