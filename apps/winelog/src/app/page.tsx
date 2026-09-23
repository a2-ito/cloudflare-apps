import Link from "next/link";
import { LinkPending } from "@/components/link-pending";
import { Rating } from "@/components/rating";
import { LinkButton, inputClass } from "@/components/ui";
import { getDb } from "@/db";
import { listGrapeNames, listWines, type WineFilter, type WineSort } from "@/db/queries";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/datetime";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/money";
import { photoUrl } from "@/lib/photos";
import { WINE_TYPE_OPTIONS, wineTypeEmoji, wineTypeLabel } from "@/lib/wine-types";

const SORT_OPTIONS: readonly { value: WineSort; label: string }[] = [
	{ value: "recent", label: "飲んだ日が新しい順" },
	{ value: "rating", label: "総合評価が高い順" },
	{ value: "price", label: "価格が高い順" },
];

function first(value: string | string[] | undefined): string | undefined {
	const raw = Array.isArray(value) ? value[0] : value;
	const trimmed = raw?.trim();
	return trimmed === "" ? undefined : trimmed;
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
	await requireUser();
	const params = await searchParams;

	const q = first(params.q);
	const type = first(params.type);
	const grape = first(params.grape);
	const minRating = Number(first(params.minRating) ?? 0);
	const sortParam = first(params.sort);
	const sort: WineSort = SORT_OPTIONS.some((s) => s.value === sortParam) ? (sortParam as WineSort) : "recent";

	const filter: WineFilter = {
		q,
		type,
		grape,
		minRating: Number.isInteger(minRating) && minRating > 0 ? minRating : undefined,
	};
	const hasFilter = Boolean(q || type || grape || filter.minRating);

	const db = await getDb();
	const [wines, grapeNames] = await Promise.all([listWines(db, filter, sort), listGrapeNames(db)]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-xl font-bold">ワイン（{wines.length}）</h1>
				<LinkButton href="/wines/new" variant="primary">
					記録する
				</LinkButton>
			</div>

			{/* 絞り込みは GET で送る。条件が URL に残るので、共有もブックマークもできる */}
			<form className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-950">
				<label className="sm:col-span-2">
					<span className="sr-only">検索</span>
					<input
						type="search"
						name="q"
						defaultValue={q ?? ""}
						className={inputClass}
						placeholder="銘柄・生産者・産地・品種・購入場所で検索"
					/>
				</label>
				<label>
					<span className="sr-only">種別</span>
					<select name="type" defaultValue={type ?? ""} className={inputClass}>
						<option value="">すべての種別</option>
						{WINE_TYPE_OPTIONS.map((t) => (
							<option key={t.value} value={t.value}>
								{t.emoji} {t.label}
							</option>
						))}
					</select>
				</label>
				<label>
					<span className="sr-only">品種</span>
					<select name="grape" defaultValue={grape ?? ""} className={inputClass}>
						<option value="">すべての品種</option>
						{grapeNames.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>
				</label>
				<label>
					<span className="sr-only">総合評価</span>
					<select name="minRating" defaultValue={String(filter.minRating ?? 0)} className={inputClass}>
						<option value="0">評価で絞らない</option>
						<option value="5">★★★★★ のみ</option>
						<option value="4">★★★★ 以上</option>
						<option value="3">★★★ 以上</option>
					</select>
				</label>
				<label>
					<span className="sr-only">並び順</span>
					<select name="sort" defaultValue={sort} className={inputClass}>
						{SORT_OPTIONS.map((s) => (
							<option key={s.value} value={s.value}>
								{s.label}
							</option>
						))}
					</select>
				</label>
				<div className="flex gap-2 sm:col-span-2">
					<button
						type="submit"
						className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
					>
						絞り込む
					</button>
					{hasFilter && (
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
						>
							条件を消す
						</Link>
					)}
				</div>
			</form>

			{wines.length === 0 ? (
				<p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
					{hasFilter ? "条件に合うワインがありません" : "まだ記録がありません。最初の 1 本を記録しましょう"}
				</p>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2">
					{wines.map((wine) => {
						// 並び順の先頭がサムネイル（詳細画面から差し替えられる）
						const cover = wine.photos[0];
						return (
							<li key={wine.id}>
								<Link
									href={`/wines/${wine.id}`}
									className="flex h-full gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-sky-400 dark:border-zinc-800 dark:bg-zinc-950"
								>
									{cover ? (
										<img
											src={photoUrl(cover.key)}
											alt=""
											className="h-20 w-20 shrink-0 rounded-md border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-700 dark:bg-zinc-800"
										/>
									) : (
										<span
											aria-hidden="true"
											className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-200 text-2xl dark:border-zinc-700"
										>
											{wineTypeEmoji(wine.type)}
										</span>
									)}
									<div className="min-w-0 flex-1">
										<p className="text-xs text-zinc-500">
											{wineTypeLabel(wine.type)}
											{wine.vintage && ` ・ ${wine.vintage}`}
										</p>
										<h2 className="flex items-center gap-2 font-semibold">
											<span className="truncate">{wine.name}</span>
											{/* 押したカードが反応するように、遷移待ちの間だけぐるぐるを出す */}
											<LinkPending />
										</h2>
										{wine.producer && <p className="truncate text-sm text-zinc-500">{wine.producer}</p>}
										{wine.grapes.length > 0 && (
											<p className="truncate text-xs text-zinc-500">{wine.grapes.map((g) => g.name).join(" / ")}</p>
										)}
										<p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
											<Rating value={wine.ratingOverall} />
											{wine.priceMinor != null && (
												<span className="text-zinc-600 dark:text-zinc-400">
													{formatMoney(wine.priceMinor, wine.priceCurrency ?? DEFAULT_CURRENCY)}
												</span>
											)}
											<span className="text-xs text-zinc-500">
												{wine.drunkAt ? formatDate(wine.drunkAt) : "未開栓"}
											</span>
										</p>
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
