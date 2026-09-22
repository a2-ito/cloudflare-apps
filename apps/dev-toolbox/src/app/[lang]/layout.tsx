// src/app/[lang]/layout.tsx
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/getMessages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);

  return {
    title: {
      default: t.app.title,
      template: `%s | ${t.app.title}`,
    },
    description: t.app.description,

    openGraph: {
      title: t.app.title,
      description: t.app.description,
      url: `/${lang}`,
      siteName: t.app.title,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary",
      title: t.app.title,
      description: t.app.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  return <>{children}</>;
}
