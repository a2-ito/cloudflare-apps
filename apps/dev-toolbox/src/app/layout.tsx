import "./globals.css";
import type { Locale } from "@/i18n/config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return {
    alternates: {
      languages: {
        ja: "/ja",
        en: "/en",
      },
      canonical: `/${lang}`,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
