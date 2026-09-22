"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  data: {
    category: string;
    total: number;
  }[];
};

export default function CategoryPieChart({ data }: Props) {
  // カテゴリ毎の固定色
  const COLORS: Record<string, string> = {
    食費: "#FFCCCC", // ピンク
    旅行: "#FACC15", // 黄色
    日用品: "#60A5FA", // 水色
    // その他は自動割当
  };

  // デフォルト色リスト
  const DEFAULT_COLORS = [
    "#A3E635",
    "#F97316",
    "#8B5CF6",
    "#F43F5E",
    "#22D3EE",
  ];

  // Recharts 用に変換
  const chartData = data.map((d) => ({
    name: d.category, // Pie の nameKey に対応
    value: d.total, // Pie の dataKey に対応
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500">カテゴリ別データがありません</p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
          >
            {chartData.map((entry, index) => {
              const color =
                COLORS[entry.name] ??
                DEFAULT_COLORS[index % DEFAULT_COLORS.length];
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>

          <Tooltip
            formatter={(value) =>
              value == null ? "" : `¥${Number(value).toLocaleString()}`
            }
          />

          {/* 凡例にカテゴリ名を表示 */}
          <Legend
            formatter={(value: string) => value} // そのままカテゴリ名
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
