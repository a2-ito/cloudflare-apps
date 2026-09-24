export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";

export type State = {
  /** 先頭が頭 */
  snake: Point[];
  dir: Direction;
  /** 次の手番までに受け付けた方向転換。素早い 2 連続の入力を取りこぼさないよう列にする */
  queue: Direction[];
  food: Point;
  score: number;
  over: boolean;
};

export const GRID = 20;

const DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

/** 蛇と重ならない空きマスに餌を置く */
export function placeFood(
  snake: Point[],
  rand: () => number = Math.random,
): Point {
  const free: Point[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!snake.some((p) => p.x === x && p.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(rand() * free.length)] ?? snake[0];
}

export function initialState(rand: () => number = Math.random): State {
  const mid = Math.floor(GRID / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return {
    snake,
    dir: "right",
    queue: [],
    food: placeFood(snake, rand),
    score: 0,
    over: false,
  };
}

/** 方向転換を受け付ける。真後ろや同じ向きへの入力は捨てる */
export function turn(state: State, dir: Direction): State {
  const last = state.queue.at(-1) ?? state.dir;
  if (dir === last || dir === OPPOSITE[last] || state.queue.length >= 2)
    return state;
  return { ...state, queue: [...state.queue, dir] };
}

/** 1 マス進める。壁か自分の体にぶつかったら終わり */
export function step(state: State, rand: () => number = Math.random): State {
  if (state.over) return state;
  const [dir = state.dir, ...queue] = state.queue;
  const head = state.snake[0];
  const next = { x: head.x + DELTA[dir].x, y: head.y + DELTA[dir].y };

  const eats = same(next, state.food);
  // 餌を食べない手番は尻尾が抜けるので、今の尻尾のマスには進んでよい
  const body = eats ? state.snake : state.snake.slice(0, -1);
  const hitWall = next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID;
  if (hitWall || body.some((p) => same(p, next)))
    return { ...state, dir, queue, over: true };

  const snake = [next, ...body];
  return {
    snake,
    dir,
    queue,
    food: eats ? placeFood(snake, rand) : state.food,
    score: eats ? state.score + 1 : state.score,
    over: false,
  };
}

/** 長くなるほど速くする（1 手の間隔、ミリ秒） */
export function tickMs(score: number): number {
  return Math.max(60, 150 - score * 4);
}
