"use client";

import { useEffect, useState, useCallback } from "react";
import Tile from "./Tile";
import Keyboard from "./Keyboard";
import ResultModal from "./ResultModal";

// const STORAGE_KEY = `wordle-${new Date().toISOString().slice(0, 10)}`;

const ROWS = 6;
const COLS = 5;

const emptyBoard: string[][] = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => "")
);

const emptyStatuses: TileStatus[][] = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => "empty")
);

const emptyFlippedRows: boolean[] = Array.from({ length: ROWS }, () => false);

// 日替わりワード（固定ワードリスト）
// 日替わりワード用・5文字英単語リスト（拡張版）
// ※ すべて小文字・5文字
const WORDS = [
  "about",
  "above",
  "abuse",
  "actor",
  "acute",
  "admit",
  "adopt",
  "adult",
  "after",
  "again",
  "agent",
  "agree",
  "ahead",
  "alarm",
  "album",
  "alert",
  "alike",
  "alive",
  "allow",
  "alone",
  "along",
  "alter",
  "among",
  "anger",
  "angle",
  "angry",
  "apart",
  "apple",
  "apply",
  "arena",
  "argue",
  "arise",
  "array",
  "aside",
  "asset",
  "audio",
  "audit",
  "avoid",
  "award",
  "aware",

  "badly",
  "baker",
  "bases",
  "basic",
  "basis",
  "beach",
  "began",
  "begin",
  "begun",
  "being",
  "below",
  "bench",
  "billy",
  "birth",
  "black",
  "blame",
  "blind",
  "block",
  "blood",
  "board",
  "boost",
  "booth",
  "bound",
  "brain",
  "brand",
  "bread",
  "break",
  "breed",
  "brief",
  "bring",
  "broad",
  "brown",
  "build",
  "buyer",
  "cable",
  "calif",
  "carry",
  "catch",
  "cause",
  "chain",

  "chair",
  "chart",
  "chase",
  "cheap",
  "check",
  "chest",
  "chief",
  "child",
  "china",
  "chose",
  "civil",
  "claim",
  "class",
  "clean",
  "clear",
  "click",
  "clock",
  "close",
  "coach",
  "coast",
  "could",
  "count",
  "court",
  "cover",
  "craft",
  "crash",
  "cream",
  "crime",
  "cross",
  "crowd",

  "daily",
  "dance",
  "dated",
  "dealt",
  "death",
  "debut",
  "delay",
  "depth",
  "doing",
  "doubt",
  "dozen",
  "draft",
  "drama",
  "drawn",
  "dream",
  "dress",
  "drill",
  "drink",
  "drive",
  "drove",

  "eager",
  "early",
  "earth",
  "eight",
  "elite",
  "empty",
  "enemy",
  "enjoy",
  "enter",
  "equal",
  "error",
  "event",
  "every",
  "exact",
  "exist",
  "extra",

  "faith",
  "false",
  "fault",
  "fiber",
  "field",
  "fifth",
  "fifty",
  "fight",
  "final",
  "first",
  "fixed",
  "flash",
  "fleet",
  "floor",
  "fluid",
  "focus",
  "force",
  "forth",
  "forty",
  "forum",
  "found",
  "frame",
  "fresh",
  "front",
  "fruit",
  "fully",
  "funny",

  "giant",
  "given",
  "glass",
  "globe",
  "going",
  "grace",
  "grade",
  "grand",
  "grant",
  "grass",
  "great",
  "green",
  "gross",
  "group",
  "grown",
  "guard",
  "guess",
  "guest",
  "guide",

  "happy",
  "harry",
  "heart",
  "heavy",
  "hence",
  "hotel",
  "house",
  "human",
  "ideal",
  "image",
  "index",
  "inner",
  "input",
  "issue",

  "japan",
  "joint",
  "judge",
  "known",
  "label",
  "large",
  "laser",
  "later",
  "laugh",
  "layer",
  "learn",
  "lease",
  "least",
  "leave",
  "legal",
  "level",
  "light",
  "limit",
  "local",
  "logic",
  "loose",
  "lower",
  "lucky",
  "lunch",

  "major",
  "maker",
  "march",
  "match",
  "maybe",
  "media",
  "metal",
  "might",
  "minor",
  "model",
  "money",
  "month",
  "moral",
  "motor",
  "mount",
  "mouse",
  "mouth",
  "movie",
  "music",

  "never",
  "newly",
  "night",
  "noise",
  "north",
  "novel",
  "nurse",

  "occur",
  "ocean",
  "offer",
  "often",
  "order",
  "other",
  "ought",
  "paint",
  "panel",
  "paper",
  "party",
  "peace",
  "phase",
  "phone",
  "photo",
  "piece",
  "pilot",
  "pitch",
  "place",
  "plain",
  "plane",
  "plant",
  "plate",
  "point",
  "pound",
  "power",
  "press",
  "price",
  "pride",
  "prime",
  "print",
  "prior",
  "prize",
  "proof",
  "proud",
  "prove",

  "queen",
  "quick",
  "quiet",
  "quite",
  "radio",
  "raise",
  "range",
  "rapid",
  "ratio",
  "reach",
  "react",
  "ready",
  "refer",
  "right",
  "rival",
  "river",
  "robot",
  "rough",
  "round",
  "route",

  "scale",
  "scene",
  "scope",
  "score",
  "sense",
  "serve",
  "seven",
  "shall",
  "shape",
  "share",
  "sharp",
  "sheet",
  "shelf",
  "shell",
  "shift",
  "shirt",
  "shock",
  "shoot",
  "short",
  "shown",
  "sight",
  "since",
  "skill",
  "sleep",
  "small",
  "smart",
  "smile",
  "smoke",
  "solid",
  "solve",
  "sorry",
  "sound",
  "south",
  "space",
  "spare",
  "speak",
  "speed",
  "spend",
  "spent",
  "split",
  "sport",
  "staff",
  "stage",
  "stand",
  "start",
  "state",
  "steam",
  "steel",
  "stick",
  "still",
  "stock",
  "stone",
  "stood",
  "store",
  "storm",
  "story",
  "strip",
  "stuck",
  "study",
  "stuff",
  "style",
  "sugar",
  "suite",
  "super",
  "sweet",
  "table",
  "taken",
  "taste",
  "teach",
  "teeth",
  "thank",
  "their",
  "theme",
  "there",
  "these",
  "thick",
  "thing",
  "think",
  "third",
  "those",
  "three",
  "throw",
  "tight",
  "times",
  "tired",
  "title",
  "today",
  "topic",
  "total",
  "touch",
  "tough",
  "tower",
  "track",
  "trade",
  "train",
  "treat",
  "trend",
  "trial",
  "tried",
  "trust",
  "truth",
  "twice",
  "under",
  "union",
  "unity",
  "until",
  "upper",
  "upset",
  "urban",
  "usage",

  "valid",
  "value",
  "video",
  "virus",
  "visit",
  "vital",
  "voice",

  "waste",
  "watch",
  "water",
  "wheel",
  "where",
  "which",
  "while",
  "white",
  "whole",
  "whose",
  "woman",
  "women",
  "world",
  "worry",
  "worth",
  "would",
  "write",
  "wrong",

  "yield",
  "young",
  "youth",
];

