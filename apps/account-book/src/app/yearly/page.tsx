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
  Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MonthlyRow = {
  month: string; // 2025-01
  category: string;
  total: number;
};

type MonthlyChartRow = {
  month: string;
} & Record<string, number | string>;

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

export default function YearlyPage() {
  const router = useRouter();

  const [year, setYear] = useState(() => new Date().getFullYear().toString());

  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [categories, setCategories] = useState<CategoryTotal[]>([]);

  /* ---------- fetch ---------- */

  useEffect(() => {
    fetch(`/api/yearly?year=${year}`)
      .then((r) => r.json())
      .then((d) => setMonthly((d as { monthly?: MonthlyRow[] }).monthly ?? []));
  }, [year]);

  useEffect(() => {
    fetch(`/api/yearly/categories?year=${year}`)
      .then((r) => r.json())
      .then((d) => setCategories((d as CategoryTotal[]) ?? []));
  }, [year]);

  /* ---------- derive: 月×カテゴリの積み上げデータ ---------- */

  // 出現順を保ったカテゴリ名一覧（積み上げの各系列キー）
  const categoryKeys = useMemo(() => {
    const keys: string[] = [];
    for (const row of monthly) {
      if (!keys.includes(row.category)) keys.push(row.category);
    }
    return keys;
  }, [monthly]);

  // 月ごと1レコードに集約し、カテゴリ名をキーに金額を展開
  const chartData = useMemo<MonthlyChartRow[]>(() => {
    const byMonth = new Map<string, MonthlyChartRow>();
    for (const row of monthly) {
      const entry = byMonth.get(row.month) ?? { month: row.month };
      entry[row.category] = row.total;
      byMonth.set(row.month, entry);
    }
    return Array.from(byMonth.values()).sort((a, b) =>
      a.month.localeCompare(b.month),
    );
  }, [monthly]);

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
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(v) => `¥${(v as number).toLocaleString()}`}
              />
              <Legend />

              {categoryKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="total"
                  fill={COLORS[i % COLORS.length]}
                  onClick={(d) =>
                    goMonth((d as unknown as { month: string }).month)
                  }
                />
              ))}
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
