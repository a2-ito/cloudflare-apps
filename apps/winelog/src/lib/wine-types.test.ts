import { describe, expect, it } from "vitest";
import { isWineType, WINE_TYPE_OPTIONS, WINE_TYPES, wineTypeEmoji, wineTypeLabel } from "./wine-types";

describe("ワインの種別", () => {
	it("選択肢と取りうる値が 1 対 1 で対応する（増やすときの取りこぼしを防ぐ）", () => {
		expect(WINE_TYPE_OPTIONS.map((t) => t.value)).toEqual([...WINE_TYPES]);
	});

	it("既知の値だけを通す", () => {
		expect(isWineType("red")).toBe(true);
		expect(isWineType("RED")).toBe(false);
		expect(isWineType("beer")).toBe(false);
	});

	it("未知の値でも画面を壊さない", () => {
		expect(wineTypeLabel("sparkling")).toBe("スパークリング");
		expect(wineTypeLabel("beer")).toBe("beer");
		expect(wineTypeEmoji("beer")).toBe("🍷");
	});
});
