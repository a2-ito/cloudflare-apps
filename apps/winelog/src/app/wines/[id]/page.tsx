import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteWineAction } from "@/app/actions/wines";
import { PhotoGallery } from "@/components/photo-gallery";
import { Rating, RatingAxes } from "@/components/rating";
import { ConfirmForm, DangerButton, LinkButton } from "@/components/ui";
import { getDb } from "@/db";
import { getWine } from "@/db/queries";
import { requireUser } from "@/lib/auth";
import { formatDate, formatTimestamp } from "@/lib/datetime";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/money";
import { photoFileName } from "@/lib/photo-name";
import { photoUrl } from "@/lib/photos";
import { toRatings } from "@/lib/ratings";
import { shopUrlHost } from "@/lib/shop-url";
import { wineTypeEmoji, wineTypeLabel } from "@/lib/wine-types";

export default async function WinePage({ params }: PageProps<"/wines/[id]">) {
	await requireUser();
	const { id } = await params;
	const wineId = Number(id);
	if (!Number.isInteger(wineId)) notFound();

	const db = await getDb();
	const wine = await getWine(db, wineId);
	if (!wine) notFound();

	const authorName = wine.author.name ?? wine.author.email;
	// photoUrl は Cloudflare の env に触れるモジュールにあるので、URL はここで作って渡す
	const galleryPhotos = wine.photos.map((photo, index) => ({
		id: photo.id,
		src: photoUrl(photo.key),
		downloadName: photoFileName(wine.name, index, photo.contentType),
	}));
	const origin = [wine.country, wine.region].filter(Boolean).join(" / ");

	return (
		<div className="space-y-6">
			<Link href="/" className="text-sm text-zinc-500 hover:underline">
				← 一覧
			</Link>

			<div className="space-y-3">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p className="text-xs text-zinc-500">
							{wineTypeEmoji(wine.type)} {wineTypeLabel(wine.type)}
							{wine.vintage && ` ・ ${wine.vintage}`}
						</p>
						<h1 className="text-2xl font-bold">{wine.name}</h1>
						{wine.producer && <p className="text-sm text-zinc-600 dark:text-zinc-400">{wine.producer}</p>}
						<p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
							<span>{wine.drunkAt ? `${formatDate(wine.drunkAt)} に飲んだ` : "まだ開けていない"}</span>
							{origin && <span>・{origin}</span>}
							<Rating value={wine.ratingOverall} />
						</p>
					</div>
					<LinkButton href={`/wines/${wine.id}/edit`}>編集</LinkButton>
				</div>

				{wine.grapes.length > 0 && (
					<ul className="flex flex-wrap gap-2">
						{wine.grapes.map((grape) => (
							<li key={grape.id}>
								{/* 品種から一覧の絞り込みへ飛べると、似た好みのワインを辿れる */}
								<Link
									href={`/?grape=${encodeURIComponent(grape.name)}`}
									className="inline-flex rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:border-sky-400 dark:border-zinc-700 dark:text-zinc-300"
								>
									{grape.name}
								</Link>
							</li>
						))}
					</ul>
				)}

				{wine.priceMinor != null && (
					<p className="text-xl font-bold">{formatMoney(wine.priceMinor, wine.priceCurrency ?? DEFAULT_CURRENCY)}</p>
				)}

				{(wine.shop || wine.shopUrl) && (
					<p className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-600 dark:text-zinc-400">
						<span>🛒 {wine.shop ?? "購入場所"}</span>
						{/* 保存時に https の URL だけを通しているが、外部リンクなので参照元は渡さない */}
						{wine.shopUrl && (
							<a
								href={wine.shopUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sky-600 hover:underline dark:text-sky-400"
							>
								{shopUrlHost(wine.shopUrl)}
							</a>
						)}
					</p>
				)}

				<RatingAxes ratings={toRatings(wine)} />

				<p className="text-xs text-zinc-500">
					{authorName} が {formatTimestamp(wine.createdAt)} に記録
					{wine.updatedAt !== wine.createdAt && `（最終更新 ${formatTimestamp(wine.updatedAt)}）`}
				</p>

				{wine.note && (
					<p className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
						{wine.note}
					</p>
				)}
			</div>

			{wine.photos.length > 0 && <PhotoGallery photos={galleryPhotos} />}

			<div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
				<ConfirmForm action={deleteWineAction} message={`「${wine.name}」を削除します。よろしいですか？`}>
					<input type="hidden" name="id" value={wine.id} />
					<DangerButton>この記録を削除する</DangerButton>
				</ConfirmForm>
			</div>
		</div>
	);
}
