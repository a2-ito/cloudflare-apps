// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klondike Solitaire",
  description: "Play Klondike Solitaire online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <header className="border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">Klondike Solitaire</h1>
        </header>

        <main className="p-4">{children}</main>

        <footer className="border-t border-gray-700 p-2 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Klondike Solitaire
        </footer>
      </body>
    </html>
  );
}
