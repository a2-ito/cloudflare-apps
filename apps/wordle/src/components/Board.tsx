
"use client";

import { useEffect, useState } from "react";
import Tile from "./Tile";

type TileStatus = "empty" | "correct" | "present" | "absent";

const ROWS = 6;
const COLS = 5;
const ANSWER = "react"; // 正解ワード（仮）

function evaluateGuess(guess: string[], answer: string): TileStatus[] {
  const result: TileStatus[] = Array(COLS).fill("absent");
  const answerChars = answer.split("");

  // correct
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = "";
    }
  }

  // present
  for (let i = 0; i < COLS; i++) {
    if (result[i] === "correct") continue;
    const index = answerChars.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = "present";
      answerChars[index] = "";
    }
  }

  return result;
}

export default function Board() {
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );

  const [statuses, setStatuses] = useState<TileStatus[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill("empty"))
  );

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

const [flippedRows, setFlippedRows] = useState<boolean[]>(
  Array(6).fill(false)
);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // A–Z
      if (key.length === 1 && key >= "a" && key <= "z") {
        if (currentCol < COLS && currentRow < ROWS) {
          const next = board.map((r) => [...r]);
          next[currentRow][currentCol] = key;
          setBoard(next);
          setCurrentCol(currentCol + 1);
        }
      }

      // Backspace
      if (key === "backspace") {
        if (currentCol > 0) {
          const next = board.map((r) => [...r]);
          next[currentRow][currentCol - 1] = "";
          setBoard(next);
          setCurrentCol(currentCol - 1);
        }
      }

      // Enter
	if (key === "enter") {
		if (currentCol === COLS) {
			const guess = board[currentRow];
			const result = evaluateGuess(guess, ANSWER);

			const nextStatuses = statuses.map((r) => [...r]);
			nextStatuses[currentRow] = result;
			setStatuses(nextStatuses);

			const nextFlipped = [...flippedRows];
			nextFlipped[currentRow] = true;
			setFlippedRows(nextFlipped);

			if (currentRow < ROWS - 1) {
				setCurrentRow(currentRow + 1);
				setCurrentCol(0);
			}
		}
	}

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, statuses, currentRow, currentCol]);

  return (
    <div className="grid gap-2">
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
  );
}

