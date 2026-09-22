import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "google-adsense-account": "ca-pub-1048349982279112",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="">
      <body className="bg-gray-100 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
