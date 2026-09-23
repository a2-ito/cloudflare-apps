"use client";

import { useActionState, useState } from "react";
import { saveWine } from "@/app/actions/wines";
import type { WineWithMeta } from "@/db/queries";
import { MIN_VINTAGE, today } from "@/lib/datetime";
import { initialActionState } from "@/lib/form";
import { COMMON_GRAPES, formatGrapes, MAX_GRAPES } from "@/lib/grapes";
import { currencyLabel, CURRENCY_OPTIONS, DEFAULT_CURRENCY, minorToInput, normalizeCurrency } from "@/lib/money";
import { RATING_AXES, RATING_CHOICES, ratingFieldName, toRatings } from "@/lib/ratings";
import { SHOP_URL_EXAMPLE } from "@/lib/shop-url";
import { WINE_TYPE_OPTIONS } from "@/lib/wine-types";
import { PhotoInput } from "./photo-input";
import { Field, FormMessage, inputClass, SubmitButton } from "./ui";

export function WineForm({ wine }: { wine?: WineWithMeta }) {
	const [state, formAction] = useActionState(saveWine, initialActionState);
	const defaultCurrency = normalizeCurrency(wine?.priceCurrency ?? DEFAULT_CURRENCY);
	const [currency, setCurrency] = useState(defaultCurrency);
	const ratings = wine ? toRatings(wine) : null;

	return (
		<form action={formAction} className="space-y-4">
			{wine && <input type="hidden" name="id" value={wine.id} />}
			<FormMessage state={state} />

			<Field label="銘柄">
				<input
					name="name"
					defaultValue={wine?.name ?? ""}
					required
					maxLength={200}
					className={inputClass}
					placeholder="シャトー・マルゴー"
				/>
			</Field>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="生産者">
					<input
						name="producer"
						defaultValue={wine?.producer ?? ""}
						maxLength={200}
						className={inputClass}
						placeholder="Château Margaux"
					/>
				</Field>
				<Field label="収穫年" hint="ノンヴィンテージや不明なら空欄">
					<input
						type="number"
						name="vintage"
						defaultValue={wine?.vintage ?? ""}
						min={MIN_VINTAGE}
						max={new Date().getFullYear()}
						inputMode="numeric"
						className={inputClass}
						placeholder="2018"
					/>
				</Field>
			</div>

			<Field label="種別">
				<select name="type" defaultValue={wine?.type ?? "red"} className={inputClass}>
					{WINE_TYPE_OPTIONS.map((t) => (
						<option key={t.value} value={t.value}>
							{t.emoji} {t.label}
						</option>
					))}
				</select>
			</Field>

			<Field label="品種" hint={`カンマ区切りで ${MAX_GRAPES} 種類まで。ブレンドは書いた順に並びます`}>
				<input
					name="grapes"
					defaultValue={formatGrapes(wine?.grapes.map((g) => g.name) ?? [])}
					maxLength={500}
					list="grape-candidates"
					className={inputClass}
					placeholder="カベルネ・ソーヴィニヨン, メルロー"
				/>
				{/* よく使う品種を候補に出す。自由入力も妨げない */}
				<datalist id="grape-candidates">
					{COMMON_GRAPES.map((g) => (
						<option key={g} value={g} />
					))}
				</datalist>
			</Field>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="国">
					<input
						name="country"
						defaultValue={wine?.country ?? ""}
						maxLength={100}
						className={inputClass}
						placeholder="フランス"
					/>
				</Field>
				<Field label="産地">
					<input
						name="region"
						defaultValue={wine?.region ?? ""}
						maxLength={100}
						className={inputClass}
						placeholder="ボルドー / マルゴー"
					/>
				</Field>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="価格" hint="空欄でも保存できます">
					<div className="flex gap-2">
						{/* inputClass の w-full と衝突しないよう、幅の指定は外側の要素に持たせる */}
						<input
							name="price"
							inputMode="decimal"
							defaultValue={wine?.priceMinor != null ? minorToInput(wine.priceMinor, defaultCurrency) : ""}
							className={`${inputClass} min-w-0 flex-1`}
							placeholder="3200"
						/>
						<div className="w-28 shrink-0">
							<select
								name="priceCurrency"
								value={currency}
								onChange={(e) => setCurrency(e.target.value)}
								aria-label="価格の通貨"
								className={inputClass}
							>
								{CURRENCY_OPTIONS.map((c) => (
									<option key={c.code} value={c.code} title={currencyLabel(c.code)}>
										{c.code}
									</option>
								))}
							</select>
						</div>
					</div>
				</Field>
				<Field label="飲んだ日" hint="まだ開けていなければ空欄">
					<input
						type="date"
						name="drunkAt"
						defaultValue={wine ? (wine.drunkAt ?? "") : today()}
						max={today()}
						className={inputClass}
					/>
				</Field>
			</div>

			<Field label="購入場所">
				<input
					name="shop"
					defaultValue={wine?.shop ?? ""}
					maxLength={200}
					className={inputClass}
					placeholder="エノテカ 銀座店"
				/>
			</Field>

			<Field label="店の URL" hint="通販やワイナリーのページ（https のみ）">
				<input
					type="url"
					name="shopUrl"
					defaultValue={wine?.shopUrl ?? ""}
					maxLength={2000}
					inputMode="url"
					className={inputClass}
					placeholder={SHOP_URL_EXAMPLE}
				/>
			</Field>

			<fieldset className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
				<legend className="px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">評価</legend>
				<div className="grid gap-4 sm:grid-cols-2">
					{RATING_AXES.map((axis) => (
						<Field key={axis.key} label={axis.label} hint={axis.hint}>
							<select
								name={ratingFieldName(axis.key)}
								defaultValue={String(ratings?.[axis.key] ?? 0)}
								className={inputClass}
							>
								{RATING_CHOICES.map((c) => (
									<option key={c.value} value={c.value}>
										{c.label}
									</option>
								))}
							</select>
						</Field>
					))}
				</div>
			</fieldset>

			<Field label="感想">
				<textarea
					name="note"
					defaultValue={wine?.note ?? ""}
					rows={4}
					maxLength={2000}
					className={inputClass}
					placeholder="開けたては固いが、30 分で果実味が開く。肉料理に合わせたい"
				/>
			</Field>

			<Field label="写真" hint="ラベルやコルクを残しておくと、あとで探しやすくなります">
				<PhotoInput name="photos" />
			</Field>

			<SubmitButton>{wine ? "更新する" : "記録する"}</SubmitButton>
		</form>
	);
}
