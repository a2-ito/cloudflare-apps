import Base64Tool from "@/components/tools/Base64Tool";
import { getMessages } from "@/i18n/getMessages";
import type { Locale } from "@/i18n/config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);

  return <Base64Tool t={t.tools["base64-tool"]} />;
}
