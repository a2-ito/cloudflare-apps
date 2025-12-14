import Header from "@/components/Header";
import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Header />

      <h1 className="text-3xl font-bold">Wordle Clone</h1>

      <Board />

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Wordle Clone with Dark Mode
      </p>
    </main>
  );
}
