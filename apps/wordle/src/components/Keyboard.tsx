type KeyStatus = "unused" | "correct" | "present" | "absent";

type Props = {
  onKeyPress: (key: string) => void;
  keyStatuses: Record<string, KeyStatus>;
};

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function Keyboard({ onKeyPress, keyStatuses }: Props) {
  return (
    <div className="mt-6 space-y-2">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const status = keyStatuses[key] ?? "unused";

            const style = {
              unused:
                "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
              correct: "bg-green-600 text-white",
              present: "bg-yellow-500 text-white",
              absent: "bg-gray-500 text-white",
            }[status];

            const width =
              key === "enter" || key === "backspace" ? "w-16" : "w-10";

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`h-12 ${width} rounded font-bold uppercase ${style}`}
              >
                {key === "backspace" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
