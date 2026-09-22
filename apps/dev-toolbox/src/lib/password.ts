export type PasswordOptions = {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*()-_=+[]{};:,.<>?/";

export function generatePassword(options: PasswordOptions): string {
  const pools = [
    options.lowercase && LOWER,
    options.uppercase && UPPER,
    options.numbers && NUM,
    options.symbols && SYM,
  ].filter(Boolean) as string[];

  if (pools.length === 0) return "";

  const chars = pools.join("");
  const bytes = crypto.getRandomValues(new Uint32Array(options.length));

  return Array.from(bytes)
    .map((n) => chars[n % chars.length])
    .join("");
}
