import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";
import type { ToolSlug } from "@/config/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: ToolSlug }>;
}) {
  const { lang, slug } = await params;
  const t = await getMessages(lang);

  const tool = t.tools[slug];

  return {
    title: tool?.name ?? slug,
    description: tool?.description ?? "",
  };
}
