"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Choice = {
  id?: number;
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

export default function QuestionEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<QuestionDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/questions/${id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json as QuestionDetail);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const updateChoice = (index: number, value: Partial<Choice>) => {
    if (!data) return;
    const updated = [...data.choices];
    updated[index] = { ...updated[index], ...value };
    setData({ ...data, choices: updated });
  };

  const setCorrect = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      choices: data.choices.map((c, i) => ({
        ...c,
        isCorrect: i === index,
      })),
    });
  };

  const addChoice = () => {
    if (!data) return;
    setData({
      ...data,
      choices: [...data.choices, { text: "", isCorrect: false }],
    });
  };

  const removeChoice = (index: number) => {
    if (!data || data.choices.length <= 2) return;
    const updated = data.choices.filter((_, i) => i !== index);
    setData({ ...data, choices: updated });
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);

    const res = await fetch(`/api/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        body: data.body,
        explanation: data.explanation,
        choices: data.choices.map((c) => ({
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      }),
    });

    setSaving(false);

    if (res.ok) {
      router.push(`/questions/${id}`);
    } else {
      alert("保存に失敗しました");
    }
  };

  const remove = async () => {
    if (!confirm("この問題を削除しますか？")) return;

    const res = await fetch(`/api/questions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/questions");
    } else {
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!data) {
    return <p className="p-4">問題が見つかりません</p>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-bold">問題編集</h1>

      {/* Title */}
      <input
        className="w-full border rounded-md p-2"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="タイトル"
      />

      {/* Body */}
      <textarea
        className="w-full border rounded-md p-2 min-h-[120px]"
        value={data.body}
        onChange={(e) => setData({ ...data, body: e.target.value })}
        placeholder="問題文"
      />

      {/* Choices */}
      <div className="space-y-2">
        {data.choices.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border rounded-md p-2"
          >
            <input
              type="radio"
              checked={c.isCorrect}
              onChange={() => setCorrect(i)}
            />
            <input
              className="flex-1 border rounded-md p-1"
              value={c.text}
              onChange={(e) => updateChoice(i, { text: e.target.value })}
            />
            {data.choices.length > 2 && (
              <button
                onClick={() => removeChoice(i)}
                className="text-red-600 text-sm px-2 py-1"
              >
                削除
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addChoice}
          className="w-full border-2 border-dashed border-gray-300 rounded-md p-2 text-gray-600 hover:border-gray-400"
        >
          + 選択肢を追加
        </button>
      </div>

      {/* Explanation */}
      <textarea
        className="w-full border rounded-md p-2"
        value={data.explanation ?? ""}
        onChange={(e) => setData({ ...data, explanation: e.target.value })}
        placeholder="解説"
      />

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button onClick={remove} className="text-red-600 text-sm">
          削除
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          保存
        </button>
      </div>
    </main>
  );
}
