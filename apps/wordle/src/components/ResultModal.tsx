
"use client";

type Props = {
  state: "won" | "lost";
  answer: string;
  onClose: () => void;
};

export default function ResultModal({ state, answer, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/40">
      <div className="w-80 rounded-lg bg-white p-6 text-center
                      dark:bg-gray-800">
        <h2 className="mb-2 text-xl font-bold">
          {state === "won" ? "🎉 You Win!" : "😢 Game Over"}
        </h2>

        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Answer: <span className="font-bold uppercase">{answer}</span>
        </p>

        <button
          onClick={onClose}
          className="rounded bg-green-600 px-4 py-2
                     font-bold text-white hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
