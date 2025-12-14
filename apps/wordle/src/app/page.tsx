import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Header />

      <h1 className="text-3xl font-bold">
        Wordle Clone (Next.js)
      </h1>

      <p className="text-gray-600">
        ベースアプリ動作確認用ページ
      </p>

      <button className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">
        Start Game
      </button>
    </main>
  );
}
