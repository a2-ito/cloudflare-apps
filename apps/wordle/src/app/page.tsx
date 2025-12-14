import Header from "@/components/Header";
import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Header />

      <h1 className="text-3xl font-bold">Wordle Clone</h1>

      <Board />

      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Wordle Clone with Dark Mode
      </p>

    </main>
  );
}
