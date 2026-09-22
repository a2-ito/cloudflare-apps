// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";

  const routes = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
    },
    ...tools.map((tool) => ({
      url: `${baseUrl}/${locale}/tools/${tool.slug}`,
      lastModified: new Date(),
    })),
  ]);

  return routes;
}
