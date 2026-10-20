import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { signEmbedSession } from "./session";

const secret = "test-only-embed-session-secret-with-adequate-length";
const configId = "11111111-1111-4111-8111-111111111111";
const calculatorId = "22222222-2222-4222-8222-222222222222";
const organizationId = "33333333-3333-4333-8333-333333333333";
const key = "public-test-key";
const claims = { configId, calculatorId, organizationId, version: 2 };
const state = vi.hoisted(() => ({
  config: null as Record<string, unknown> | null,
  calculator: null as Record<string, unknown> | null,
  dbError: false,
  consentError: false,
  leadError: false,
  eventError: false,
  rpcError: false,
  rpcCode: null as string|null,
  rpcPayload: null as Record<string,unknown>|null,
  writes: [] as string[]
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    async rpc(_name:string,args:Record<string,unknown>){state.rpcPayload=args;state.writes.push("atomic_lead_rpc");return {data:state.consentError||state.leadError||state.rpcError||state.rpcCode?null:{status:"created",lead_id:configId},error:state.consentError||state.leadError||state.rpcError||state.rpcCode?{code:state.rpcCode??"PGRST202"}:null};},
    from(table: string) {
      const filters: Array<[string, unknown]> = [];
      const chain = {
        select() { return chain; },
        eq(field: string, value: unknown) { filters.push([field, value]); return chain; },
        async maybeSingle() {
          if (state.dbError) return { data: null, error: { message: "Database unavailable" } };
          const record = table === "embed_configs" ? state.config : state.calculator;
          return { data: record && filters.every(([field, value]) => record[field] === value) ? record : null, error: null };
        },
        insert() {
          state.writes.push(table);
          const error = (table === "lead_consents" && state.consentError) || (table === "embed_events" && state.eventError) || (table === "embed_leads" && state.leadError) ? { message: "Simulated write failure" } : null;
          return { error, select: () => ({ single: async () => ({ data: error ? null : { id: configId }, error }) }) };
        }
      };
      return chain;
    }
  })
}));

function token(expiresAt = Date.now() + 5 * 60_000) { return signEmbedSession({ ...claims, expiresAt }, secret); }
function request(path: string, body: unknown, session: string | null = token()) {
  return new NextRequest(`https://calcumint.com/api/embed/${key}/${path}`, {
    method: "POST", headers: { "content-type": "application/json", "Idempotency-Key":"66666666-6666-4666-8666-666666666666", ...(session ? { "x-embed-session": session } : {}) }, body: JSON.stringify(path === "leads" && body && typeof body === "object" ? {consentText:"I agree",privacyUrl:null,...body} : body)
  });
}
const context = { params: Promise.resolve({ key }) };

beforeEach(() => {
  process.env.EMBED_SESSION_SECRET = secret;
  state.config = { id: configId, organization_id: organizationId, calculator_id: calculatorId, status: "active", public_key: key, lead_capture_enabled: true, lead_fields: ["email"], consent_text: "I agree" };
  state.calculator = { id: calculatorId, organization_id: organizationId, status: "published", published_version: 2 };
  state.dbError = false;
  state.consentError = false;
  state.leadError = false;
  state.eventError = false;
  state.writes.length = 0;
  state.rpcError=false;state.rpcCode=null;state.rpcPayload=null;
});
afterEach(() => { delete process.env.EMBED_SESSION_SECRET; vi.useRealTimers(); });

