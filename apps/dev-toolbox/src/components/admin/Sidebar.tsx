// src/components/admin/Sidebar.tsx
import SidebarClient from "./SidebarClient";
import { getMessages } from "@/i18n/getMessages";
import { getAvailableTools } from "@/lib/getAvailableTools";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
  isOpen?: boolean;
  onClose?: () => void;
};

export default async function Sidebar({ lang, isOpen, onClose }: Props) {
  const t = await getMessages(lang);
  const tools = await getAvailableTools(lang);

  return (
    <SidebarClient
      lang={lang}
      utilitiesLabel={t.menu.utilities}
      tools={tools}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
