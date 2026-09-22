"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold text-red-600 mb-4">
          アクセス権限がありません
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          このアカウントは現在利用できない状態です。
          <br />
          別のアカウントでログインしてください。
        </p>

        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
