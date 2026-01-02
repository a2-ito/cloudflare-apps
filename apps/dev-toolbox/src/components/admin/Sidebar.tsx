// src/components/admin/Sidebar.tsx
import SidebarClient from "./SidebarClient";
import { getMessages } from "@/i18n/getMessages";
import { getToolsWithI18n } from "@/lib/getToolsWithI18n";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
};

export default async function Sidebar({ lang }: Props) {
  const t = await getMessages(lang);
  const tools = getToolsWithI18n(t);

  return (
    <SidebarClient
      lang={lang}
      title={t.app.title}
      utilitiesLabel={t.menu.utilities}
      tools={tools}
    />
  );
}
