import RegexTester from "@/components/tools/RegexTester";
import { getMessages } from "@/i18n/getMessages";
import type { Locale } from "@/i18n/config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);

  return <RegexTester t={t.tools["regex-tester"]} />;
}
