const STORAGE_KEY = "number-logic-highscore";

type Difficulty = "easy" | "normal" | "hard";

type HighScores = {
  easy?: number;
  normal?: number;
  hard?: number;
};

export function getHighScores(): HighScores {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateHighScore(
  difficulty: Difficulty,
  score: number,
): boolean {
  const scores = getHighScores();
  const prev = scores[difficulty];

  // 初回 or 記録更新時のみ保存
  if (prev === undefined || score < prev) {
    scores[difficulty] = score;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    return true; // 更新された
  }

  return false;
}
