"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type TagExpense = {
  id: number;
  amount: number;
  date: string;
  memo: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

type CategoryTotal = {
  category: string;
  total: number;
};

type TagDetail = {
  tag: { id: number; name: string };
  total: number;
  count: number;
  byCategory: CategoryTotal[];
  expenses: TagExpense[];
};

export default function TagDetailClient({ tagId }: { tagId: string }) {
  const [detail, setDetail] = useState<TagDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const res = await fetch(`/api/tags/${tagId}/expenses`);

      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setLoading(false);
        return;
      }

      setDetail((await res.json()) as TagDetail);
      setLoading(false);
    };

    loadDetail();
  }, [tagId]);

  // 支出の多いカテゴリから並べる
  const byCategory = useMemo(
    () => [...(detail?.byCategory ?? [])].sort((a, b) => b.total - a.total),
    [detail],
  );

  if (loading) {
    return <main className="p-4">Loading...</main>;
  }

  if (notFound || !detail) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          タグが見つかりませんでした。
        </p>
        <Link href="/tags" className="text-blue-600 hover:underline">
          タグ一覧へ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="min-w-0 truncate text-2xl font-bold text-gray-900 dark:text-gray-100">
          {detail.tag.name}
        </h1>
        <Link
          href="/tags"
          className="shrink-0 text-sm text-blue-600 hover:underline"
        >
          タグ一覧へ
        </Link>
      </div>

      {/* 合計 */}
      <div className="mb-4 rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm text-gray-500">合計</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {detail.total.toLocaleString()}円
        </div>
        <div className="text-sm text-gray-500">{detail.count}件</div>
      </div>

      {/* カテゴリ別内訳 */}
      {byCategory.length > 0 && (
        <div className="mb-4 rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
            カテゴリ別内訳
          </h2>
          <div className="space-y-1">
            {byCategory.map((row) => (
              <div
                key={row.category}
                className="flex justify-between text-sm text-gray-700 dark:text-gray-200"
              >
                <span>{row.category}</span>
                <span>{Number(row.total).toLocaleString()}円</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 明細一覧 */}
      <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
        明細
      </h2>

      {detail.expenses.length === 0 ? (
        <p className="text-sm text-gray-500">
          このタグが付いた明細はまだありません。
        </p>
      ) : (
        <div className="space-y-2">
          {detail.expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-lg border bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="min-w-0">
                <div className="text-sm text-gray-500">
                  {expense.date} / {expense.categoryName ?? "未分類"}
                </div>
                {expense.memo && (
                  <div className="truncate text-gray-900 dark:text-gray-100">
                    {expense.memo}
                  </div>
                )}
              </div>
              <div className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">
                {expense.amount.toLocaleString()}円
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
