import { NextResponse } from "next/server";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { verifyPaddleSignature, getProPriceId } from "@/lib/billing/paddle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { planForSubscriptionStatus } from "@/lib/billing/entitlements";

type Json = Record<string, unknown>;

const eventSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  occurred_at: z.string().optional(),
  data: z.record(z.string(), z.unknown())
});

function asObject(value: unknown): Json {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Json : {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function extractPriceId(data: Json): string | null {
  const items = Array.isArray(data.items) ? data.items : [];
  const first = asObject(items[0]);
  const price = asObject(first.price);
  return stringValue(price.id) ?? stringValue(first.price_id);
}

function intervalForPrice(priceId: string | null): "monthly" | "yearly" | null {
  if (!priceId) return null;
  if (priceId === getProPriceId("monthly")) return "monthly";
  if (priceId === getProPriceId("yearly")) return "yearly";
  return null;
}

export async function POST(request: Request) {
  const secret = serverEnv.PADDLE_WEBHOOK_SECRET;
  const admin = createSupabaseAdminClient();
  if (!secret || !admin) return NextResponse.json({ error: "Billing webhook is not configured" }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";
  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(JSON.parse(rawBody));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });

  const event = parsed.data;
  const { data: existing } = await admin.from("billing_webhook_events").select("event_id").eq("event_id", event.event_id).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  const data = event.data;
  const customData = asObject(data.custom_data);
  const userId = stringValue(customData.calcumint_user_id);
  const requestedPlan = stringValue(customData.calcumint_plan) === "business" ? "business" : "pro";

  if (event.event_type.startsWith("subscription.") && userId) {
    const subscriptionId = stringValue(data.id);
    const customerId = stringValue(data.customer_id);
    const status = stringValue(data.status) ?? "unknown";
    const priceId = extractPriceId(data);
    const interval = intervalForPrice(priceId) ?? (stringValue(customData.billing_interval) as "monthly" | "yearly" | null);
    const period = asObject(data.current_billing_period);
    const scheduledChange = asObject(data.scheduled_change);

    if (customerId) {
      await admin.from("billing_customers").upsert({
        user_id: userId,
        paddle_customer_id: customerId,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
    }

    if (subscriptionId) {
      await admin.from("subscriptions").upsert({
        user_id: userId,
        provider_subscription_id: subscriptionId,
        provider_customer_id: customerId,
        price_id: priceId,
        plan: requestedPlan,
        billing_interval: interval,
        status,
        current_period_start: stringValue(period.starts_at),
        current_period_end: stringValue(period.ends_at),
        cancel_at_period_end: stringValue(scheduledChange.action) === "cancel",
        updated_at: new Date().toISOString()
      }, { onConflict: "provider_subscription_id" });

      await admin.from("profiles").update({
        plan: planForSubscriptionStatus(status, requestedPlan),
        updated_at: new Date().toISOString()
      }).eq("id", userId);
    }
  }

  const { error: eventError } = await admin.from("billing_webhook_events").insert({
    event_id: event.event_id,
    event_type: event.event_type,
    occurred_at: event.occurred_at ?? null,
    payload: event
  });

  if (eventError) return NextResponse.json({ error: "Could not record webhook" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
