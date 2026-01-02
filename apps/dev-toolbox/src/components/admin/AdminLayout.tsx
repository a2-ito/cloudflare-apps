// src/components/admin/AdminLayout.tsx
import Sidebar from "./Sidebar";
import type { Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  lang: Locale;
};

export default function AdminLayout({ children, lang }: Props) {
  return (
    <div
      className="
        flex min-h-screen
        bg-gray-100 text-gray-900
        dark:bg-gray-950 dark:text-gray-100
      "
    >
      <Sidebar lang={lang} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
