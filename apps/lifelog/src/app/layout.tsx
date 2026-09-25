import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "lifelog",
	description: "日々の出来事を写真付きの日記として残すライフログ",
	applicationName: "lifelog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body className="min-h-dvh antialiased">{children}</body>
		</html>
	);
}
