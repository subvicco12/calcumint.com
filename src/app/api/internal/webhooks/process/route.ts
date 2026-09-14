import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env";
import { decryptWebhookSecret, nextWebhookRetry, webhookHeaders } from "@/lib/api/webhooks";

export async function POST(request: Request) {
  const workerSecret = serverEnv.WEBHOOK_WORKER_SECRET;
  const encryptionKey = serverEnv.WEBHOOK_ENCRYPTION_KEY;
  if (!workerSecret || !encryptionKey) return NextResponse.json({ error: "Webhook worker is not configured" }, { status: 503 });
  if (request.headers.get("x-calcumint-worker-secret") !== workerSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Webhook worker unavailable" }, { status: 503 });
  const { data: deliveries, error } = await admin
    .from("webhook_deliveries")
    .select("id,endpoint_id,event_type,event_id,payload,attempt_count")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let delivered = 0;
  let failed = 0;
  for (const delivery of deliveries ?? []) {
    const { data: endpoint } = await admin
      .from("business_webhook_endpoints")
      .select("endpoint_url,secret_ciphertext,status")
      .eq("id", delivery.endpoint_id)
      .maybeSingle();
    if (!endpoint || endpoint.status !== "active") continue;

    const attempt = Number(delivery.attempt_count) + 1;
    await admin.from("webhook_deliveries").update({ status: "delivering", attempt_count: attempt }).eq("id", delivery.id);
    try {
      const payload = JSON.stringify({
        id: delivery.event_id,
        type: delivery.event_type,
        created_at: new Date().toISOString(),
        data: delivery.payload
      });
      const secret = decryptWebhookSecret(String(endpoint.secret_ciphertext), encryptionKey);
      const response = await fetch(String(endpoint.endpoint_url), {
        method: "POST",
        headers: webhookHeaders(secret, payload),
        body: payload,
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      delivered += 1;
      await admin.from("webhook_deliveries").update({ status: "delivered", last_http_status: response.status, last_error: null, delivered_at: new Date().toISOString() }).eq("id", delivery.id);
    } catch (sendError) {
      failed += 1;
      const deadLetter = attempt >= 8;
      await admin.from("webhook_deliveries").update({
        status: deadLetter ? "dead_letter" : "failed",
        last_error: sendError instanceof Error ? sendError.message.slice(0, 500) : "Webhook delivery failed",
        next_attempt_at: nextWebhookRetry(attempt).toISOString()
      }).eq("id", delivery.id);
    }
  }

  return NextResponse.json({ processed: (deliveries ?? []).length, delivered, failed });
}
