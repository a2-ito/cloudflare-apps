"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { month: string; total: number }[];
};

export default function YearlyBarChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v) => `¥${Number(v).toLocaleString()}`} />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
