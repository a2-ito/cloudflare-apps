// 全ゲームで同じオリジンを共有するため、キーには必ずゲーム名を付ける（README 参照）。
// プライベートブラウズなどで localStorage が使えないときは記録を残さないだけにする。

export function loadNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveNumber(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // 保存できなくても遊ぶのには困らない
  }
}
