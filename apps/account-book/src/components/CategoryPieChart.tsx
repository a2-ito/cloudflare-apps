"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  data: {
    category: string;
    total: number;
  }[];
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
];

export default function CategoryPieChart({ data }: Props) {
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
            data={data}
            dataKey="total"
            nameKey="category"
            outerRadius={90}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              value == null ? "" : `¥${Number(value).toLocaleString()}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
