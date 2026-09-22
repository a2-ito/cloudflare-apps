// app/[lang]/layout.tsx
import { Metadata } from "next";
import { initI18n } from "@/i18n/server";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = await params;

  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ja: "/ja",
        en: "/en",
      },
    },
  };
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
