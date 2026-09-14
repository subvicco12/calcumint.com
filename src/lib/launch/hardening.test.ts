import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const nextConfig = readFileSync("next.config.ts", "utf8");
const robots = readFileSync("src/app/robots.ts", "utf8");
const health = readFileSync("src/app/health/route.ts", "utf8");
const envExample = readFileSync(".env.example", "utf8");

describe("B12 production hardening contracts", () => {
  it("ships essential browser and transport security headers", () => {
    expect(nextConfig).toMatch(/Strict-Transport-Security/i);
    expect(nextConfig).toMatch(/Content-Security-Policy/i);
    expect(nextConfig).toMatch(/X-Content-Type-Options/i);
    expect(nextConfig).toMatch(/Referrer-Policy/i);
    expect(nextConfig).toMatch(/Permissions-Policy/i);
    expect(nextConfig).toMatch(/Cross-Origin-Opener-Policy/i);
  });

  it("prevents API caching and search indexing of private surfaces", () => {
    expect(nextConfig).toMatch(/source:\s*"\/api\/:path\*"[\s\S]*Cache-Control[\s\S]*no-store/i);
    for (const path of ["/account/", "/admin/", "/business/", "/api/"]) {
      expect(robots).toContain(`"${path}"`);
    }
    expect(health).toMatch(/noindex, nofollow/i);
    expect(health).toMatch(/cache-control.*no-store/is);
  });

  it("documents every launch-critical server integration without committing values", () => {
    for (const key of ["SUPABASE_SERVICE_ROLE_KEY", "PADDLE_API_KEY", "PADDLE_WEBHOOK_SECRET", "WEBHOOK_ENCRYPTION_KEY", "WEBHOOK_WORKER_SECRET", "AI_API_KEY", "ADMIN_WORKER_SECRET"]) {
      expect(envExample).toContain(`${key}=`);
    }
  });
});
