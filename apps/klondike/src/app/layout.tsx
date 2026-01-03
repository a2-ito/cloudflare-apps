// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header className="border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">Klondike Solitaire</h1>
          <ThemeToggle />
        </header>

        <ThemeProvider>
          <main className="p-4">{children}</main>
        </ThemeProvider>

        <footer className="border-t border-gray-700 p-2 text-center text-sm text-gray-400"></footer>
      </body>
    </html>
  );
}
