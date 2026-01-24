// src/lib/getToolsWithI18n.ts
import { tools } from "@/config/tools";

export function getToolsWithI18n() {
  return tools.filter((tool) => tool.enabled);
}
