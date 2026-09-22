import OgpChecker from "@/components/tools/OgpChecker";
import { getMessages } from "@/i18n/getMessages";
import type { Locale } from "@/i18n/config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);

  return <OgpChecker t={t.tools["ogp-checker"]} />;
}
