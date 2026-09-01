import type { MetadataRoute } from "next";

const BASE_URL = "https://sti.dz";
const LOCALES = ["fr", "ar", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = [
    "",
    "/ooredoo",
    "/ooredoo/about",
    "/ooredoo/careers",
    "/ooredoo/contact",
    "/ooredoo/news",
    "/ooredoo/products",
    "/ooredoo/solutions",
    "/ooredoo/quote",
    "/vivo",
    "/vivo/about",
    "/vivo/find-a-store",
    "/vivo/products",
    "/vivo/products/v-series",
    "/vivo/products/y-series",
    "/vivo/support",
    "/vivo/technology",
  ];

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      routes.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : path.includes("/products") || path.includes("/solutions") ? 0.8 : 0.7,
      });
    }
  }

  routes.unshift({
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  return routes;
}
