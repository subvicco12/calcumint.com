import { NextResponse } from "next/server";
import { z } from "zod";
import { isDeepStrictEqual } from "node:util";
import { serverEnv } from "@/lib/env";
import { verifyPaddleSignature, selectionForPriceId, paddleRequest } from "@/lib/billing/paddle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { planForSubscriptionStatus, paidSubscriptionStatuses } from "@/lib/billing/entitlements";

type Json = Record<string, unknown>;

const eventSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  occurred_at: z.iso.datetime({offset:true}).optional(),
  data: z.record(z.string(), z.unknown())
});

function asObject(value: unknown): Json {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Json : {};
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function extractPriceId(data: Json): string | null {
  const items = Array.isArray(data.items) ? data.items : [];
  const first = asObject(items[0]);
  const price = asObject(first.price);
  return stringValue(price.id) ?? stringValue(first.price_id);
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

  let payload:unknown;
  try { payload=JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid event payload" }, { status: 400 }); }
  const parsed = eventSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });

  const event = parsed.data;
  try {
  const { data: existing, error: lookupError } = await admin.from("billing_webhook_events").select("event_id,payload").eq("event_id", event.event_id).maybeSingle();
  if(lookupError)return NextResponse.json({error:"Could not verify webhook processing"},{status:500});
  if (existing) {
    const stored=eventSchema.safeParse(existing.payload);
    if(!stored.success)return NextResponse.json({error:"Could not verify recorded webhook"},{status:500});
    if(!isDeepStrictEqual(stored.data,event))return NextResponse.json({error:"Webhook event identity conflict"},{status:409});
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const customData = asObject(event.data.custom_data);
  const userId = stringValue(customData.calcumint_user_id);

  if (event.event_type.startsWith("subscription.")) {
    const subscriptionId = stringValue(event.data.id);
    if(!userId||!subscriptionId)return NextResponse.json({error:"Missing subscription identity"},{status:400});
    // Notifications may be delivered out of order. Reconcile current provider state,
    // rather than granting access from the historical notification snapshot.
    let data:Json;
    try { data=asObject(await paddleRequest<unknown>(`/subscriptions/${encodeURIComponent(subscriptionId)}`,{method:"GET"})); }
    catch { return NextResponse.json({error:"Could not verify subscription"},{status:502}); }
    if(stringValue(data.id)!==subscriptionId||stringValue(asObject(data.custom_data).calcumint_user_id)!==userId)return NextResponse.json({error:"Subscription identity mismatch"},{status:409});
    const customerId = stringValue(data.customer_id);
    const status = stringValue(data.status);
    if(!customerId||!status)return NextResponse.json({error:"Incomplete subscription evidence"},{status:502});
    const priceId = extractPriceId(data);
    const selection = selectionForPriceId(priceId);
    const period = asObject(data.current_billing_period);
    const scheduledChange = asObject(data.scheduled_change);
    if(data.current_billing_period!=null&&(!z.iso.datetime({offset:true}).safeParse(period.starts_at).success||!z.iso.datetime({offset:true}).safeParse(period.ends_at).success))return NextResponse.json({error:"Invalid subscription period"},{status:502});
    if(data.scheduled_change!=null&&!stringValue(scheduledChange.action))return NextResponse.json({error:"Invalid scheduled change"},{status:502});

    if (!selection) {
      return NextResponse.json({ error: "Unknown Paddle subscription price" }, { status: 400 });
    }

    const [boundSubscription,boundCustomer]=await Promise.all([
      admin.from("subscriptions").select("user_id").eq("provider_subscription_id",subscriptionId).maybeSingle(),
      admin.from("billing_customers").select("user_id").eq("paddle_customer_id",customerId).maybeSingle()
    ]);
    if(boundSubscription.error||boundCustomer.error)return NextResponse.json({error:"Could not verify billing ownership"},{status:500});
    if((boundSubscription.data&&boundSubscription.data.user_id!==userId)||(boundCustomer.data&&boundCustomer.data.user_id!==userId))return NextResponse.json({error:"Billing ownership mismatch"},{status:409});
    // Match checkout's existing billing-support gate; never invent an aggregate
    // entitlement or revoke another paid subscription from this notification.
    const otherPaid=await admin.from("subscriptions").select("provider_subscription_id").eq("user_id",userId).in("status",[...paidSubscriptionStatuses]).neq("provider_subscription_id",subscriptionId).limit(1).maybeSingle();
    if(otherPaid.error)return NextResponse.json({error:"Could not verify active subscriptions"},{status:500});
    if(otherPaid.data)return NextResponse.json({error:"Multiple paid subscriptions require billing support"},{status:409});

      const customerWrite=await admin.from("billing_customers").upsert({
        user_id: userId,
        paddle_customer_id: customerId,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if(customerWrite.error)return NextResponse.json({error:"Could not synchronize billing customer"},{status:500});

      const subscriptionValues={
        user_id: userId,
        provider_subscription_id: subscriptionId,
        provider_customer_id: customerId,
        price_id: priceId,
        plan: selection.plan,
        billing_interval: selection.interval,
        status,
        current_period_start: stringValue(period.starts_at),
        current_period_end: stringValue(period.ends_at),
        cancel_at_period_end: stringValue(scheduledChange.action) === "cancel",
        updated_at: new Date().toISOString()
      };
      // Never let an upsert reassign a subscription after the ownership read.
      const subscriptionWrite=boundSubscription.data
        ? await admin.from("subscriptions").update(subscriptionValues).eq("provider_subscription_id",subscriptionId).eq("user_id",userId).select("provider_subscription_id,user_id").single()
        : await admin.from("subscriptions").insert(subscriptionValues);
      if(subscriptionWrite.error)return NextResponse.json({error:"Could not synchronize subscription"},{status:500});

      const profileWrite=await admin.from("profiles").update({
        plan: planForSubscriptionStatus(status, selection.plan),
        updated_at: new Date().toISOString()
      }).eq("id", userId).select("id").single();
      if(profileWrite.error||profileWrite.data?.id!==userId)return NextResponse.json({error:"Could not synchronize account plan"},{status:500});
  }

  const { error: eventError } = await admin.from("billing_webhook_events").insert({
    event_id: event.event_id,
    event_type: event.event_type,
    occurred_at: event.occurred_at ?? null,
    payload: event
  });

  if (eventError) return NextResponse.json({ error: "Could not record webhook" }, { status: 500 });
  return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({error:"Could not process webhook"},{status:500}); }
}
