import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "liftlog",
	description: "目標を決めて今日のメニューを提案し、実際の重量と回数を残す筋トレ記録",
	applicationName: "liftlog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body className="min-h-dvh antialiased">{children}</body>
		</html>
	);
}
