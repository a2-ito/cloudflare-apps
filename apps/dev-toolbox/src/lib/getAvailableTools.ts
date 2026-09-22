import { tools } from "@/config/tools";
import { getMessages } from "@/i18n/getMessages";
import type { Locale } from "@/i18n/config";
import type { ToolSlug } from "@/config/tools";

export async function getAvailableTools(lang: Locale) {
  const t = await getMessages(lang);

  return tools
    .filter((tool) => tool.enabled)
    .map((tool) => ({
      ...tool,
      name: t.tools[tool.slug as ToolSlug]?.name ?? tool.slug,
      description: t.tools[tool.slug as ToolSlug]?.description ?? "",
    }));
}
