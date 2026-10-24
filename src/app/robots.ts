import {getProductPolicy} from "@/lib/product-mode-server";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ...(getProductPolicy().mode === "full" ? [] : ["/pricing", "/business-platform", "/ai", "/embed", "/share"]),
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
