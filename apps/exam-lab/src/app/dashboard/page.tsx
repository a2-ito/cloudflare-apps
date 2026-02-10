"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">ダッシュボード</h2>
        <p className="text-sm text-zinc-400">問題の作成・管理を行います。</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/questions"
          className="block rounded-2xl bg-zinc-900 p-6 hover:bg-zinc-800 transition"
        >
          <h3 className="text-lg font-semibold">問題一覧</h3>
          <p className="mt-2 text-sm text-zinc-400">
            登録済みの問題を確認・編集します。
          </p>
        </Link>

        <Link
          href="/questions/new"
          className="block rounded-2xl bg-zinc-900 p-6 hover:bg-zinc-800 transition"
        >
          <h3 className="text-lg font-semibold">問題を登録</h3>
          <p className="mt-2 text-sm text-zinc-400">新しい問題を作成します。</p>
        </Link>

        <Link
          href="/exams"
          className="block rounded-2xl bg-zinc-900 p-6 hover:bg-zinc-800 transition"
        >
          <h3 className="text-lg font-semibold">試験管理</h3>
          <p className="mt-2 text-sm text-zinc-400">
            資格・日程の追加や編集を行います。
          </p>
        </Link>

        <Link
          href="/categories"
          className="block rounded-2xl bg-zinc-900 p-6 hover:bg-zinc-800 transition"
        >
          <h3 className="text-lg font-semibold">カテゴリ管理</h3>
          <p className="mt-2 text-sm text-zinc-400">
            資格・分類の追加や編集を行います。
          </p>
        </Link>
      </div>
    </section>
  );
}
