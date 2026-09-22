"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl bg-zinc-900 shadow-lg p-8 space-y-6">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">ExamLab</h1>
            <p className="text-sm text-zinc-400">資格学習を、構造化する。</p>
          </header>

          <section className="space-y-4">
            <p className="text-sm text-zinc-300 text-center">
              このアプリは、事前に許可されたユーザーのみ利用できます。
            </p>

            <div className="flex justify-center">
              <GoogleLogin
                theme="filled_black"
                size="large"
                shape="pill"
                onSuccess={async (cred) => {
                  const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken: cred.credential }),
                  });

                  if (res.ok) {
                    router.push("/dashboard");
                  } else {
                    alert("アクセス権がありません");
                  }
                }}
                onError={() => alert("ログインに失敗しました")}
              />
            </div>
          </section>
        </div>

        <footer className="mt-6 text-center text-xs text-zinc-500">
          © ExamLab
        </footer>
      </div>
    </main>
  );
}
