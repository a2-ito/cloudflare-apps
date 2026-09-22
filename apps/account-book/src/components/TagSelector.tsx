"use client";

import { useEffect, useState } from "react";

export type Tag = {
  id: number;
  name: string;
};

type Props = {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
};

/** 明細に付けるタグを複数選択する。その場で新規タグも作成できる */
export default function TagSelector({ selectedTagIds, onChange }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      const res = await fetch("/api/tags");
      if (!res.ok) return;
      const data = (await res.json()) as Tag[];
      setTags(data);
    };

    loadTags();
  }, []);

  const toggleTag = (id: number) => {
    onChange(
      selectedTagIds.includes(id)
        ? selectedTagIds.filter((tagId) => tagId !== id)
        : [...selectedTagIds, id],
    );
  };

  const createTag = async () => {
    const name = newTagName.trim();
    if (!name || creating) return;

    setCreating(true);
    setError(null);

    const res = await fetch("/api/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    setCreating(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(
        data.error === "tag-name-taken"
          ? "同じ名前のタグがすでにあります"
          : "タグの作成に失敗しました",
      );
      return;
    }

    const created = (await res.json()) as Tag;
    setTags((prev) =>
      [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
    );
    onChange([...selectedTagIds, created.id]);
    setNewTagName("");
  };

  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
        タグ
      </label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          placeholder="新しいタグ（例: 202809_イタリア）"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createTag();
            }
          }}
        />
        <button
          type="button"
          onClick={createTag}
          disabled={creating}
          className="rounded-lg bg-gray-200 px-3 text-sm disabled:opacity-50 dark:bg-gray-700"
        >
          追加
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
