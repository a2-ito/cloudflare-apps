"use client";

type Props = {
  revealed: boolean;
  onReveal: () => void;
  onReset: () => void;
  onLeave: () => void;
};

export function Controls({ revealed, onReveal, onReset, onLeave }: Props) {
  return (
    <div className="mt-6 space-y-4">
      {/* 主役ボタン */}
      {!revealed && (
        <button
          onClick={onReveal}
          className="w-full rounded-xl bg-green-600 py-3 text-lg font-bold text-white shadow transition hover:bg-green-700"
        >
          Reveal
        </button>
      )}

      {revealed && (
        <button
          onClick={onReset}
          className="w-full rounded-xl bg-amber-500 py-3 text-lg font-bold text-white shadow transition hover:bg-amber-600"
        >
          🔄 再投票を開始
        </button>
      )}

      {/* 危険操作 */}
      <button
        onClick={onLeave}
        className="w-full rounded-lg bg-red-50 py-2 text-sm text-red-600 transition hover:bg-red-100"
      >
        退出
      </button>
    </div>
  );
}
