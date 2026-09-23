import Link from "next/link";
import { WineForm } from "@/components/wine-form";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "ワインを記録する | ワインログ" };

export default async function NewWinePage() {
	await requireUser();

	return (
		<div className="space-y-6">
			<Link href="/" className="text-sm text-zinc-500 hover:underline">
				← 一覧
			</Link>
			<h1 className="text-xl font-bold">ワインを記録する</h1>
			<WineForm />
		</div>
	);
}
