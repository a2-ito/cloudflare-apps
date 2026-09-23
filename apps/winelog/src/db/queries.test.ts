import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createTestEnv, type TestEnv } from "@/test/d1";
import {
	addPhotos,
	createWine,
	deletePhoto,
	deleteWine,
	getPhoto,
	getWine,
	listGrapeNames,
	listWinePhotoKeys,
	listWines,
	setCoverPhoto,
	updateWine,
	upsertUser,
	type WineInput,
} from "./queries";

let env: TestEnv;

const seedUser = (suffix = "") =>
	upsertUser(env.db, { email: `taro${suffix}@example.com`, name: `太郎${suffix}`, image: null });

const wineInput = (overrides: Partial<WineInput> = {}): WineInput => ({
	name: "シャトー・マルゴー",
	type: "red",
	grapes: [],
	...overrides,
});

afterAll(async () => env?.dispose());
beforeEach(async () => {
	env ??= await createTestEnv();
	await env.truncate();
});

describe("upsertUser", () => {
	it("初回は作成し、2 回目は同じ行を更新する", async () => {
		const first = await upsertUser(env.db, { email: "Taro@Example.com", name: "太郎", image: null });
		const second = await upsertUser(env.db, { email: "taro@example.com", name: "太郎（改）", image: "img" });
		expect(second.id).toBe(first.id);
		expect(second.name).toBe("太郎（改）");
	});

	it("メールは小文字で保存される", async () => {
		const user = await upsertUser(env.db, { email: " TARO@Example.com ", name: null, image: null });
		expect(user.email).toBe("taro@example.com");
	});
});

describe("wines", () => {
	it("記録した内容をそのまま取り出せる", async () => {
		const user = await seedUser();
		const wine = await createWine(
			env.db,
			wineInput({
				producer: "Château Margaux",
				vintage: 2018,
				country: "フランス",
				region: "ボルドー",
				priceMinor: 120000,
				priceCurrency: "JPY",
				shop: "エノテカ 銀座店",
				shopUrl: "https://www.enoteca.co.jp/item/1",
				drunkAt: "2026-09-20",
				ratingOverall: 5,
				ratingAroma: 5,
				ratingValue: 3,
				note: "30 分で開く",
				grapes: ["カベルネ・ソーヴィニヨン", "メルロー"],
			}),
			user.id,
		);

		const found = await getWine(env.db, wine.id);
		expect(found).toMatchObject({
			name: "シャトー・マルゴー",
			vintage: 2018,
			priceMinor: 120000,
			drunkAt: "2026-09-20",
			ratingOverall: 5,
			ratingValue: 3,
			authorId: user.id,
		});
		// 品種は書いた順に並ぶ（ブレンドの主体が先に来る）
		expect(found?.grapes.map((g) => g.name)).toEqual(["カベルネ・ソーヴィニヨン", "メルロー"]);
		expect(found?.author.email).toBe(user.email);
	});

	it("付けなかった評価は null のまま（0 と区別する）", async () => {
		const user = await seedUser();
		const wine = await createWine(env.db, wineInput({ ratingOverall: 4 }), user.id);
		const found = await getWine(env.db, wine.id);
		expect(found?.ratingOverall).toBe(4);
		expect(found?.ratingAroma).toBeNull();
	});

	it("更新で品種を入れ替えられる", async () => {
		const user = await seedUser();
		const wine = await createWine(env.db, wineInput({ grapes: ["メルロー", "シラー"] }), user.id);
		await updateWine(env.db, wine.id, wineInput({ name: "別の銘柄", grapes: ["ピノ・ノワール"] }));

		const found = await getWine(env.db, wine.id);
		expect(found?.name).toBe("別の銘柄");
		expect(found?.grapes.map((g) => g.name)).toEqual(["ピノ・ノワール"]);
	});

	it("削除すると品種と写真の行も消える", async () => {
		const user = await seedUser();
		const wine = await createWine(env.db, wineInput({ grapes: ["メルロー"] }), user.id);
		await addPhotos(env.db, wine.id, [{ key: "wines/1/a.jpg", contentType: "image/jpeg" }]);

		expect(await listWinePhotoKeys(env.db, wine.id)).toEqual(["wines/1/a.jpg"]);
		await deleteWine(env.db, wine.id);

		expect(await getWine(env.db, wine.id)).toBeNull();
		expect(await listWinePhotoKeys(env.db, wine.id)).toEqual([]);
		expect(await listGrapeNames(env.db)).toEqual([]);
	});
});

