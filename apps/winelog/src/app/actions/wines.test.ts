import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getWine, listWines, upsertUser } from "@/db/queries";
import { expectRedirect, revalidated } from "@/test/action-mocks";
import { createTestEnv, fakeImage, formData, type TestEnv } from "@/test/d1";

let t: TestEnv;
vi.mock("@/lib/auth", async () => ({ requireUser: async () => (await import("@/test/action-mocks")).fakeUser }));
vi.mock("@/lib/cloudflare", () => ({ getEnv: () => Promise.resolve(t.env) }));
vi.mock("next/cache", async () => {
	const { revalidated } = await import("@/test/action-mocks");
	return { revalidatePath: (p: string) => void revalidated.push(p) };
});
vi.mock("next/navigation", async () => {
	const { RedirectSignal } = await import("@/test/action-mocks");
	return {
		redirect: (to: string) => {
			throw new RedirectSignal(to);
		},
	};
});
const { deletePhotoAction, deleteWineAction, saveWine, setCoverPhotoAction } = await import("./wines");

beforeAll(async () => {
	t = await createTestEnv();
});
afterAll(() => t.dispose());
beforeEach(async () => {
	await t.truncate();
	await upsertUser(t.db, { email: "tester@example.com", name: "Tester", image: null });
	revalidated.length = 0;
});

const valid = { name: "シャトー・マルゴー", type: "red" };

