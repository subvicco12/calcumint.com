import { NextResponse } from "next/server";
import { z } from "zod";
import { isDeepStrictEqual } from "node:util";
import { serverEnv } from "@/lib/env";
import { verifyPaddleSignature, selectionForPriceId, paddleRequest } from "@/lib/billing/paddle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Json = Record<string, unknown>;
const eventSchema = z.object({
  event_id: z.string().min(1), event_type: z.string().min(1),
  occurred_at: z.iso.datetime({ offset: true }).optional(),
  data: z.record(z.string(), z.unknown())
});
const fenceSchema = z.string().regex(/^(0|[1-9]\d*)$/).refine(value => BigInt(value) <= 9223372036854775807n);
const outcomeSchema = z.object({ status: z.enum(["applied", "duplicate"]), revision: fenceSchema });
function asObject(value: unknown): Json { return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Json : {}; }
function stringValue(value: unknown): string | null { return typeof value === "string" && value.trim().length > 0 ? value : null; }
function extractPriceId(data: Json): string | null {
  const first = asObject(Array.isArray(data.items) ? data.items[0] : null);
  return stringValue(asObject(first.price).id) ?? stringValue(first.price_id);
}
const unavailable = () => NextResponse.json({ error: "Could not synchronize billing; retry later" }, { status: 503 });

export async function POST(request: Request) {
  const secret = serverEnv.PADDLE_WEBHOOK_SECRET;
  const admin = createSupabaseAdminClient();
  if (!secret || !admin) return NextResponse.json({ error: "Billing webhook is not configured" }, { status: 503 });
  const rawBody = await request.text();
  if (!verifyPaddleSignature(rawBody, request.headers.get("paddle-signature") ?? "", secret))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid event payload" }, { status: 400 }); }
  const parsed = eventSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  const event = parsed.data;
  try {
    if (event.event_type.startsWith("subscription.")) {
      const userId = stringValue(asObject(event.data.custom_data).calcumint_user_id);
      const subscriptionId = stringValue(event.data.id);
      if (!userId || !subscriptionId || !z.uuid().safeParse(userId).success)
        return NextResponse.json({ error: "Missing subscription identity" }, { status: 400 });
      // This fence must be obtained before the provider request. A failed CAS never
      // retries the old snapshot using a newly read fence.
      const fence = await admin.rpc("read_billing_fence_v1", { p_user_id: userId });
      const revision = fenceSchema.safeParse(fence.data);
      if (fence.error || !revision.success) return unavailable();
      let snapshot: Json;
      try { snapshot = asObject(await paddleRequest<unknown>(`/subscriptions/${encodeURIComponent(subscriptionId)}`, { method: "GET" })); }
      catch { return NextResponse.json({ error: "Could not verify subscription" }, { status: 502 }); }
      if (stringValue(snapshot.id) !== subscriptionId || stringValue(asObject(snapshot.custom_data).calcumint_user_id) !== userId)
        return NextResponse.json({ error: "Subscription identity mismatch" }, { status: 409 });
      if (!stringValue(snapshot.customer_id) || !stringValue(snapshot.status))
        return NextResponse.json({ error: "Incomplete subscription evidence" }, { status: 502 });
      const period = asObject(snapshot.current_billing_period);
      if (snapshot.current_billing_period != null && (!z.iso.datetime({ offset: true }).safeParse(period.starts_at).success || !z.iso.datetime({ offset: true }).safeParse(period.ends_at).success))
        return NextResponse.json({ error: "Invalid subscription period" }, { status: 502 });
      if (snapshot.scheduled_change != null && !stringValue(asObject(snapshot.scheduled_change).action))
        return NextResponse.json({ error: "Invalid scheduled change" }, { status: 502 });
      const priceId = extractPriceId(snapshot);
      const selection = selectionForPriceId(priceId);
      if (!selection || !priceId) return NextResponse.json({ error: "Unknown Paddle subscription price" }, { status: 400 });
      const result = await admin.rpc("apply_verified_billing_event_v1", {
        p_user_id: userId, p_expected_revision: revision.data,
        p_event: event, p_snapshot: snapshot, p_price_id: priceId,
        p_plan: selection.plan, p_interval: selection.interval
      });
      if (result.error) {
        // A concurrent write, deadlock, missing RPC or uncertain transport outcome
        // must be reconciled by a fresh delivery, never by separate REST writes.
        if (result.error.code === "40001" || result.error.code === "40P01") return unavailable();
        return unavailable();
      }
      const outcome = outcomeSchema.safeParse(result.data);
      if (!outcome.success) return unavailable();
      return NextResponse.json({ ok: true, ...(outcome.data.status === "duplicate" ? { duplicate: true } : {}) });
    }
    // Other signed notification types do not alter entitlements. Their receipt
    // remains an independent insert until the entire receipt family is migrated.
    const existing = await admin.from("billing_webhook_events").select("event_id,payload").eq("event_id", event.event_id).maybeSingle();
    if (existing.error) return unavailable();
    if (existing.data) {
      const stored = eventSchema.safeParse(existing.data.payload);
      if (!stored.success) return unavailable();
      if (!isDeepStrictEqual(stored.data, event)) return NextResponse.json({ error: "Webhook event identity conflict" }, { status: 409 });
      return NextResponse.json({ ok: true, duplicate: true });
    }
    const receipt = await admin.from("billing_webhook_events").insert({ event_id: event.event_id, event_type: event.event_type, occurred_at: event.occurred_at ?? null, payload: event });
    if (receipt.error) return unavailable();
    return NextResponse.json({ ok: true });
  } catch { return unavailable(); }
}
