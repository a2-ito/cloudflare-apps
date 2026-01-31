"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetch("/api/categories");
      const data: Category[] = (await res.json()) as Category[];
      setCategories(data);
    };

    loadCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    const ok = confirm("このカテゴリを削除しますか？");
    if (!ok) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = (await res.json()) as { error?: string };

      if (data.error === "category-in-use") {
        alert("このカテゴリは使用中のため削除できません");
      } else {
        alert("削除に失敗しました");
      }
    }
  };

  return (
    <main>
      <h2 className="mt-6 font-semibold">カテゴリ管理</h2>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded border p-2
											 bg-white dark:bg-gray-800"
          >
            <span>{c.name}</span>

            <button
              onClick={() => deleteCategory(c.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
