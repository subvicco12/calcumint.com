import { describe, expect, it } from "vitest";
import { buildProductionReadinessReport, summarizeReadiness } from "./readiness";

const validEnv: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://calcumint.com",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  NEXT_PUBLIC_PADDLE_ENV: "production",
  PADDLE_API_KEY: "paddle",
  PADDLE_WEBHOOK_SECRET: "webhook",
  PADDLE_PRO_MONTHLY_PRICE_ID: "pri_pro_month",
  PADDLE_PRO_YEARLY_PRICE_ID: "pri_pro_year",
  PADDLE_BUSINESS_MONTHLY_PRICE_ID: "pri_business_month",
  PADDLE_BUSINESS_YEARLY_PRICE_ID: "pri_business_year",
  WEBHOOK_ENCRYPTION_KEY: "12345678901234567890123456789012",
  WEBHOOK_WORKER_SECRET: "worker-secret-1234",
  AI_PROVIDER: "provider",
  AI_BASE_URL: "https://api.example.com",
  AI_MODEL: "model",
  AI_API_KEY: "ai-key",
  ADMIN_WORKER_SECRET: "admin-worker-1234"
};

describe("production readiness", () => {
  it("passes only when launch-critical production configuration exists", () => {
    const report = buildProductionReadinessReport(validEnv);
    expect(report.ready).toBe(true);
    expect(summarizeReadiness(report).failed).toBe(0);
  });

  it("blocks launch when required secrets or production billing mode are missing", () => {
    const report = buildProductionReadinessReport({ ...validEnv, SUPABASE_SERVICE_ROLE_KEY: "", NEXT_PUBLIC_PADDLE_ENV: "sandbox" });
    expect(report.ready).toBe(false);
    expect(report.checks.find((check) => check.id === "env:SUPABASE_SERVICE_ROLE_KEY")?.ok).toBe(false);
    expect(report.checks.find((check) => check.id === "paddle:production")?.ok).toBe(false);
  });

  it("blocks launch when either Business billing price is missing", () => {
    const report = buildProductionReadinessReport({ ...validEnv, PADDLE_BUSINESS_YEARLY_PRICE_ID: "" });
    expect(report.ready).toBe(false);
    expect(report.checks.find((check) => check.id === "env:PADDLE_BUSINESS_YEARLY_PRICE_ID")?.ok).toBe(false);
  });

  it("rejects a non-canonical or insecure production URL", () => {
    const report = buildProductionReadinessReport({ ...validEnv, NEXT_PUBLIC_SITE_URL: "http://preview.example.com" });
    expect(report.ready).toBe(false);
    expect(report.checks.find((check) => check.id === "site:https")?.ok).toBe(false);
    expect(report.checks.find((check) => check.id === "site:canonical-host")?.ok).toBe(false);
  });
});
