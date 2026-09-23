import { describe, expect, it } from "vitest";
import { formatGrapes, MAX_GRAPES, parseGrapes } from "./grapes";

describe("parseGrapes", () => {
	it("カンマ区切りを書いた順に分解する", () => {
		expect(parseGrapes("カベルネ・ソーヴィニヨン, メルロー")).toEqual(["カベルネ・ソーヴィニヨン", "メルロー"]);
	});

	it("日本語の読点でも区切れる", () => {
		expect(parseGrapes("甲州、マスカット・ベーリーA")).toEqual(["甲州", "マスカット・ベーリーA"]);
	});

	it("同じ品種は 1 つにまとめる（DB の一意制約に当てない）", () => {
		expect(parseGrapes("メルロー, メルロー")).toEqual(["メルロー"]);
	});

	it("空の要素は落とす", () => {
		expect(parseGrapes(" , メルロー , ")).toEqual(["メルロー"]);
		expect(parseGrapes("")).toEqual([]);
		expect(parseGrapes(undefined)).toEqual([]);
	});

	it("上限を超えた分は切る", () => {
		const many = Array.from({ length: MAX_GRAPES + 5 }, (_, i) => `品種${i}`).join(",");
		expect(parseGrapes(many)).toHaveLength(MAX_GRAPES);
	});

	it("長すぎる名前は落とす（貼り付け事故の取り込みを防ぐ）", () => {
		expect(parseGrapes(`メルロー, ${"あ".repeat(51)}`)).toEqual(["メルロー"]);
	});
});

describe("formatGrapes", () => {
	it("入力欄に戻せる形にする", () => {
		expect(formatGrapes(["メルロー", "シラー"])).toBe("メルロー, シラー");
		expect(parseGrapes(formatGrapes(["メルロー", "シラー"]))).toEqual(["メルロー", "シラー"]);
	});
});