describe("saveWine", () => {
	it("記録して詳細ページへ遷移する", async () => {
		const to = await expectRedirect(() =>
			saveWine(
				{},
				formData({
					...valid,
					producer: "Château Margaux",
					vintage: "2018",
					grapes: "カベルネ・ソーヴィニヨン, メルロー",
					price: "12000",
					shop: "エノテカ 銀座店",
					drunkAt: "2026-09-20",
					ratingOverall: 5,
					ratingAroma: 4,
					note: "30 分で開く",
				}),
			),
		);
		expect(to).toBe("/wines/1");

		const wine = await getWine(t.db, 1);
		expect(wine).toMatchObject({
			name: "シャトー・マルゴー",
			producer: "Château Margaux",
			vintage: 2018,
			priceMinor: 12000,
			priceCurrency: "JPY",
			drunkAt: "2026-09-20",
			ratingOverall: 5,
			ratingAroma: 4,
			authorId: 1,
		});
		expect(wine?.grapes.map((g) => g.name)).toEqual(["カベルネ・ソーヴィニヨン", "メルロー"]);
		expect(revalidated).toEqual(expect.arrayContaining(["/", "/wines/1"]));
	});

	it("銘柄と種別だけでも保存できる", async () => {
		await expectRedirect(() => saveWine({}, formData(valid)));
		expect(await getWine(t.db, 1)).toMatchObject({ name: "シャトー・マルゴー", drunkAt: null, priceMinor: null });
	});

	it("価格は選んだ通貨の最小単位で保存する", async () => {
		await expectRedirect(() => saveWine({}, formData({ ...valid, price: "12.34", priceCurrency: "eur" })));
		expect(await getWine(t.db, 1)).toMatchObject({ priceMinor: 1234, priceCurrency: "EUR" });
	});

	it("価格が無ければ通貨も残さない（意味の無い値を残さない）", async () => {
		await expectRedirect(() => saveWine({}, formData({ ...valid, priceCurrency: "EUR" })));
		expect(await getWine(t.db, 1)).toMatchObject({ priceMinor: null, priceCurrency: null });
	});

	it("評価の 0 は「未評価」として null で保存する", async () => {
		await expectRedirect(() => saveWine({}, formData({ ...valid, ratingOverall: 0, ratingTaste: 3 })));
		expect(await getWine(t.db, 1)).toMatchObject({ ratingOverall: null, ratingTaste: 3 });
	});

	it("銘柄が空なら保存しない", async () => {
		const state = await saveWine({}, formData({ ...valid, name: "  " }));
		expect(state.error).toBeTruthy();
		expect(await getWine(t.db, 1)).toBeNull();
	});

	it("知らない種別は受け付けない", async () => {
		const state = await saveWine({}, formData({ ...valid, type: "beer" }));
		expect(state.error).toBeTruthy();
		expect(await getWine(t.db, 1)).toBeNull();
	});

	it("将来や大昔の収穫年は打ち間違いとして弾く", async () => {
		const future = String(new Date().getFullYear() + 1);
		expect((await saveWine({}, formData({ ...valid, vintage: future }))).error).toMatch(/収穫年/);
		expect((await saveWine({}, formData({ ...valid, vintage: "1800" }))).error).toMatch(/収穫年/);
		expect(await getWine(t.db, 1)).toBeNull();
	});

	it("https 以外の店の URL は弾く（リンクとして出すため）", async () => {
		const state = await saveWine({}, formData({ ...valid, shopUrl: "javascript:alert(1)" }));
		expect(state.error).toMatch(/https/);
		expect(await getWine(t.db, 1)).toBeNull();
	});

	it("日付として読めない飲んだ日は弾く", async () => {
		const state = await saveWine({}, formData({ ...valid, drunkAt: "2026-02-30" }));
		expect(state.error).toMatch(/飲んだ日/);
	});

	it("既存の記録を更新する（新しい行を作らない）", async () => {
		await expectRedirect(() => saveWine({}, formData({ ...valid, grapes: "メルロー" })));
		await expectRedirect(() => saveWine({}, formData({ ...valid, id: 1, name: "別の銘柄", grapes: "シラー" })));

		expect(await listWines(t.db)).toHaveLength(1);
		const wine = await getWine(t.db, 1);
		expect(wine?.name).toBe("別の銘柄");
		expect(wine?.grapes.map((g) => g.name)).toEqual(["シラー"]);
	});

	it("無い記録の更新は保存しない", async () => {
		const state = await saveWine({}, formData({ ...valid, id: 999 }));
		expect(state.error).toMatch(/見つかりません/);
	});

	it("写真を R2 に置き、キーを DB に残す", async () => {
		const fd = formData(valid);
		fd.append("photos", fakeImage());
		await expectRedirect(() => saveWine({}, fd));

		const wine = await getWine(t.db, 1);
		expect(wine?.photos).toHaveLength(1);
		expect(wine?.photos[0].key).toMatch(/^wines\/1\//);
		expect(await t.bucket.get(wine!.photos[0].key)).not.toBeNull();
	});
});

describe("deleteWineAction", () => {
	it("記録と R2 の写真を消して一覧へ戻る", async () => {
		const fd = formData(valid);
		fd.append("photos", fakeImage());
		await expectRedirect(() => saveWine({}, fd));
		const key = (await getWine(t.db, 1))!.photos[0].key;

		const to = await expectRedirect(() => deleteWineAction(formData({ id: 1 })));
		expect(to).toBe("/");
		expect(await getWine(t.db, 1)).toBeNull();
		// 外部キーの cascade では R2 は消えないので、アクション側で消せているかを見る
		expect(await t.bucket.get(key)).toBeNull();
	});
});

describe("写真の操作", () => {
	async function seedTwoPhotos() {
		const fd = formData(valid);
		fd.append("photos", fakeImage("image/jpeg", 1024, "1.jpg"));
		fd.append("photos", fakeImage("image/jpeg", 1024, "2.jpg"));
		await expectRedirect(() => saveWine({}, fd));
		return (await getWine(t.db, 1))!.photos;
	}

	it("サムネにした写真が先頭へ来る", async () => {
		const photos = await seedTwoPhotos();
		await setCoverPhotoAction(formData({ id: photos[1].id }));
		expect((await getWine(t.db, 1))?.photos[0].id).toBe(photos[1].id);
	});

	it("写真を消すと R2 の実体も消える", async () => {
		const photos = await seedTwoPhotos();
		await deletePhotoAction(formData({ id: photos[0].id }));

		expect((await getWine(t.db, 1))?.photos.map((p) => p.id)).toEqual([photos[1].id]);
		expect(await t.bucket.get(photos[0].key)).toBeNull();
	});
});
