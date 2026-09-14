import { z } from "zod";

export const embedConfigInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  allowedDomains: z.array(z.string().trim().toLowerCase().min(1).max(253)).max(25).default([]),
  allowDirect: z.boolean().default(true),
  companyName: z.string().trim().max(120).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#0b7a66"),
  hideCalcumintBrand: z.boolean().default(false),
  ctaLabel: z.string().trim().max(80).nullable().optional(),
  ctaUrl: z.string().url().nullable().optional(),
  leadCaptureEnabled: z.boolean().default(false),
  leadFields: z.array(z.enum(["name", "email", "phone", "company"])).min(1).max(4).default(["name", "email"]),
  consentText: z.string().trim().max(1000).nullable().optional(),
  privacyUrl: z.string().url().nullable().optional()
}).superRefine((value, ctx) => {
  if (value.leadCaptureEnabled && !value.consentText) {
    ctx.addIssue({ code: "custom", path: ["consentText"], message: "Consent text is required when lead capture is enabled" });
  }
  if ((value.ctaLabel && !value.ctaUrl) || (!value.ctaLabel && value.ctaUrl)) {
    ctx.addIssue({ code: "custom", path: ["ctaUrl"], message: "CTA label and URL must be provided together" });
  }
});

export const publicLeadSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  consented: z.literal(true),
  input: z.record(z.string(), z.unknown()).optional(),
  output: z.record(z.string(), z.unknown()).optional(),
  sourceUrl: z.string().url().max(2048).optional()
});

export const embedEventSchema = z.object({
  type: z.enum(["view", "calculate", "cta_click"]),
  sourceUrl: z.string().url().max(2048).optional(),
  referrer: z.string().url().max(2048).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export function normalizeAllowedDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^www\./, "").split("/")[0];
  }
}
