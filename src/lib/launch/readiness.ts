export type ReadinessCheck = {
  id: string;
  ok: boolean;
  message: string;
};

export type ReadinessReport = {
  ready: boolean;
  checks: ReadinessCheck[];
};

const requiredProductionEnv = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "PADDLE_API_KEY",
  "PADDLE_WEBHOOK_SECRET",
  "PADDLE_PRO_MONTHLY_PRICE_ID",
  "PADDLE_PRO_YEARLY_PRICE_ID",
  "WEBHOOK_ENCRYPTION_KEY",
  "WEBHOOK_WORKER_SECRET",
  "AI_PROVIDER",
  "AI_BASE_URL",
  "AI_MODEL",
  "AI_API_KEY",
  "ADMIN_WORKER_SECRET"
] as const;

function present(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function buildProductionReadinessReport(env: NodeJS.ProcessEnv = process.env): ReadinessReport {
  const checks: ReadinessCheck[] = requiredProductionEnv.map((key) => ({
    id: `env:${key}`,
    ok: present(env[key]),
    message: present(env[key]) ? `${key} configured` : `${key} missing`
  }));

  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "";
  checks.push({
    id: "site:https",
    ok: siteUrl.startsWith("https://"),
    message: siteUrl.startsWith("https://") ? "Production site URL uses HTTPS" : "Production site URL must use HTTPS"
  });
  checks.push({
    id: "site:canonical-host",
    ok: /^https:\/\/(www\.)?calcumint\.com\/?$/i.test(siteUrl),
    message: /^https:\/\/(www\.)?calcumint\.com\/?$/i.test(siteUrl) ? "Canonical production host is CalcuMint" : "NEXT_PUBLIC_SITE_URL must point to calcumint.com"
  });
  checks.push({
    id: "paddle:production",
    ok: env.NEXT_PUBLIC_PADDLE_ENV === "production",
    message: env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "Paddle production mode enabled" : "Paddle must be switched to production at launch"
  });

  return { ready: checks.every((check) => check.ok), checks };
}

export function summarizeReadiness(report: ReadinessReport) {
  return {
    ready: report.ready,
    total: report.checks.length,
    passed: report.checks.filter((check) => check.ok).length,
    failed: report.checks.filter((check) => !check.ok).length
  };
}