describe("public embed API HTTP behavior (mock database, no writes)", () => {
  it("renews a valid session, but rejects expired sessions", async () => {
    const { POST } = await import("@/app/api/embed/[key]/session/route");
    expect((await POST(request("session", {}, token()), context)).status).toBe(200);
    expect((await POST(request("session", {}, token(Date.now() - 1000)), context)).status).toBe(403);
    expect(state.writes).toEqual([]);
  });
  it("rejects publication revocation and changed published version on renewal", async () => {
    const { POST } = await import("@/app/api/embed/[key]/session/route");
    state.calculator = null;
    expect((await POST(request("session", {}), context)).status).toBe(404);
    state.calculator = { id: calculatorId, organization_id: organizationId, status: "published", published_version: 3 };
    expect((await POST(request("session", {}), context)).status).toBe(404);
  });
  it("fails closed on database errors", async () => {
    const { POST } = await import("@/app/api/embed/[key]/session/route");
    state.dbError = true;
    expect((await POST(request("session", {}), context)).status).toBe(404);
  });
  it("accepts valid iframe-originated event and lead submissions", async () => {
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    const { POST: lead } = await import("@/app/api/embed/[key]/leads/route");
    expect((await event(request("events", { type: "view" }), context)).status).toBe(200);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(200);
    expect(state.writes).toContain("embed_events");
    expect(state.writes).toContain("atomic_lead_rpc");
  });
  it("rejects invalid sessions, malformed events and unpublished calculators before writes", async () => {
    const { POST } = await import("@/app/api/embed/[key]/events/route");
    expect((await POST(request("events", { type: "view" }, null), context)).status).toBe(403);
    expect((await POST(request("events", { type: "invalid" }), context)).status).toBe(400);
    state.calculator = null;
    expect((await POST(request("events", { type: "view" }), context)).status).toBe(404);
    expect(state.writes).toEqual([]);
  });
  it("refuses a renewal when the embed is disabled or its organization changes", async () => {
    const { POST } = await import("@/app/api/embed/[key]/session/route");
    state.config = null;
    expect((await POST(request("session", {}), context)).status).toBe(404);
    state.config = { id: configId, organization_id: "44444444-4444-4444-8444-444444444444", calculator_id: calculatorId };
    expect((await POST(request("session", {}), context)).status).toBe(404);
    expect(state.writes).toEqual([]);
  });
  it("returns a fresh signed capability after renewal and refuses a revoked version for event and lead routes", async () => {
    const { POST: renew } = await import("@/app/api/embed/[key]/session/route");
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    const { POST: lead } = await import("@/app/api/embed/[key]/leads/route");
    const response = await renew(request("session", {}), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(typeof body.sessionToken).toBe("string");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await event(request("events", { type: "view" }, body.sessionToken), context)).status).toBe(200);
    state.writes.length = 0;
    state.calculator = { id: calculatorId, organization_id: organizationId, status: "published", published_version: 3 };
    expect((await event(request("events", { type: "view" }, body.sessionToken), context)).status).toBe(404);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }, body.sessionToken), context)).status).toBe(404);
    expect(state.writes).toEqual([]);
  });
  it("rejects expired event and lead tokens before any writes", async () => {
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    const { POST: lead } = await import("@/app/api/embed/[key]/leads/route");
    const expired = token(Date.now() - 1000);
    expect((await event(request("events", { type: "view" }, expired), context)).status).toBe(403);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }, expired), context)).status).toBe(403);
    expect(state.writes).toEqual([]);
  });

  it("rejects forged session signatures and mismatched calculator bindings", async () => {
    const { POST: renew } = await import("@/app/api/embed/[key]/session/route");
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    const { POST: lead } = await import("@/app/api/embed/[key]/leads/route");
    const forged = token() + "x";
    expect((await renew(request("session", {}, forged), context)).status).toBe(403);
    expect((await event(request("events", { type: "view" }, forged), context)).status).toBe(403);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }, forged), context)).status).toBe(403);
    state.config = { id: configId, organization_id: organizationId, calculator_id: "55555555-5555-4555-8555-555555555555", lead_capture_enabled: true };
    expect((await renew(request("session", {}), context)).status).toBe(404);
    expect((await event(request("events", { type: "view" }), context)).status).toBe(404);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(404);
    expect(state.writes).toEqual([]);
  });
  it("fails closed when signing secret is unavailable", async () => {
    const { POST: renew } = await import("@/app/api/embed/[key]/session/route");
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    delete process.env.EMBED_SESSION_SECRET;
    expect((await renew(request("session", {}), context)).status).toBe(403);
    expect((await event(request("events", { type: "view" }), context)).status).toBe(403);
    expect(state.writes).toEqual([]);
  });

  it("rejects inactive embeds and draft calculators through actual query filters", async () => {
    const { POST: renew } = await import("@/app/api/embed/[key]/session/route");
    const { POST: event } = await import("@/app/api/embed/[key]/events/route");
    const { POST: lead } = await import("@/app/api/embed/[key]/leads/route");
    state.config = { ...state.config, status: "inactive" };
    expect((await renew(request("session", {}), context)).status).toBe(404);
    expect((await event(request("events", { type: "view" }), context)).status).toBe(404);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(404);
    state.config = { ...state.config, status: "active" };
    state.calculator = { ...state.calculator, status: "draft" };
    expect((await renew(request("session", {}), context)).status).toBe(404);
    expect((await event(request("events", { type: "view" }), context)).status).toBe(404);
    expect((await lead(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(404);
    expect(state.writes).toEqual([]);
  });

  it("does not report success or emit a lead-submit event if consent persistence fails", async () => {
    const { POST } = await import("@/app/api/embed/[key]/leads/route");
    state.consentError = true;
    const response = await POST(request("leads", { consented: true, email: "example@example.com" }), context);
    expect(response.status).toBe(503);
    expect(state.writes).toEqual(["atomic_lead_rpc"]);
    expect(state.writes).not.toContain("embed_events");
  });

  it("rejects failed lead inserts without writing consent or analytics", async () => {
    const { POST } = await import("@/app/api/embed/[key]/leads/route");
    state.leadError = true;
    expect((await POST(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(503);
    expect(state.writes).toEqual(["atomic_lead_rpc"]);
  });

  it("returns success for a saved lead and consent when best-effort analytics fails", async () => {
    const { POST } = await import("@/app/api/embed/[key]/leads/route");
    state.eventError = true;
    expect((await POST(request("leads", { consented: true, email: "example@example.com" }), context)).status).toBe(200);
    expect(state.writes).toEqual(["atomic_lead_rpc"]);
  });

  it("fails closed when atomic storage is absent and never falls back to REST writes",async()=>{
    const {POST}=await import("@/app/api/embed/[key]/leads/route");state.rpcError=true;
    expect((await POST(request("leads",{consented:true,email:"example@example.com"}),context)).status).toBe(503);
    expect(state.writes).toEqual(["atomic_lead_rpc"]);
  });
  it("rejects a missing idempotency key before storage writes",async()=>{
    const {POST}=await import("@/app/api/embed/[key]/leads/route");const req=request("leads",{consented:true,email:"example@example.com"});req.headers.delete("Idempotency-Key");
    expect((await POST(req,context)).status).toBe(400);expect(state.writes).toEqual([]);
  });
  it("requires displayed consent evidence and forwards its exact literals",async()=>{
    const {POST}=await import("@/app/api/embed/[key]/leads/route");
    expect((await POST(request("leads",{consented:true,email:"example@example.com",consentText:undefined}),context)).status).toBe(400);
    expect(state.writes).toEqual([]);
    expect((await POST(request("leads",{consented:true,email:"example@example.com",consentText:"I agree",privacyUrl:"https://example.invalid/privacy"}),context)).status).toBe(200);
    expect(state.rpcPayload?.p_payload).toMatchObject({consentText:"I agree",privacyUrl:"https://example.invalid/privacy"});
  });
  it("requires reload for stale displayed terms instead of splitting persistence",async()=>{
    const {POST}=await import("@/app/api/embed/[key]/leads/route");state.rpcCode="PT412";
    const reply=await POST(request("leads",{consented:true,email:"example@example.com"}),context);
    expect(reply.status).toBe(409);expect(await reply.json()).toMatchObject({code:"CONSENT_CHANGED"});expect(state.writes).toEqual(["atomic_lead_rpc"]);
  });
  it("returns failure when a standalone event insert fails", async () => {
    const { POST } = await import("@/app/api/embed/[key]/events/route");
    state.eventError = true;
    expect((await POST(request("events", { type: "view" }), context)).status).toBe(500);
    expect(state.writes).toEqual(["embed_events"]);
  });

});
