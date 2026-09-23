"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import {
	addPhotos,
	createWine,
	deletePhoto,
	deleteWine,
	getPhoto,
	getWine,
	listWinePhotoKeys,
	setCoverPhoto,
	updateWine,
	type WineInput,
} from "@/db/queries";
import { requireUser } from "@/lib/auth";
import { parseGrapes } from "@/lib/grapes";
import { MIN_VINTAGE, maxVintage, toDate } from "@/lib/datetime";
import { type ActionState, idFromForm, optionalIdFromForm, optionalText, parseForm } from "@/lib/form";
import { DEFAULT_CURRENCY, normalizeCurrency, parseAmountToMinor } from "@/lib/money";
import { deletePhotos, storePhotos } from "@/lib/photos";
import { MAX_RATING, toRatingValue } from "@/lib/ratings";
import { normalizeShopUrl, SHOP_URL_EXAMPLE } from "@/lib/shop-url";
import { WINE_TYPES } from "@/lib/wine-types";

/** 0 は「未評価」。フォームの select がその値を送ってくる */
const ratingFromForm = z.coerce.number().int().min(0).max(MAX_RATING).default(0);

const wineSchema = z.object({
	id: optionalIdFromForm,
	name: z.string().trim().min(1, "銘柄を入力してください").max(200, "銘柄が長すぎます"),
	producer: optionalText(200),
	/** 空欄は「不明・ノンヴィンテージ」。範囲は後段で見る */
	vintage: optionalText(4),
	type: z.enum(WINE_TYPES),
	country: optionalText(100),
	region: optionalText(100),
	/** 品種はカンマ区切りで受ける。1 本に何種類も入るため */
	grapes: optionalText(500),
	/** 通貨ごとの桁数が要るので、ここでは文字列のまま受けて後段で最小単位に直す */
	price: optionalText(30),
	priceCurrency: z
		.string()
		.trim()
		.regex(/^[A-Za-z]{3}$/, "通貨コードは 3 文字で入力してください")
		.default(DEFAULT_CURRENCY),
	shop: optionalText(200),
	shopUrl: optionalText(2000),
	/** 空欄は「まだ飲んでいない」 */
	drunkAt: optionalText(10),
	ratingOverall: ratingFromForm,
	ratingAroma: ratingFromForm,
	ratingTaste: ratingFromForm,
	ratingFinish: ratingFromForm,
	ratingValue: ratingFromForm,
	note: optionalText(2000),
});

export async function saveWine(_prev: ActionState, formData: FormData): Promise<ActionState> {
	const user = await requireUser();
	const parsed = parseForm(wineSchema, formData);
	if (!parsed.ok) return { error: parsed.error };
	const { id, vintage, grapes, price, priceCurrency, shopUrl, drunkAt, ...rest } = parsed.data;

	let vintageYear: number | undefined;
	if (vintage !== undefined) {
		const year = Number(vintage);
		if (!Number.isInteger(year) || year < MIN_VINTAGE || year > maxVintage()) {
			return { error: `収穫年は ${MIN_VINTAGE} 〜 ${maxVintage()} で入力してください` };
		}
		vintageYear = year;
	}

	// リンクとして出すので、https の URL 以外は入れさせない
	let normalizedShopUrl: string | undefined;
	if (shopUrl !== undefined) {
		const normalized = normalizeShopUrl(shopUrl);
		if (!normalized) return { error: `店の URL は https で入力してください（例: ${SHOP_URL_EXAMPLE}）` };
		normalizedShopUrl = normalized;
	}

	const currency = normalizeCurrency(priceCurrency);
	let priceMinor: number | undefined;
	if (price !== undefined) {
		const minor = parseAmountToMinor(price, currency);
		if (minor === null) return { error: "価格は 0 以上の数値で入力してください" };
		priceMinor = minor;
	}

	let drunkOn: string | undefined;
	if (drunkAt !== undefined) {
		const date = toDate(drunkAt);
		if (!date) return { error: "飲んだ日の形式が不正です" };
		drunkOn = date;
	}

	const input: WineInput = {
		...rest,
		vintage: vintageYear,
		grapes: parseGrapes(grapes),
		priceMinor,
		// 価格が無いのに通貨だけ残ると、あとから見て意味の無い値になる
		priceCurrency: priceMinor === undefined ? undefined : currency,
		shopUrl: normalizedShopUrl,
		drunkAt: drunkOn,
		ratingOverall: toRatingValue(rest.ratingOverall) ?? undefined,
		ratingAroma: toRatingValue(rest.ratingAroma) ?? undefined,
		ratingTaste: toRatingValue(rest.ratingTaste) ?? undefined,
		ratingFinish: toRatingValue(rest.ratingFinish) ?? undefined,
		ratingValue: toRatingValue(rest.ratingValue) ?? undefined,
	};

	// FormData から直接取るのは、複数ファイルが Zod のスキーマに乗らないため
	const files = formData.getAll("photos").filter((f): f is File => f instanceof File);

	const db = await getDb();
	let wineId = id;
	try {
		if (wineId) {
			const existing = await getWine(db, wineId);
			if (!existing) return { error: "ワインが見つかりません" };
			await updateWine(db, wineId, input);
		} else {
			const created = await createWine(db, input, user.id);
			wineId = created.id;
		}
		const stored = await storePhotos(files, wineId);
		if (stored.length > 0) await addPhotos(db, wineId, stored);
	} catch (e) {
		return { error: e instanceof Error ? e.message : "保存に失敗しました" };
	}

	revalidatePath("/");
	revalidatePath(`/wines/${wineId}`);
	redirect(`/wines/${wineId}`);
}

export async function deleteWineAction(formData: FormData): Promise<void> {
	await requireUser();
	const id = idFromForm.safeParse(formData.get("id"));
	if (!id.success) throw new Error("ID が不正です");

	const db = await getDb();
	const keys = await listWinePhotoKeys(db, id.data);
	await deleteWine(db, id.data);
	// 外部キーの cascade では R2 の実体は消えないので、ここでまとめて消す
	await deletePhotos(keys);

	revalidatePath("/");
	redirect("/");
}

/** 一覧に出すサムネイルを、この写真に差し替える */
export async function setCoverPhotoAction(formData: FormData): Promise<void> {
	await requireUser();
	const id = idFromForm.safeParse(formData.get("id"));
	if (!id.success) throw new Error("写真 ID が不正です");

	const db = await getDb();
	const photo = await getPhoto(db, id.data);
	if (!photo) return;
	await setCoverPhoto(db, photo.id);

	revalidatePath("/");
	revalidatePath(`/wines/${photo.wineId}`);
}

export async function deletePhotoAction(formData: FormData): Promise<void> {
	await requireUser();
	const id = idFromForm.safeParse(formData.get("id"));
	if (!id.success) throw new Error("写真 ID が不正です");

	const db = await getDb();
	const photo = await getPhoto(db, id.data);
	if (!photo) return;
	await deletePhoto(db, photo.id);
	await deletePhotos([photo.key]);

	revalidatePath("/");
	revalidatePath(`/wines/${photo.wineId}`);
}
