/**
 * 品種の入力。
 *
 * 1 本に複数の品種が入るブレンドが普通なので、フォームでは 1 つの欄に
 * カンマ区切りで書かせ、ここで配列に直す。サーバーアクションからも
 * クライアントの入力欄からも使うため、env にも drizzle にも触れない。
 */

/** 1 本に登録できる品種の数。ブレンドでもこれを超えることはまず無い */
export const MAX_GRAPES = 10;

/** 1 つの品種名の長さの上限 */
export const MAX_GRAPE_LENGTH = 50;

/** "カベルネ・ソーヴィニヨン, メルロー" -> ["カベルネ・ソーヴィニヨン", "メルロー"] */
export function parseGrapes(input: string | undefined | null): string[] {
	if (!input) return [];
	const names: string[] = [];
	// 日本語で書くと読点で区切られることがあるので、どちらも受ける
	for (const raw of input.split(/[,、]/)) {
		const name = raw.trim();
		if (name === "" || name.length > MAX_GRAPE_LENGTH) continue;
		// 同じ品種を 2 度書かれても DB の一意制約に当てない
		if (!names.includes(name)) names.push(name);
	}
	return names.slice(0, MAX_GRAPES);
}

/** 保存済みの品種を入力欄に戻す */
export function formatGrapes(names: readonly string[]): string {
	return names.join(", ");
}

/** よく使う品種（入力欄の候補に出す） */
export const COMMON_GRAPES = [
	"カベルネ・ソーヴィニヨン",
	"メルロー",
	"ピノ・ノワール",
	"シラー",
	"サンジョヴェーゼ",
	"ネッビオーロ",
	"テンプラニーリョ",
	"ガメイ",
	"マスカット・ベーリーA",
	"シャルドネ",
	"ソーヴィニヨン・ブラン",
	"リースリング",
	"ピノ・グリ",
	"甲州",
	"シュナン・ブラン",
] as const;
