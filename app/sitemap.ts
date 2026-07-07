import type { MetadataRoute } from "next";
import { ALL_CATEGORIES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://what-do-i-do-today.vercel.app";

  const categoryPages = ALL_CATEGORIES.map((category) => ({
    url: `${base}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...categoryPages,
  ];
}
