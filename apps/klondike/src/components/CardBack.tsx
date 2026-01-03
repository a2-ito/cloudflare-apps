export function CardBack() {
  return (
    <div
      className="
        w-16 h-24 rounded
        bg-gradient-to-br from-blue-700 to-blue-900
        border border-gray-500
        flex items-center justify-center
				shadow-md
      "
    >
      <div
        className="
          w-10 h-16 rounded
          border-2 border-blue-300
          flex items-center justify-center
        "
      >
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-300 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
