import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const now = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`;

/** ログインした Google アカウント。記録者の表示名・アイコンの出どころ */
export const users = sqliteTable(
	"users",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		email: text("email").notNull(),
		name: text("name"),
		image: text("image"),
		createdAt: text("created_at").notNull().default(now),
	},
	(t) => [uniqueIndex("users_email_idx").on(t.email)],
);

/**
 * 飲んだ（または買った）ワイン 1 本。
 *
 * 旅行のような上位のまとまりは持たない。1 本 = 1 レコードで、
 * 見返すときは一覧の検索と絞り込みで辿る。
 */
export const wines = sqliteTable(
	"wines",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		/** 銘柄。ラベルに書かれている名前をそのまま入れる */
		name: text("name").notNull(),
		/** 生産者・ワイナリー */
		producer: text("producer"),
		/** 収穫年。ノンヴィンテージや不明なら null */
		vintage: integer("vintage"),
		/** 種別。取りうる値は src/lib/wine-types.ts */
		type: text("type").notNull().default("red"),
		country: text("country"),
		region: text("region"),
		/** priceCurrency の最小単位での価格。未入力なら null */
		priceMinor: integer("price_minor"),
		/** 価格をどの通貨で入力したか。未入力なら null */
		priceCurrency: text("price_currency"),
		/** 買った店・レストランなど */
		shop: text("shop"),
		/** 店の URL（任意）。https のみ。src/lib/shop-url.ts で検証してから入れる */
		shopUrl: text("shop_url"),
		/** 飲んだ日（YYYY-MM-DD）。まだ開けていなければ null */
		drunkAt: text("drunk_at"),
		/** 評価は 1〜5。未評価なら null。軸の定義は src/lib/ratings.ts */
		ratingOverall: integer("rating_overall"),
		ratingAroma: integer("rating_aroma"),
		ratingTaste: integer("rating_taste"),
		ratingFinish: integer("rating_finish"),
		ratingValue: integer("rating_value"),
		/** 感想 */
		note: text("note"),
		authorId: integer("author_id")
			.notNull()
			.references(() => users.id),
		createdAt: text("created_at").notNull().default(now),
		updatedAt: text("updated_at").notNull().default(now),
	},
	(t) => [
		// 一覧は「飲んだ日の新しい順」が既定
		index("wines_drunk_at_idx").on(t.drunkAt),
		// 一覧の「種別」「★4 以上」での絞り込み用
		index("wines_type_rating_idx").on(t.type, t.ratingOverall),
	],
);

/**
 * ワインに使われている品種。
 *
 * 1 本に複数の品種が入るブレンドが普通なので別テーブルにする。
 * 品種ごとの絞り込みもこの表を引く。
 */
export const wineGrapes = sqliteTable(
	"wine_grapes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		wineId: integer("wine_id")
			.notNull()
			.references(() => wines.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		/** フォームで並べた順。表示順もこれに従う */
		sortOrder: integer("sort_order").notNull().default(0),
	},
	(t) => [
		uniqueIndex("wine_grapes_wine_name_idx").on(t.wineId, t.name),
		// 品種名での絞り込み用
		index("wine_grapes_name_idx").on(t.name),
	],
);

/** ワインに添付した写真（実体は R2、ここにはキーだけ） */
export const winePhotos = sqliteTable(
	"wine_photos",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		wineId: integer("wine_id")
			.notNull()
			.references(() => wines.id, { onDelete: "cascade" }),
		/** R2 のオブジェクトキー */
		key: text("key").notNull(),
		contentType: text("content_type").notNull(),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: text("created_at").notNull().default(now),
	},
	(t) => [index("wine_photos_wine_idx").on(t.wineId, t.sortOrder)],
);

export type User = typeof users.$inferSelect;
export type Wine = typeof wines.$inferSelect;
export type WineGrape = typeof wineGrapes.$inferSelect;
export type WinePhoto = typeof winePhotos.$inferSelect;
