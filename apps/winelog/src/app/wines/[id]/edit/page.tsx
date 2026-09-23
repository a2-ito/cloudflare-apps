import Link from "next/link";
import { notFound } from "next/navigation";
import { WineForm } from "@/components/wine-form";
import { getDb } from "@/db";
import { getWine } from "@/db/queries";
import { requireUser } from "@/lib/auth";

export default async function EditWinePage({ params }: PageProps<"/wines/[id]/edit">) {
	await requireUser();
	const { id } = await params;
	const wineId = Number(id);
	if (!Number.isInteger(wineId)) notFound();

	const db = await getDb();
	const wine = await getWine(db, wineId);
	if (!wine) notFound();

	return (
		<div className="space-y-6">
			<Link href={`/wines/${wine.id}`} className="text-sm text-zinc-500 hover:underline">
				← {wine.name}
			</Link>
			<h1 className="text-xl font-bold">記録を編集する</h1>
			{/* 写真は入力欄から追加するだけで、削除や並べ替えは詳細画面のビューアから行う */}
			<WineForm wine={wine} />
		</div>
	);
}
