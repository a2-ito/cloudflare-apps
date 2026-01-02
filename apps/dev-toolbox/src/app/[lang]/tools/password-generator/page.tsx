import PasswordGenerator from "@/components/tools/PasswordGenerator";
import { getMessages } from "@/i18n/getMessages";
import type { Locale } from "@/i18n/config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);

  return <PasswordGenerator t={t.tools["password-generator"]} />;
}
