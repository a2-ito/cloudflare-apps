import AdminLayout from "@/components/admin/AdminLayout";
import type { Locale } from "@/i18n/config"
import { isLocale } from "@/i18n/config"

export default async function ToolsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  //params: Promise<{ lang: Locale }>;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
	const safeLang = isLocale(lang) ? lang : "ja"

  return <AdminLayout lang={safeLang}>{children}</AdminLayout>;
}
