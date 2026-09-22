"use client";

import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const params = useSearchParams();
  const error = params.get("error");

  const errorMessage = (() => {
    switch (error) {
      case "not-allowed":
        return "このGoogleアカウントは利用できません。";
      case "oauth":
        return "Google認証に失敗しました。";
      case "token":
        return "認証トークンの取得に失敗しました。";
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h1 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          家計簿アプリ ログイン
        </h1>

        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm dark:bg-red-900/30 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Googleでログイン
        </a>
      </div>
    </div>
  );
}
