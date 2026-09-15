import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/account/",
        "/admin",
        "/admin/",
        "/app",
        "/app/",
        "/business",
        "/business/",
        "/api",
        "/api/",
        "/login",
        "/signup",
        "/auth",
        "/auth/"
      ]
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url
  };
}
