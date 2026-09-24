export type Cell = {
  mine: boolean;
  open: boolean;
  flag: boolean;
  /** 周囲 8 マスにある地雷の数 */
  adjacent: number;
};
export type Board = Cell[][];

export const LEVELS = {
  easy: { label: "初級", rows: 9, cols: 9, mines: 10 },
  normal: { label: "中級", rows: 16, cols: 16, mines: 40 },
} as const;
export type LevelKey = keyof typeof LEVELS;

export function createBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      open: false,
      flag: false,
      adjacent: 0,
    })),
  );
}

function neighbors(board: Board, r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < board.length && nc < board[0].length)
        out.push([nr, nc]);
    }
  }
  return out;
}

/**
 * 地雷を置く。最初に開いたマスとその周りには置かないので、
 * 1 手目で負けることはなく、必ずいくらか広く開く。
 */
export function placeMines(
  board: Board,
  mines: number,
  safeR: number,
  safeC: number,
  rand: () => number = Math.random,
): Board {
  const safe = new Set(
    [[safeR, safeC], ...neighbors(board, safeR, safeC)].map(
      ([r, c]) => `${r},${c}`,
    ),
  );
  const candidates: [number, number][] = [];
  board.forEach((row, r) =>
    row.forEach((_, c) => !safe.has(`${r},${c}`) && candidates.push([r, c])),
  );

  // Fisher–Yates で先頭 mines 個を選ぶ
  for (let i = 0; i < Math.min(mines, candidates.length); i++) {
    const j = i + Math.floor(rand() * (candidates.length - i));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  for (const [r, c] of candidates.slice(0, mines)) next[r][c].mine = true;
  next.forEach((row, r) =>
    row.forEach((cell, c) => {
      cell.adjacent = neighbors(next, r, c).filter(
        ([nr, nc]) => next[nr][nc].mine,
      ).length;
    }),
  );
  return next;
}

/** マスを開く。周りに地雷が無いマスは、つながった範囲をまとめて開く */
export function reveal(
  board: Board,
  r: number,
  c: number,
): { board: Board; hitMine: boolean } {
  const target = board[r][c];
  if (target.open || target.flag) return { board, hitMine: false };

  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  if (target.mine) {
    next[r][c].open = true;
    return { board: next, hitMine: true };
  }

  const stack: [number, number][] = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr][cc];
    if (cell.open || cell.flag) continue;
    cell.open = true;
    if (cell.adjacent === 0) stack.push(...neighbors(next, cr, cc));
  }
  return { board: next, hitMine: false };
}

/**
 * 開いた数字マスで、周りの旗の数が数字と同じなら残りの周りをまとめて開く。
 * 旗を間違えていれば地雷を踏む。
 */
export function chord(
  board: Board,
  r: number,
  c: number,
): { board: Board; hitMine: boolean } {
  const cell = board[r][c];
  if (!cell.open || cell.adjacent === 0) return { board, hitMine: false };
  const around = neighbors(board, r, c);
  const flags = around.filter(([nr, nc]) => board[nr][nc].flag).length;
  if (flags !== cell.adjacent) return { board, hitMine: false };

  let next = board;
  let hitMine = false;
  for (const [nr, nc] of around) {
    const result = reveal(next, nr, nc);
    next = result.board;
    hitMine ||= result.hitMine;
  }
  return { board: next, hitMine };
}

export function toggleFlag(board: Board, r: number, c: number): Board {
  if (board[r][c].open) return board;
  const next = board.map((row) => [...row]);
  next[r][c] = { ...board[r][c], flag: !board[r][c].flag };
  return next;
}

/** 地雷でないマスをすべて開いたら勝ち */
export function isCleared(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell.mine || cell.open));
}

export function countFlags(board: Board): number {
  return board.reduce(
    (n, row) => n + row.filter((cell) => cell.flag).length,
    0,
  );
}

/** 負けたときに地雷の場所をすべて見せる */
export function revealMines(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell.mine ? { ...cell, open: true } : cell)),
  );
}
