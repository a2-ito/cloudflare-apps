import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { RATING_AXES, ratingFieldName } from "@/lib/ratings";
import { WINE_TYPES } from "@/lib/wine-types";

/**
 * フォームは DOM を動かすテストを持てない（テストは node 環境で走る）ので、
 * サーバ側の受け口とずれると黙って値が落ちる箇所だけをソースで守る。
 */
const source = readFileSync(join(process.cwd(), "src/components/wine-form.tsx"), "utf8");
const action = readFileSync(join(process.cwd(), "src/app/actions/wines.ts"), "utf8");

describe("ワインのフォーム", () => {
	it("サーバ側が受け取る項目をすべて送る", () => {
		for (const name of ["name", "producer", "vintage", "type", "grapes", "country", "region", "price", "priceCurrency", "shop", "shopUrl", "drunkAt", "note"]) {
			expect(source, `${name} の入力欄がありません`).toContain(`name="${name}"`);
		}
	});

	it("評価はすべての軸を出す（軸を足したときの付け忘れを防ぐ）", () => {
		// 軸は一覧から組み立てているので、その組み立てが残っていることを見る
		expect(source).toContain("RATING_AXES.map");
		expect(source).toContain("ratingFieldName(axis.key)");
		for (const axis of RATING_AXES) {
			expect(action, `${axis.key} をアクションが受け取っていません`).toContain(`${ratingFieldName(axis.key)}:`);
		}
	});

	it("種別は 1 か所の定義から作る", () => {
		expect(source).toContain("WINE_TYPE_OPTIONS.map");
		expect(WINE_TYPES.length).toBeGreaterThan(1);
	});

	it("編集のときは id を隠し項目で送る（新しい行を作らない）", () => {
		expect(source).toMatch(/name="id" value=\{wine\.id\}/);
	});

	it("写真は縮小してから送る入力欄を使う", () => {
		expect(source).toContain("<PhotoInput name=\"photos\" />");
	});
});
