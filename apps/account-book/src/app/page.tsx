"use client";

//import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CategoryPieChart = dynamic(
  () => import("@/components/CategoryPieChart"),
  { ssr: false },
);

type Summary = {
  category: string;
  total: number;
};

type Expense = {
  id: number;
  amount: number;
  date: string;
  memo: string | null;
  category: string;
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  //const router = useRouter();

  const month = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [expensesRes, summaryRes] = await Promise.all([
        fetch(`/api/expenses?month=${month}`),
        fetch(`/api/expenses/summary?month=${month}`),
      ]);

      const expensesText = await expensesRes.text();
      const summaryText = await summaryRes.text();

      setExpenses(expensesText ? JSON.parse(expensesText) : []);
      setSummary(summaryText ? JSON.parse(summaryText) : []);

      setLoading(false);
    };

    load();
  }, [month]);

  const total = useMemo(() => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          家計簿
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {month} の支出
        </p>
      </header>

      {/* 合計 */}
      <section className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">今月の合計</p>
        <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
          ¥{total.toLocaleString()}
        </p>
      </section>

      {/* 円グラフ */}
      <section className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          カテゴリ別
        </h2>
        {!loading && <CategoryPieChart data={summary} />}
      </section>

      {/* 一覧 */}
      <section className="space-y-2">
        {loading && <p className="text-sm text-gray-500">読み込み中...</p>}

        {!loading && expenses.length === 0 && (
          <p className="text-sm text-gray-500">まだ支出がありません</p>
        )}

        {expenses.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {e.category}
              </p>
              <p className="text-xs text-gray-500">
                {e.date}
                {e.memo && ` · ${e.memo}`}
              </p>
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              ¥{e.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      {/* 追加ボタン */}
      <Link
        href="/add"
        className="fixed bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-blue-600 py-3 text-center font-semibold text-white shadow-lg active:scale-95"
      >
        ＋ 支出を追加
      </Link>
    </main>
  );
}
