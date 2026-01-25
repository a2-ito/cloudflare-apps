"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MonthlyTotal = {
  month: string; // 2025-01
  total: number;
};

type CategoryTotal = {
  category: string;
  total: number;
};

const COLORS = [
  "#ec4899", // 食費 ピンク
  "#facc15", // 旅行 黄色
  "#38bdf8", // 日用品 水色
  "#a78bfa",
  "#34d399",
  "#fb7185",
];

const BAR_COLOR = "#38bdf8";

export default function YearlyPage() {
  const router = useRouter();

  const [year, setYear] = useState(() => new Date().getFullYear().toString());

  const [monthly, setMonthly] = useState<MonthlyTotal[]>([]);
  const [categories, setCategories] = useState<CategoryTotal[]>([]);

  /* ---------- fetch ---------- */

  useEffect(() => {
    fetch(`/api/yearly?year=${year}`)
      .then((r) => r.json())
      .then((d) =>
        setMonthly((d as { monthly?: MonthlyTotal[] }).monthly ?? []),
      );
  }, [year]);

  useEffect(() => {
    fetch(`/api/yearly/categories?year=${year}`)
      .then((r) => r.json())
      .then((d) => setCategories((d as CategoryTotal[]) ?? []));
  }, [year]);

  /* ---------- handlers ---------- */

  const goMonth = (month: string) => {
    router.push(`/?month=${month}`);
  };

  /* ---------- render ---------- */

  return (
    <main className="p-4 space-y-8">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">📅 年間サマリ</h1>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-800"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}年
              </option>
            );
          })}
        </select>
      </div>

      {/* ===== 月別合計 ===== */}
      <section className="space-y-2">
        <h2 className="font-semibold">月別合計</h2>

        <div className="h-64 bg-white dark:bg-gray-800 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(v) => `¥${(v as number).toLocaleString()}`}
              />

              <Bar
                dataKey="total"
                fill={BAR_COLOR}
                onClick={(d) =>
                  goMonth((d as unknown as { month: string }).month)
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500">
          ※ 棒をクリックすると月次ページへ移動します
        </p>
      </section>

      {/* ===== カテゴリ別年間 ===== */}
      <section className="space-y-2">
        <h2 className="font-semibold">カテゴリ別年間合計</h2>

        <div className="h-64 bg-white dark:bg-gray-800 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="total"
                nameKey="category"
                outerRadius={90}
                label={({ name, value }) =>
                  `${name}: ¥${value?.toLocaleString()}`
                }
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(v) => `¥${(v as number).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