describe("listWines", () => {
	async function seedThree() {
		const user = await seedUser();
		await createWine(
			env.db,
			wineInput({ name: "赤A", drunkAt: "2026-01-01", ratingOverall: 5, priceMinor: 3000, grapes: ["メルロー"] }),
			user.id,
		);
		await createWine(
			env.db,
			wineInput({
				name: "白B",
				type: "white",
				drunkAt: "2026-05-01",
				ratingOverall: 3,
				priceMinor: 9000,
				region: "ブルゴーニュ",
				grapes: ["シャルドネ"],
			}),
			user.id,
		);
		// まだ飲んでいない 1 本
		await createWine(env.db, wineInput({ name: "赤C", ratingOverall: 4, shop: "カルディ" }), user.id);
		return user;
	}

	it("既定は飲んだ日の新しい順で、未開栓は末尾に置く", async () => {
		await seedThree();
		expect((await listWines(env.db)).map((w) => w.name)).toEqual(["白B", "赤A", "赤C"]);
	});

	it("評価順・価格順に並べ替えられる（未入力は末尾）", async () => {
		await seedThree();
		expect((await listWines(env.db, {}, "rating")).map((w) => w.name)).toEqual(["赤A", "赤C", "白B"]);
		expect((await listWines(env.db, {}, "price")).map((w) => w.name)).toEqual(["白B", "赤A", "赤C"]);
	});

	it("種別と評価で絞り込める", async () => {
		await seedThree();
		expect((await listWines(env.db, { type: "white" })).map((w) => w.name)).toEqual(["白B"]);
		expect((await listWines(env.db, { minRating: 4 })).map((w) => w.name)).toEqual(["赤A", "赤C"]);
	});

	it("品種で絞り込める（大文字小文字は区別しない）", async () => {
		const user = await seedUser();
		await createWine(env.db, wineInput({ name: "A", grapes: ["Merlot"] }), user.id);
		await createWine(env.db, wineInput({ name: "B", grapes: ["シャルドネ"] }), user.id);
		expect((await listWines(env.db, { grape: "merlot" })).map((w) => w.name)).toEqual(["A"]);
	});

	it("検索は銘柄・生産者・産地・購入場所・品種のどれに当たっても拾う", async () => {
		await seedThree();
		expect((await listWines(env.db, { q: "ブルゴーニュ" })).map((w) => w.name)).toEqual(["白B"]);
		expect((await listWines(env.db, { q: "カルディ" })).map((w) => w.name)).toEqual(["赤C"]);
		expect((await listWines(env.db, { q: "メルロー" })).map((w) => w.name)).toEqual(["赤A"]);
		expect(await listWines(env.db, { q: "存在しない" })).toEqual([]);
	});

	it("絞り込みは重ねられる", async () => {
		await seedThree();
		expect((await listWines(env.db, { type: "red", minRating: 5 })).map((w) => w.name)).toEqual(["赤A"]);
	});
});

describe("listGrapeNames", () => {
	it("記録の多い品種から並べる（絞り込みの選択肢に使う）", async () => {
		const user = await seedUser();
		await createWine(env.db, wineInput({ name: "A", grapes: ["メルロー", "シラー"] }), user.id);
		await createWine(env.db, wineInput({ name: "B", grapes: ["メルロー"] }), user.id);
		expect(await listGrapeNames(env.db)).toEqual(["メルロー", "シラー"]);
	});
});

describe("photos", () => {
	async function seedWithPhotos() {
		const user = await seedUser();
		const wine = await createWine(env.db, wineInput(), user.id);
		await addPhotos(env.db, wine.id, [
			{ key: "wines/1/1.jpg", contentType: "image/jpeg" },
			{ key: "wines/1/2.jpg", contentType: "image/jpeg" },
		]);
		return wine;
	}

	it("あとから足した写真は末尾に付く", async () => {
		const wine = await seedWithPhotos();
		await addPhotos(env.db, wine.id, [{ key: "wines/1/3.jpg", contentType: "image/jpeg" }]);
		const found = await getWine(env.db, wine.id);
		expect(found?.photos.map((p) => p.key)).toEqual(["wines/1/1.jpg", "wines/1/2.jpg", "wines/1/3.jpg"]);
	});

	it("サムネにした写真が先頭へ来る", async () => {
		const wine = await seedWithPhotos();
		const second = (await getWine(env.db, wine.id))!.photos[1];
		await setCoverPhoto(env.db, second.id);

		const found = await getWine(env.db, wine.id);
		expect(found?.photos.map((p) => p.key)).toEqual(["wines/1/2.jpg", "wines/1/1.jpg"]);
		// 並び順は 0 から振り直す（削除を繰り返しても値が離れていかない）
		expect(found?.photos.map((p) => p.sortOrder)).toEqual([0, 1]);
	});

	it("写真を消しても残りは並んだまま", async () => {
		const wine = await seedWithPhotos();
		const first = (await getWine(env.db, wine.id))!.photos[0];
		await deletePhoto(env.db, first.id);

		expect(await getPhoto(env.db, first.id)).toBeNull();
		expect((await getWine(env.db, wine.id))?.photos.map((p) => p.key)).toEqual(["wines/1/2.jpg"]);
	});
});
