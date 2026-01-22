// src/components/admin/Sidebar.tsx
import SidebarClient from "./SidebarClient";
import { getMessages } from "@/i18n/getMessages";
import { getAvailableTools } from "@/lib/getAvailableTools";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
};

export default async function Sidebar({ lang }: Props) {
  const t = await getMessages(lang);
  const tools = await getAvailableTools(lang);

  return (
    <SidebarClient
      lang={lang}
      title={t.app.title}
      utilitiesLabel={t.menu.utilities}
      tools={tools}
    />
  );
}
