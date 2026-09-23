import { and, asc, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import type { Db } from "./index";
import { users, wineGrapes, winePhotos, wines } from "./schema";
import type { User, Wine, WineGrape, WinePhoto } from "./schema";

/* ── users ─────────────────────────────────────────────────── */

/** ログインのたびに呼ぶ。表示名・アイコンは最新の Google プロフィールに合わせる */
export async function upsertUser(
	db: Db,
	profile: { email: string; name: string | null; image: string | null },
): Promise<User> {
	const email = profile.email.trim().toLowerCase();
	const [row] = await db
		.insert(users)
		.values({ email, name: profile.name, image: profile.image })
		.onConflictDoUpdate({
			target: users.email,
			set: { name: profile.name, image: profile.image },
		})
		.returning();
	if (!row) throw new Error("ユーザの保存に失敗しました");
	return row;
}

/* ── wines ─────────────────────────────────────────────────── */

export type WineAuthor = Pick<User, "id" | "name" | "email" | "image">;

export type WineWithMeta = Wine & {
	author: WineAuthor;
	grapes: WineGrape[];
	photos: WinePhoto[];
};

const authorColumns = { id: users.id, name: users.name, email: users.email, image: users.image };

export type WineFilter = {
	/** 銘柄・生産者・産地・店名への部分一致 */
	q?: string;
	type?: string;
	/** 品種名の完全一致 */
	grape?: string;
	minRating?: number;
};

export type WineSort = "recent" | "rating" | "price";

/**
 * 一覧。既定は飲んだ日の新しい順で、未開栓（drunk_at が null）は末尾に置く。
 * 「まだ飲んでいない」は日付の前後で並べようがないため。
 */
export async function listWines(db: Db, filter: WineFilter = {}, sort: WineSort = "recent"): Promise<WineWithMeta[]> {
	const conditions: SQL[] = [];

	const q = filter.q?.trim();
	if (q) {
		const like = `%${q.toLowerCase()}%`;
		conditions.push(
			sql`(lower(${wines.name}) like ${like} or lower(coalesce(${wines.producer}, '')) like ${like}
				or lower(coalesce(${wines.region}, '')) like ${like} or lower(coalesce(${wines.country}, '')) like ${like}
				or lower(coalesce(${wines.shop}, '')) like ${like}
				or exists (select 1 from ${wineGrapes} g where g.wine_id = ${wines.id} and lower(g.name) like ${like}))`,
		);
	}
	if (filter.type) conditions.push(eq(wines.type, filter.type));
	if (filter.grape) {
		conditions.push(
			sql`exists (select 1 from ${wineGrapes} g where g.wine_id = ${wines.id} and lower(g.name) = ${filter.grape.trim().toLowerCase()})`,
		);
	}
	if (filter.minRating) conditions.push(sql`${wines.ratingOverall} >= ${filter.minRating}`);

	const orderBy =
		sort === "rating"
			? [sql`${wines.ratingOverall} is null`, desc(wines.ratingOverall), desc(wines.id)]
			: sort === "price"
				? [sql`${wines.priceMinor} is null`, desc(wines.priceMinor), desc(wines.id)]
				: [sql`${wines.drunkAt} is null`, desc(wines.drunkAt), desc(wines.id)];

	const rows = await db
		.select({ wine: wines, author: authorColumns })
		.from(wines)
		.innerJoin(users, eq(users.id, wines.authorId))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(...orderBy);

	const ids = rows.map((r) => r.wine.id);
	const [grapes, photos] = await Promise.all([listGrapesFor(db, ids), listPhotosFor(db, ids)]);
	return rows.map((r) => ({
		...r.wine,
		author: r.author,
		grapes: grapes.get(r.wine.id) ?? [],
		photos: photos.get(r.wine.id) ?? [],
	}));
}

async function listGrapesFor(db: Db, wineIds: readonly number[]): Promise<Map<number, WineGrape[]>> {
	const grouped = new Map<number, WineGrape[]>();
	if (wineIds.length === 0) return grouped;
	const rows = await db
		.select()
		.from(wineGrapes)
		.where(inArray(wineGrapes.wineId, [...wineIds]))
		.orderBy(asc(wineGrapes.sortOrder), asc(wineGrapes.id));
	for (const row of rows) {
		const list = grouped.get(row.wineId);
		if (list) list.push(row);
		else grouped.set(row.wineId, [row]);
	}
	return grouped;
}

async function listPhotosFor(db: Db, wineIds: readonly number[]): Promise<Map<number, WinePhoto[]>> {
	const grouped = new Map<number, WinePhoto[]>();
	if (wineIds.length === 0) return grouped;
	const rows = await db
		.select()
		.from(winePhotos)
		.where(inArray(winePhotos.wineId, [...wineIds]))
		.orderBy(asc(winePhotos.sortOrder), asc(winePhotos.id));
	for (const row of rows) {
		const list = grouped.get(row.wineId);
		if (list) list.push(row);
		else grouped.set(row.wineId, [row]);
	}
	return grouped;
}

export async function getWine(db: Db, id: number): Promise<WineWithMeta | null> {
	const [row] = await db
		.select({ wine: wines, author: authorColumns })
		.from(wines)
		.innerJoin(users, eq(users.id, wines.authorId))
		.where(eq(wines.id, id))
		.limit(1);
	if (!row) return null;
	const [grapes, photos] = await Promise.all([listGrapesFor(db, [id]), listPhotosFor(db, [id])]);
	return { ...row.wine, author: row.author, grapes: grapes.get(id) ?? [], photos: photos.get(id) ?? [] };
}

/** 絞り込みの選択肢に出す、実際に記録されている品種（多い順） */
export async function listGrapeNames(db: Db): Promise<string[]> {
	const rows = await db
		.select({ name: wineGrapes.name, count: sql<number>`count(*)` })
		.from(wineGrapes)
		.groupBy(wineGrapes.name)
		.orderBy(desc(sql`count(*)`), asc(wineGrapes.name));
	return rows.map((r) => r.name);
}

export type WineInput = {
	name: string;
	producer?: string;
	vintage?: number;
	type: string;
	country?: string;
	region?: string;
	priceMinor?: number;
	priceCurrency?: string;
	shop?: string;
	shopUrl?: string;
	drunkAt?: string;
	ratingOverall?: number;
	ratingAroma?: number;
	ratingTaste?: number;
	ratingFinish?: number;
	ratingValue?: number;
	note?: string;
	/** 品種。並べた順がそのまま表示順になる */
	grapes: string[];
};

/** undefined を null に寄せる（DB は「未入力」を null で持つ） */
function toColumns(input: WineInput) {
	return {
		name: input.name,
		producer: input.producer ?? null,
		vintage: input.vintage ?? null,
		type: input.type,
		country: input.country ?? null,
		region: input.region ?? null,
		priceMinor: input.priceMinor ?? null,
		priceCurrency: input.priceCurrency ?? null,
		shop: input.shop ?? null,
		shopUrl: input.shopUrl ?? null,
		drunkAt: input.drunkAt ?? null,
		ratingOverall: input.ratingOverall ?? null,
		ratingAroma: input.ratingAroma ?? null,
		ratingTaste: input.ratingTaste ?? null,
		ratingFinish: input.ratingFinish ?? null,
		ratingValue: input.ratingValue ?? null,
		note: input.note ?? null,
	};
}

export async function createWine(db: Db, input: WineInput, authorId: number): Promise<Wine> {
	const [row] = await db
		.insert(wines)
		.values({ ...toColumns(input), authorId })
		.returning();
	if (!row) throw new Error("ワインの保存に失敗しました");
	await replaceGrapes(db, row.id, input.grapes);
	return row;
}

export async function updateWine(db: Db, id: number, input: WineInput): Promise<void> {
	await db
		.update(wines)
		.set({ ...toColumns(input), updatedAt: sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))` })
		.where(eq(wines.id, id));
	await replaceGrapes(db, id, input.grapes);
}

/** 品種は行の増減も並べ替えもあるので、まとめて入れ替える */
async function replaceGrapes(db: Db, wineId: number, names: readonly string[]): Promise<void> {
	await db.delete(wineGrapes).where(eq(wineGrapes.wineId, wineId));
	if (names.length === 0) return;
	await db.insert(wineGrapes).values(names.map((name, i) => ({ wineId, name, sortOrder: i })));
}

/** ワインを削除する。品種と写真の行は外部キーの cascade で消える */
export async function deleteWine(db: Db, id: number): Promise<void> {
	await db.delete(wines).where(eq(wines.id, id));
}

/* ── photos ────────────────────────────────────────────────── */

export async function addPhotos(
	db: Db,
	wineId: number,
	photos: readonly { key: string; contentType: string }[],
): Promise<void> {
	if (photos.length === 0) return;
	const [{ maxOrder } = { maxOrder: null }] = await db
		.select({ maxOrder: sql<number | null>`max(${winePhotos.sortOrder})` })
		.from(winePhotos)
		.where(eq(winePhotos.wineId, wineId));
	const base = maxOrder === null ? 0 : Number(maxOrder) + 1;
	await db
		.insert(winePhotos)
		.values(photos.map((p, i) => ({ wineId, key: p.key, contentType: p.contentType, sortOrder: base + i })));
}

export async function getPhoto(db: Db, id: number): Promise<WinePhoto | null> {
	const [row] = await db.select().from(winePhotos).where(eq(winePhotos.id, id)).limit(1);
	return row ?? null;
}

/**
 * 指定した写真を先頭に移し、一覧のサムネイルにする。
 * 並び順は 0 から振り直す（削除を繰り返しても値が離れていかない）。
 */
export async function setCoverPhoto(db: Db, id: number): Promise<void> {
	const photo = await getPhoto(db, id);
	if (!photo) return;

	const rows = await db
		.select({ id: winePhotos.id })
		.from(winePhotos)
		.where(eq(winePhotos.wineId, photo.wineId))
		.orderBy(asc(winePhotos.sortOrder), asc(winePhotos.id));

	const ordered = [id, ...rows.map((r) => r.id).filter((rowId) => rowId !== id)];
	for (const [index, photoId] of ordered.entries()) {
		await db.update(winePhotos).set({ sortOrder: index }).where(eq(winePhotos.id, photoId));
	}
}

export async function deletePhoto(db: Db, id: number): Promise<void> {
	await db.delete(winePhotos).where(eq(winePhotos.id, id));
}

export async function listWinePhotoKeys(db: Db, wineId: number): Promise<string[]> {
	const rows = await db.select({ key: winePhotos.key }).from(winePhotos).where(eq(winePhotos.wineId, wineId));
	return rows.map((r) => r.key);
}
