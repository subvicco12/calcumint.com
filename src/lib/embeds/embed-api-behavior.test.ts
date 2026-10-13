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
  writes: [] as string[]
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    from(table: string) {
      const chain = {
        select() { return chain; },
        eq() { return chain; },
        async maybeSingle() {
          if (state.dbError) return { data: null, error: { message: "Database unavailable" } };
          return { data: table === "embed_configs" ? state.config : state.calculator, error: null };
        },
        insert() {
          state.writes.push(table);
          return { error: null, select: () => ({ single: async () => ({ data: { id: configId }, error: null }) }) };
        }
      };
      return chain;
    }
  })
}));

function token(expiresAt = Date.now() + 5 * 60_000) { return signEmbedSession({ ...claims, expiresAt }, secret); }
function request(path: string, body: unknown, session: string | null = token()) {
  return new NextRequest(`https://calcumint.com/api/embed/${key}/${path}`, {
    method: "POST", headers: { "content-type": "application/json", ...(session ? { "x-embed-session": session } : {}) }, body: JSON.stringify(body)
  });
}
const context = { params: Promise.resolve({ key }) };

beforeEach(() => {
  process.env.EMBED_SESSION_SECRET = secret;
  state.config = { id: configId, organization_id: organizationId, calculator_id: calculatorId, lead_capture_enabled: true, lead_fields: ["email"], consent_text: "I agree" };
  state.calculator = { id: calculatorId, published_version: 2 };
  state.dbError = false;
  state.writes.length = 0;
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
    state.calculator = { published_version: 3 };
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
    expect(state.writes).toContain("embed_leads");
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
    state.calculator = { id: calculatorId, published_version: 3 };
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

});
