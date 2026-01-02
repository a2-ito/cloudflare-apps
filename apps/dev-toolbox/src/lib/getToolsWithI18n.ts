// src/lib/getToolsWithI18n.ts
import { tools } from "@/config/tools";
import type { Messages } from "@/i18n/messages/type";

export function getToolsWithI18n(t: Messages) {
  return tools
    .filter((tool) => tool.enabled)
    .map((tool) => ({
      ...tool,
      //name: t.tools[tool.slug]?.name ?? tool.slug,
      //description: t.tools[tool.slug]?.description ?? "",
    }));
}
