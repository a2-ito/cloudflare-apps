"use client";

import { useEffect, useState } from "react";

export type ExpenseForEdit = {
  id: number;
  amount: number;
  categoryId: number | null;
  date: string;
  memo: string | null;
};

type Category = {
  id: number;
  name: string;
};

type Props = {
  expense: ExpenseForEdit;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void; // 再取得用
};

export default function EditExpenseModal({
  expense,
  categories,
  onClose,
  onSaved,
}: Props) {
  const [amount, setAmount] = useState(expense.amount);
  const [categoryId, setCategoryId] = useState<string>(
    expense.categoryId ? String(Math.trunc(expense.categoryId)) : "",
  );
  const [date, setDate] = useState(expense.date);
  const [memo, setMemo] = useState(expense.memo ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    await fetch(`/api/expenses/${expense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        categoryId: categoryId || null,
        date,
        memo,
      }),
    });

    setLoading(false);
    onSaved();
    onClose();
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  //useEffect(() => {
  //  if (expense.categoryId !== null && expense.categoryId !== undefined) {
  //    // 🔑 正規化
  //    const normalized = String(parseInt(expense.categoryId, 10));
  //    setCategoryId(normalized);
  //  } else {
  //    setCategoryId("");
  //  }
  //}, [expense]);

  // ✅ categories がまだなら描画しない
  if (categories.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-900 p-4 rounded">読み込み中…</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-md p-4 space-y-4">
        <h2 className="text-lg font-bold">支出の編集</h2>

        <div>
          <label className="block text-sm">金額</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm">カテゴリ</label>
          <select
            className="w-full border rounded p-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">日付</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">メモ</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            キャンセル
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
