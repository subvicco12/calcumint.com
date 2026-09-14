import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  PADDLE_API_KEY: z.string().min(1).optional(),
  PADDLE_WEBHOOK_SECRET: z.string().min(1).optional(),
  PADDLE_PRO_MONTHLY_PRICE_ID: z.string().min(1).optional(),
  PADDLE_PRO_YEARLY_PRICE_ID: z.string().min(1).optional(),
  WEBHOOK_ENCRYPTION_KEY: z.string().min(16).optional(),
  WEBHOOK_WORKER_SECRET: z.string().min(16).optional(),
  AI_PROVIDER: z.string().min(1).optional(),
  AI_BASE_URL: z.string().url().optional(),
  AI_MODEL: z.string().min(1).optional(),
  AI_API_KEY: z.string().min(1).optional()
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR: z.string().min(1).optional()
});

export const serverEnv = serverSchema.parse(process.env);
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_PADDLE_ENV: process.env.NEXT_PUBLIC_PADDLE_ENV,
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR
});
