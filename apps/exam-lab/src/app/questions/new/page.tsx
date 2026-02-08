"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Exam = {
  id: number;
  name: string;
};

type Session = {
  id: number;
  name: string;
  examDate: number;
};

/**
 * ファイルパス:
 * src/app/questions/new/page.tsx
 */

export default function NewQuestionPage() {
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [examId, setExamId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [explanation, setExplanation] = useState("");
  const [choices, setChoices] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [submitting, setSubmitting] = useState(false);

  /** 試験一覧取得 */
  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json() as Promise<{ items: Exam[] }>)
      .then((d) => setExams(d.items));
  }, []);
  const updateChoice = (
    index: number,
    field: "text" | "isCorrect",
    value: any,
  ) => {
    setChoices((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  };

  const handleSubmit = async () => {
    if (!choices.some((c) => c.isCorrect)) {
      alert("正解の選択肢を1つ以上指定してください");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        explanation,
        choices,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/questions");
    } else {
      alert("問題の登録に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">問題登録</h1>
          <p className="text-sm text-zinc-400">4択問題を登録します。</p>
        </header>

        {/* 資格 */}
        <div>
          <label className="block text-sm mb-1">資格（試験）</label>
          <select
            className="w-full border p-2 rounded"
            value={examId ?? ""}
            onChange={(e) => setExamId(Number(e.target.value))}
          >
            <option value="">選択してください</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* 試験日程 */}
        <div>
          <label className="block text-sm mb-1">試験日程</label>
          <select
            className="w-full border p-2 rounded"
            value={sessionId ?? ""}
            disabled={!examId}
            onChange={(e) => setSessionId(Number(e.target.value))}
          >
            <option value="">選択してください</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}（{new Date(s.examDate).toLocaleDateString()}）
              </option>
            ))}
          </select>
        </div>

        <section className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm">問題タイトル</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">問題文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm">選択肢</label>
            {choices.map((choice, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct"
                  checked={choice.isCorrect}
                  onChange={() =>
                    setChoices((prev) =>
                      prev.map((c, idx) => ({
                        ...c,
                        isCorrect: idx === i,
                      })),
                    )
                  }
                />
                <input
                  value={choice.text}
                  onChange={(e) => updateChoice(i, "text", e.target.value)}
                  className="flex-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2"
                  placeholder={`選択肢 ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm">解説</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700"
            >
              キャンセル
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              登録する
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