function getDailyWord() {
  const start = new Date("2024-01-01");
  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return WORDS[diffDays % WORDS.length];
}

//const ANSWER = getDailyWord();

type TileStatus = "empty" | "correct" | "present" | "absent";
type KeyStatus = "unused" | "correct" | "present" | "absent";

type SavedState = {
  board: string[][];
  statuses: TileStatus[][];
  currentRow: number;
  currentCol: number;
  flippedRows: boolean[];
  keyStatuses: Record<string, KeyStatus>;
  gameState: "playing" | "won" | "lost";
};

export default function Board() {
  //const [board, setBoard] = useState<string[][]>(
  //  Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  //);
  //const [statuses, setStatuses] = useState<TileStatus[][]>(
  //  Array.from({ length: ROWS }, () => Array(COLS).fill("empty"))
  //);
  //const [flippedRows, setFlippedRows] = useState<boolean[]>(
  //  Array(ROWS).fill(false)
  //);
  //const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({});
  //const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
  //  "playing"
  //);

  const [answer, setAnswer] = useState<string | null>(null);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setStorageKey(`wordle-${today}`);
    setAnswer(getDailyWord());
  }, []);

  const loadSavedState = useCallback((): SavedState | null => {
    if (typeof window === "undefined") return null;
    if (!storageKey) return null;

    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }, [storageKey]);

  const saved = loadSavedState();

  const [board, setBoard] = useState(() => saved?.board ?? emptyBoard);
  const [statuses, setStatuses] = useState(
    () => saved?.statuses ?? emptyStatuses
  );
  const [flippedRows, setFlippedRows] = useState(
    () => saved?.flippedRows ?? emptyFlippedRows
  );
  const [keyStatuses, setKeyStatuses] = useState(
    () => saved?.keyStatuses ?? {}
  );
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    () => saved?.gameState ?? "playing"
  );

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  function evaluateGuess(guess: string[], answer: string): TileStatus[] {
    const result: TileStatus[] = Array(COLS).fill("absent");
    const answerChars = answer.split("");
    const used = Array(COLS).fill(false);

    // correct
    guess.forEach((char, i) => {
      if (char === answerChars[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    });

    // present
    guess.forEach((char, i) => {
      if (result[i] === "correct") return;
      const index = answerChars.findIndex((c, j) => c === char && !used[j]);
      if (index !== -1) {
        result[i] = "present";
        used[index] = true;
      }
    });

    return result;
  }

  const handleKey = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;

      if (key === "enter") {
        if (currentCol !== COLS) return;

        const guess = board[currentRow];
        // const result = evaluateGuess(guess, ANSWER);
        if (!answer) return;
        const result = evaluateGuess(guess, answer);

        const nextStatuses = statuses.map((row) => [...row]);
        nextStatuses[currentRow] = result;
        setStatuses(nextStatuses);

        const nextFlipped = [...flippedRows];
        nextFlipped[currentRow] = true;
        setFlippedRows(nextFlipped);

        const nextKeyStatuses = { ...keyStatuses };
        const priority = {
          correct: 3,
          present: 2,
          absent: 1,
          unused: 0,
        } as const;

        result.forEach((status, i) => {
          if (status === "empty") return; // ★ 追加

          const letter = guess[i];
          const prev = nextKeyStatuses[letter] ?? "unused";
          if (priority[status] > priority[prev]) {
            nextKeyStatuses[letter] = status;
          }
        });

        setKeyStatuses(nextKeyStatuses);

        if (result.every((s) => s === "correct")) {
          setGameState("won");
          return;
        }

        if (currentRow === ROWS - 1) {
          setGameState("lost");
          return;
        }

        if (currentRow < ROWS - 1) {
          setCurrentRow(currentRow + 1);
          setCurrentCol(0);
        }
        return;
      }

      if (key === "backspace") {
        if (currentCol === 0) return;
        const nextBoard = board.map((row) => [...row]);
        nextBoard[currentRow][currentCol - 1] = "";
        setBoard(nextBoard);
        setCurrentCol(currentCol - 1);
        return;
      }

      if (/^[a-z]$/.test(key)) {
        if (currentCol >= COLS) return;
        const nextBoard = board.map((row) => [...row]);
        nextBoard[currentRow][currentCol] = key;
        setBoard(nextBoard);
        setCurrentCol(currentCol + 1);
      }
    },
    [
      gameState,
      board,
      statuses,
      currentRow,
      currentCol,
      flippedRows,
      keyStatuses,
    ]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") handleKey("enter");
      else if (e.key === "Backspace") handleKey("backspace");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  //useEffect(() => {
  //  const saved = localStorage.getItem(STORAGE_KEY);
  //  if (!saved) return;
  //
  //  //const data = JSON.parse(saved);
  //  //setBoard(data.board);
  //  //setStatuses(data.statuses);
  //  //setCurrentRow(data.currentRow);
  //  //setCurrentCol(data.currentCol);
  //  //setFlippedRows(data.flippedRows);
  //  //setKeyStatuses(data.keyStatuses);
  //  //setGameState(data.gameState);
  //  restoreState(JSON.parse(saved));
  //}, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (gameState === "playing") return;

    if (!storageKey) return;
    localStorage.setItem(
			storageKey,
      JSON.stringify({
        board,
        statuses,
        currentRow,
        currentCol,
        flippedRows,
        keyStatuses,
        gameState,
      })
    );
  }, [
    board,
    statuses,
    currentRow,
    currentCol,
    flippedRows,
    keyStatuses,
    gameState,
		storageKey
  ]);
  // }, [gameState]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-rows-6 gap-2">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((letter, colIndex) => (
              <Tile
                key={colIndex}
                letter={letter}
                status={statuses[rowIndex][colIndex]}
                flip={flippedRows[rowIndex]}
                delayMs={colIndex * 120}
              />
            ))}
          </div>
        ))}
      </div>

      <Keyboard onKeyPress={handleKey} keyStatuses={keyStatuses} />

      {gameState !== "playing" && answer && (
        <ResultModal state={gameState} answer={answer} onClose={() => {}} />
      )}
    </div>
  );
}
