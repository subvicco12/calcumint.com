import type { NextConfig } from "next";

const contentSecurityPolicyDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.paddle.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://*.paddle.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://*.paddle.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net",
  "frame-src 'self' https://*.paddle.com https://*.google.com https://*.doubleclick.net",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests"
];

const contentSecurityPolicy = contentSecurityPolicyDirectives.join("; ");
const protectedContentSecurityPolicy = [...contentSecurityPolicyDirectives, "frame-ancestors 'self'"].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["clsx"],
  },
  headers: async () => [
    {
      source: "/:path((?!embed(?:/|$)).*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Content-Security-Policy", value: protectedContentSecurityPolicy }
      ]
    },
    {
      source: "/embed/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy }
      ]
    },
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store" }
      ]
    }
  ]
};

export default nextConfig;
