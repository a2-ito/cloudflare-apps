import { getEnv } from "./cloudflare";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string): string {
	switch (type) {
		case "image/png":
			return "png";
		case "image/webp":
			return "webp";
		case "image/gif":
			return "gif";
		default:
			return "jpg";
	}
}

/** FormData の画像を R2 に保存してキーを返す。画像が無ければ null */
export async function storeImage(file: File | null): Promise<string | null> {
	if (!file || file.size === 0) return null;
	if (!ALLOWED_TYPES.has(file.type)) throw new Error(`対応していない画像形式です: ${file.type || "不明"}`);
	if (file.size > MAX_IMAGE_BYTES) throw new Error("画像サイズは 4MB 以下にしてください");

	const env = await getEnv();
	const key = `products/${crypto.randomUUID()}.${extensionFor(file.type)}`;
	await env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), {
		// キーは UUID で、同じキーの中身が入れ替わることはない。CDN とブラウザに
		// 恒久的にキャッシュさせてよい。
		httpMetadata: { contentType: file.type, cacheControl: CACHE_CONTROL },
	});
	return key;
}

export async function deleteImage(key: string | null): Promise<void> {
	if (!key) return;
	const env = await getEnv();
	await env.IMAGES_BUCKET.delete(key);
}

/**
 * 画像の配信 URL。R2 のカスタムドメインを直に指すので Worker を経由しない。
 *
 * 以前は Worker 上の Route Handler (/api/images) で認証を確かめてから R2 を読んで
 * 返していた。ただしトップページが商品数ぶんのサムネイルを並べるため、一覧を 1 回
 * 開くだけで商品数ぶんの Worker が起動し、その全てで Auth.js のセッション復号が
 * 走っていた。CDN から直に返せば Worker は 1 度も起動しない。
 *
 * 引き換えに、画像は URL を知っていれば認証なしで取得できる。キーが UUID v4 で
 * 推測できないことに依存している。バケットの一覧は公開されないため列挙もできない。
 * 商品名や価格は D1 にあり、今まで通り認証の内側にある。
 *
 * 基底 URL はクライアントコンポーネントからも呼ぶため NEXT_PUBLIC_ 付きで、
 * next build 時に値が埋め込まれる。手元では Miniflare のローカル R2 に入るため
 * カスタムドメインからは取れない。開発時に限り /api/images へ落として、
 * ローカルで上げた画像もそのまま見えるようにする。
 */
export function imageUrl(key: string): string {
	const base = process.env.NEXT_PUBLIC_IMAGES_BASE_URL;
	if (base) return `${base.replace(/\/+$/, "")}/${key}`;
	// 本番で未設定なら、気づかないまま Worker 経由に戻るのを避けて落とす
	if (process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_IMAGES_BASE_URL が未設定です");
	return `/api/images/${key}`;
}
