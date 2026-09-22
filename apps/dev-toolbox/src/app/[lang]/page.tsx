// src/app/[lang]/page.tsx
import AdminLayout from "@/components/admin/AdminLayout";
import { getMessages } from "@/i18n/getMessages";
import { getAvailableTools } from "@/lib/getAvailableTools";
import type { Locale } from "@/i18n/config";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getMessages(lang);
  // const tools = getToolsWithI18n(t);
  const tools = await getAvailableTools(lang);

  return (
    <AdminLayout lang={lang}>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        {t.menu.utilities}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${lang}/tools/${tool.slug}`}
            className="rounded border p-4 sm:p-6
              bg-white dark:bg-gray-900
              border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-800
              hover:border-blue-300 dark:hover:border-blue-600
              transition-all duration-200
              hover:shadow-md
              cursor-pointer"
          >
            <h2 className="font-semibold text-base sm:text-lg">{tool.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
