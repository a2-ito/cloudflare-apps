"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 20;
const BLOCK = 28;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
} as const;

type ShapeKey = keyof typeof SHAPES;

const COLORS = [
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#34d399", // green
  "#f472b6", // pink
  "#fb7185", // red
  "#facc15", // yellow
  "#60a5fa", // blue
];

function randomPiece() {
  const keys = Object.keys(SHAPES) as ShapeKey[];
  const index = Math.floor(Math.random() * keys.length);
  const key = keys[index];
  return {
    shape: SHAPES[key].map((r) => [...r]),
    color: COLORS[index],
    x: 3,
    y: 0,
  };
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
  );
  type Piece = {
    shape: number[][];
    color: string;
    x: number;
    y: number;
  };

  const [piece, setPiece] = useState<Piece>(() => {
    const p = randomPiece();
    return { ...p, shape: p.shape.map((r) => [...r]) };
  });
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dark, setDark] = useState(true);

  const highScore =
    typeof document !== "undefined"
      ? Number(document.cookie.match(/highScore=(\d+)/)?.[1] || 0)
      : 0;

  function saveHighScore(v: number) {
    document.cookie = `highScore=${v}; max-age=31536000; path=/`;
  }

  function rotate(shape: readonly (readonly number[])[]) {
    return shape[0].map((_, i) => shape.map((r) => r[i]).reverse());
  }

  function collide(
    px: number,
    py: number,
    shape: readonly (readonly number[])[] = piece.shape,
  ) {
    return shape.some((row, y) =>
      row.some(
        (v, x) =>
          v && (board[y + py]?.[x + px] === undefined || board[y + py][x + px]),
      ),
    );
  }

  function merge() {
    const newBoard = board.map((r) => [...r]);
    piece.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) newBoard[y + piece.y][x + piece.x] = piece.color;
      }),
    );
    setBoard(clearLines(newBoard));
    setPiece(randomPiece());
  }

  function clearLines(b: (string | null)[][]) {
    const filtered = b.filter((r) => r.some((v) => !v));
    const cleared = ROWS - filtered.length;
    if (cleared) setScore((s) => s + cleared * 100);
    return [
      ...Array.from({ length: cleared }, () => Array(COLS).fill(null)),
      ...filtered,
    ];
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, COLS * BLOCK, ROWS * BLOCK);
    ctx.fillStyle = dark ? "#020617" : "#f8fafc";
    ctx.fillRect(0, 0, COLS * BLOCK, ROWS * BLOCK);

    ctx.lineWidth = 1;
    ctx.strokeStyle = dark ? "#1e293b" : "#e2e8f0";
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK, 0);
      ctx.lineTo(x * BLOCK, ROWS * BLOCK);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK);
      ctx.lineTo(COLS * BLOCK, y * BLOCK);
      ctx.stroke();
    }

    board.forEach((row, y) =>
      row.forEach((v, x) => {
        if (!v) return;
        ctx.fillStyle = v;
        ctx.fillRect(x * BLOCK + 1, y * BLOCK + 1, BLOCK - 2, BLOCK - 2);
      }),
    );

    piece.shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (!v) return;
        ctx.fillStyle = piece.color;
        ctx.fillRect(
          (x + piece.x) * BLOCK + 1,
          (y + piece.y) * BLOCK + 1,
          BLOCK - 2,
          BLOCK - 2,
        );
      }),
    );
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (!collide(piece.x, piece.y + 1)) {
        setPiece((p) => ({ ...p, y: p.y + 1 }));
      } else {
        merge();
        if (piece.y === 0) {
          setGameOver(true);
          setRunning(false);
        }
      }
    }, 500);
    return () => clearInterval(id);
  }, [piece, board]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !collide(piece.x - 1, piece.y))
        setPiece((p) => ({ ...p, x: p.x - 1 }));
      if (e.key === "ArrowRight" && !collide(piece.x + 1, piece.y))
        setPiece((p) => ({ ...p, x: p.x + 1 }));
      if (e.key === "ArrowDown" && !collide(piece.x, piece.y + 1))
        setPiece((p) => ({ ...p, y: p.y + 1 }));
      if (e.key === "ArrowUp") {
        const rotated = rotate(piece.shape);
        if (!collide(piece.x, piece.y, rotated)) {
          setPiece((p) => ({ ...p, shape: rotated }));
        }
      }
      if (e.key === " ") {
        let y = piece.y;
        while (!collide(piece.x, y + 1)) y++;
        setPiece((p) => ({ ...p, y }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [piece]);

  useEffect(() => {
    if (score > highScore) saveHighScore(score);
  }, [score]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark
          ? "linear-gradient(180deg,#020617,#020617 60%,#020617)"
          : "linear-gradient(180deg,#f8fafc,#e2e8f0)",
        color: dark ? "#e5e7eb" : "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 200px",
          gap: 24,
          background: dark ? "#020617" : "#ffffff",
          padding: 24,
          borderRadius: 16,
          boxShadow: dark
            ? "0 20px 40px rgba(0,0,0,.6)"
            : "0 20px 40px rgba(15,23,42,.15)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK}
          height={ROWS * BLOCK}
          style={{ borderRadius: 12 }}
        />
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>Tetris</h1>
          <p style={{ marginBottom: 8 }}>Score: {score}</p>
          <p style={{ marginBottom: 16 }}>
            High Score: {Math.max(score, highScore)}
          </p>

          {!running && !gameOver && (
            <button
              onClick={() => {
                setBoard(
                  Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
                );
                setScore(0);
                setPiece(randomPiece());
                setRunning(true);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#22c55e",
                color: "#022c22",
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
                marginBottom: 8,
              }}
            >
              Start Game
            </button>
          )}

          {running && (
            <button
              onClick={() => setRunning(false)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#f97316",
                color: "#431407",
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
                marginBottom: 8,
              }}
            >
              End Game
            </button>
          )}

          {gameOver && (
            <button
              onClick={() => {
                setGameOver(false);
                setBoard(
                  Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
                );
                setScore(0);
                setPiece(randomPiece());
                setRunning(true);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#ef4444",
                color: "#450a0a",
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
                marginBottom: 8,
              }}
            >
              Restart
            </button>
          )}

          <button
            onClick={() => setDark((d) => !d)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: dark ? "#1e293b" : "#0f172a",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              width: "100%",
            }}
          >
            Toggle Dark Mode
          </button>

          <p style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
            Controls: ← → ↓ ↑ Space
          </p>
        </div>
      </div>
    </div>
  );
}
