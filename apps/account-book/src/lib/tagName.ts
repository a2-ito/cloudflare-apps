export const TAG_NAME_MAX_LENGTH = 50;

export type TagNameValidation =
  | { ok: true; value: string }
  | { ok: false; error: "tag-name-empty" | "tag-name-too-long" };

/**
 * タグ名を前後の空白を除いたうえで検証する。
 * 「202809_イタリア」のような自由入力を想定し、文字種は制限しない。
 */
export const normalizeTagName = (input: unknown): TagNameValidation => {
  const value = typeof input === "string" ? input.trim() : "";

  if (value.length === 0) {
    return { ok: false, error: "tag-name-empty" };
  }

  if (value.length > TAG_NAME_MAX_LENGTH) {
    return { ok: false, error: "tag-name-too-long" };
  }

  return { ok: true, value };
};

/**
 * SQLite の UNIQUE 制約違反かどうかを判定する。
 * drizzle は D1 のエラーを "Failed query: ..." で包むため cause も辿る。
 */
export const isUniqueConstraintError = (err: unknown): boolean => {
  let current: unknown = err;

  for (let depth = 0; depth < 5; depth += 1) {
    if (!(current instanceof Error)) return false;
    if (/UNIQUE constraint failed/i.test(current.message)) return true;
    current = current.cause;
  }

  return false;
};
