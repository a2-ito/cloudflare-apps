import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "kcalog",
	description: "食べたものとカロリーを記録して、1 日の摂取量を振り返るメモ",
	applicationName: "kcalog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body className="min-h-dvh antialiased">{children}</body>
		</html>
	);
}
