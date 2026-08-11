import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/console/", "/gate/"],
      },
    ],
    sitemap: "https://sti-dz.com/sitemap.xml",
  };
}
