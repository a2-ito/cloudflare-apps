/**
 * ワインの種別。DB には value を入れる。
 * 増やすときはここだけを直す（フォームの選択肢も絞り込みもここから作る）。
 */

export const WINE_TYPES = ["red", "white", "rose", "sparkling", "orange", "fortified", "dessert", "other"] as const;

export type WineType = (typeof WINE_TYPES)[number];

export const WINE_TYPE_OPTIONS: readonly { value: WineType; label: string; emoji: string }[] = [
	{ value: "red", label: "赤", emoji: "🍷" },
	{ value: "white", label: "白", emoji: "🥂" },
	{ value: "rose", label: "ロゼ", emoji: "🌹" },
	{ value: "sparkling", label: "スパークリング", emoji: "🍾" },
	{ value: "orange", label: "オレンジ", emoji: "🍊" },
	{ value: "fortified", label: "酒精強化", emoji: "🥃" },
	{ value: "dessert", label: "デザート", emoji: "🍮" },
	{ value: "other", label: "その他", emoji: "🍶" },
];

export function isWineType(value: string): value is WineType {
	return (WINE_TYPES as readonly string[]).includes(value);
}

/** 未知の値でも画面を壊さないよう、そのまま返す */
export function wineTypeLabel(value: string): string {
	return WINE_TYPE_OPTIONS.find((t) => t.value === value)?.label ?? value;
}

export function wineTypeEmoji(value: string): string {
	return WINE_TYPE_OPTIONS.find((t) => t.value === value)?.emoji ?? "🍷";
}
