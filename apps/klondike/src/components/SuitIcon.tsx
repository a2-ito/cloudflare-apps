type Suit = "spade" | "heart" | "diamond" | "club";

type Props = {
  suit: Suit;
  size?: number;
};

export function SuitIcon({ suit, size = 20 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    className:
      suit === "heart" || suit === "diamond" ? "fill-red-500" : "fill-black",
  };

  switch (suit) {
    case "spade":
      return (
        <svg {...common}>
          <path d="M32 4C20 18 8 28 8 40c0 8 6 14 14 14 6 0 10-4 10-10h4c0 6 4 10 10 10 8 0 14-6 14-14C56 28 44 18 32 4z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M32 56C12 36 4 28 4 18 4 10 10 4 18 4c6 0 10 4 14 8 4-4 8-8 14-8 8 0 14 6 14 14 0 10-8 18-28 38z" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <polygon points="32,4 60,32 32,60 4,32" />
        </svg>
      );
    case "club":
      return (
        <svg {...common}>
          <path d="M32 8c-6 0-10 4-10 10 0 2 1 4 2 6-2-1-4-2-6-2-6 0-10 4-10 10s4 10 10 10c4 0 8-2 10-6v6h-6v6h20v-6h-6v-6c2 4 6 6 10 6 6 0 10-4 10-10s-4-10-10-10c-2 0-4 1-6 2 1-2 2-4 2-6 0-6-4-10-10-10z" />
        </svg>
      );
  }
}
