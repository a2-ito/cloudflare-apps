"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Check, X } from "lucide-react";

type TagSummary = {
  id: number;
  name: string;
  expenseCount: number;
  total: number;
};

export default function TagsPage() {
  const [tags, setTags] = useState<TagSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadTags = async () => {
    const res = await fetch("/api/tags");
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as TagSummary[];
    setTags(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const messageFor = (error?: string) =>
    error === "tag-name-taken"
      ? "同じ名前のタグがすでにあります"
      : error === "tag-name-empty"
        ? "タグ名を入力してください"
        : error === "tag-name-too-long"
          ? "タグ名が長すぎます（50文字まで）"
          : "処理に失敗しました";

  const createTag = async () => {
    const name = newTagName.trim();
    if (!name) return;

    setError(null);

    const res = await fetch("/api/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(messageFor(data.error));
      return;
    }

    setNewTagName("");
    await loadTags();
  };

  const startEditing = (tag: TagSummary) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setError(null);
  };

  const saveEditing = async () => {
    if (editingId === null) return;

    const name = editingName.trim();
    if (!name) return;

    const res = await fetch(`/api/tags/${editingId}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(messageFor(data.error));
      return;
    }

    setEditingId(null);
    await loadTags();
  };

  const deleteTag = async (tag: TagSummary) => {
    const message =
      tag.expenseCount > 0
        ? `「${tag.name}」を削除しますか？\n${tag.expenseCount}件の明細からタグが外れます（明細自体は削除されません）。`
        : `「${tag.name}」を削除しますか？`;

    if (!confirm(message)) return;

    const res = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });

    if (!res.ok) {
      setError("削除に失敗しました");
      return;
    }

    setTags((prev) => prev.filter((t) => t.id !== tag.id));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          タグ管理
        </h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ホームへ
        </Link>
      </div>

      {/* 新規作成 */}
      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
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
          className="rounded-lg bg-blue-600 px-4 font-semibold text-white"
        >
          追加
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">読み込み中...</p>
      ) : tags.length === 0 ? (
        <p className="text-sm text-gray-500">
          タグがまだありません。上の入力欄から追加してくださいっしゅ。
        </p>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="rounded-lg border bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              {editingId === tag.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    className="flex-1 rounded border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-900"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEditing();
                      }
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={saveEditing}
                    aria-label="保存"
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="キャンセル"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/tags/${tag.id}`} className="min-w-0 flex-1">
                    <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {tag.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tag.expenseCount}件 / {tag.total.toLocaleString()}円
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => startEditing(tag)}
                    aria-label="編集"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTag(tag)}
                    aria-label="削除"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
