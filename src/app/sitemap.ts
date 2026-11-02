import type { MetadataRoute } from "next";
import { getStoredPortfolioData } from "@/lib/portfolioStore";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://harsharyan.dev";
  const data = getStoredPortfolioData();
  const currentDate = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#certificates`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  // Dynamic deep-links for each project in the portfolio
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach((proj) => {
      if (proj.id) {
        routes.push({
          url: `${baseUrl}/#projects?id=${encodeURIComponent(proj.id)}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  }

  return routes;
}
