import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const nextConfig = readFileSync("next.config.ts", "utf8");
const robots = readFileSync("src/app/robots.ts", "utf8");
const health = readFileSync("src/app/health/route.ts", "utf8");
const envExample = readFileSync(".env.example", "utf8");
const checkoutButton = readFileSync("src/components/pro-checkout-button.tsx", "utf8");
const accountPage = readFileSync("src/app/account/page.tsx", "utf8");
const billingSyncStatus = readFileSync("src/components/billing-sync-status.tsx", "utf8");
const pricingPage = readFileSync("src/app/pricing/page.tsx", "utf8");

describe("B12 production hardening contracts", () => {
  it("ships essential browser and transport security headers", () => {
    expect(nextConfig).toMatch(/Strict-Transport-Security/i);
    expect(nextConfig).toMatch(/Content-Security-Policy/i);
    expect(nextConfig).toMatch(/X-Content-Type-Options/i);
    expect(nextConfig).toMatch(/Referrer-Policy/i);
    expect(nextConfig).toMatch(/Permissions-Policy/i);
    expect(nextConfig).toMatch(/Cross-Origin-Opener-Policy/i);
    expect(nextConfig).toMatch(/X-Frame-Options[\s\S]*SAMEORIGIN/i);
    expect(nextConfig).toMatch(/frame-ancestors 'self'/i);
    expect(nextConfig).toMatch(/source:\s*"\/embed\/:path\*"[\s\S]*Content-Security-Policy/i);
  });

  it("prevents API caching and search indexing of private surfaces", () => {
    expect(nextConfig).toMatch(/source:\s*"\/api\/:path\*"[\s\S]*Cache-Control[\s\S]*no-store/i);
    for (const path of ["/account", "/account/", "/admin", "/admin/", "/business", "/business/", "/api", "/api/"]) {
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

  it("handles both new checkout and in-place subscription update responses", () => {
    expect(checkoutButton).toMatch(/payload\.updated/);
    expect(checkoutButton).toMatch(/billing=updated/);
    expect(checkoutButton).toMatch(/plan=\$\{plan\}.*interval=\$\{interval\}/);
    expect(checkoutButton).toMatch(/payload\.checkoutUrl/);
  });

  it("does not present unsupported deferred downgrades as actionable", () => {
    expect(pricingPage).toMatch(/subscriptionChangeMode/);
    expect(pricingPage).toMatch(/mode === "deferred"/);
    expect(pricingPage).toMatch(/contact billing support to schedule this change/);
    expect(checkoutButton).toMatch(/disabled=\{busy \|\| Boolean\(disabledReason\)\}/);
  });

  it("keeps in-place upgrades pending until the Paddle webhook state matches", () => {
    expect(accountPage).toMatch(/billingSyncPending/);
    expect(accountPage).toMatch(/plan !== requestedPlan/);
    expect(accountPage).toMatch(/subscription\?\.plan !== requestedPlan/);
    expect(accountPage).toMatch(/subscription\?\.billing_interval !== requestedInterval/);
    expect(billingSyncStatus).toMatch(/router\.refresh\(\)/);
    expect(billingSyncStatus).toMatch(/Do not submit the change again/);
  });
});
