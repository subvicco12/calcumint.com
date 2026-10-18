import { NextResponse } from "next/server";
import { z } from "zod";
import { isDeepStrictEqual } from "node:util";
import { serverEnv } from "@/lib/env";
import { verifyPaddleSignature, selectionForPriceId, paddleRequest } from "@/lib/billing/paddle";
import { processAtomicBillingWebhook } from "@/lib/billing/atomic-webhook";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const eventSchema = z.object({
  event_id: z.string().min(1), event_type: z.string().min(1),
  occurred_at: z.iso.datetime({ offset: true }).optional(),
  data: z.record(z.string(), z.unknown())
});
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
      const result = await processAtomicBillingWebhook({rawBody,signature:request.headers.get("paddle-signature")??""},{
        enabled:true,secret,
        rpc:async(name,args)=>await admin.rpc(name,args),
        fetchSubscription:id=>paddleRequest(`/subscriptions/${encodeURIComponent(id)}`,{method:"GET"}),
        selectionForPriceId
      });
      if(result.outcome === "applied" || result.outcome === "duplicate")
        return NextResponse.json({ok:true,...(result.outcome === "duplicate"?{duplicate:true}:{})});
      if(result.outcome === "invalid_receipt")return NextResponse.json({error:"Invalid subscription receipt"},{status:400});
      if(result.outcome === "identity_conflict" || result.outcome === "review_required")return NextResponse.json({error:"Billing evidence requires review"},{status:409});
      if(result.outcome === "invalid_selection")return NextResponse.json({error:"Unknown subscription price"},{status:400});
      if(result.outcome === "invalid_snapshot" || result.outcome === "provider_unavailable")return NextResponse.json({error:"Could not verify subscription"},{status:502});
      return unavailable();
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
