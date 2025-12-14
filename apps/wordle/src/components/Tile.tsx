
type TileStatus = "empty" | "correct" | "present" | "absent";

type Props = {
  letter?: string;
  status?: TileStatus;
  flip?: boolean;
  delayMs?: number;
};

export default function Tile({
  letter = "",
  status = "empty",
  flip = false,
  delayMs = 0,
}: Props) {
  const base = "w-14 h-14 relative perspective-[1000px]";

  const face =
    "absolute inset-0 flex items-center justify-center border-2";

  const front =
    "bg-white text-gray-900 border-gray-300 " +
    "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700";

  const back =
    {
      correct: "bg-green-600 border-green-600 text-white",
      present: "bg-yellow-500 border-yellow-500 text-white",
      absent: "bg-gray-500 border-gray-500 text-white",
      empty: front,
    }[status];

  return (
    <div className={base} style={{ animationDelay: `${delayMs}ms` }}>
      {/* 回転する箱 */}
      <div
        className={`absolute inset-0 transition-transform duration-500
                    transform-style-preserve-3d
                    ${flip ? "rotate-x-180" : ""}`}
      >
        {/* 表 */}
        <div className={`${face} ${front} backface-hidden`}>
          <span className="text-2xl font-bold uppercase">
            {letter}
          </span>
        </div>

        {/* 裏 */}
        <div
          className={`${face} ${back} backface-hidden`}
          style={{ transform: "rotateX(180deg)" }}
        >
          <span className="text-2xl font-bold uppercase">
            {letter}
          </span>
        </div>
      </div>
    </div>
  );
}

