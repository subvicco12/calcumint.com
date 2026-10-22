import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
const state = vi.hoisted(() => ({ tables: {} as Record<string, {data: unknown; error: unknown}>, rejected: "", memberDetails: null as {data: unknown; error: unknown} | null }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({
  auth: {getUser: async () => ({data: {user: {id: "user-a"}}, error: null})},
  from: (table: string) => {
    let memberList = false;
    const query = {then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => (state.rejected === table ? Promise.reject(new Error("private transport detail")) : Promise.resolve(memberList && state.memberDetails ? state.memberDetails : state.tables[table] ?? {data: [], error: null})).then(resolve, reject), select: () => query, eq: (column: string) => {if(table === "organization_members" && column === "organization_id") memberList = true; return query;}, order: () => query, limit: () => query, maybeSingle: () => query, single: () => query};
    return query;
  }
}) }));
vi.mock("next/navigation", () => ({redirect: () => {throw new Error("LOGIN")}}));
vi.mock("./actions", () => ({createBusinessApiKey: vi.fn(), createWebhookEndpoint: vi.fn(), disableWebhookEndpoint: vi.fn(), revokeBusinessApiKey: vi.fn()}));
import BusinessApiPage from "./page";
const render = async () => renderToStaticMarkup(await BusinessApiPage({searchParams: Promise.resolve({})}));
beforeEach(() => {
  state.rejected = "";
  state.memberDetails = null;
  state.tables = {profiles: {data: {plan: "business"}, error: null}, organization_members: {data: [{organization_id: "org-a", role: "owner"}], error: null}, business_api_keys: {data: [{id: "key-1", name: "Existing automation", key_prefix: "prefix", status: "active"}], error: null}};
});
describe("Business API dashboard read recovery", () => {
  it.each(["profiles", "organization_members"])("does not redirect after a failed %s read", async table => {
    state.tables[table] = {data: null, error: {message: "private detail"}};
    const html = await render();
    expect(html).toContain("Business automation is temporarily unavailable");
    expect(html).toContain('href="/business/api"');
    expect(html).not.toContain("private detail");
    expect(html).not.toContain("Create API key");
  });
  it.each(["api_usage_events", "webhook_deliveries"])("distinguishes failed %s analytics from zero usage", async table => {
    state.tables[table] = {data: null, error: {message: "private detail"}};
    const html = await render();
    expect(html).toContain("Unavailable");
    expect(html).toContain("temporarily unavailable");
    expect(html).toContain("Existing automation");
    expect(html).not.toContain("private detail");
    expect(html).toContain('role="status"');
  });
  it.each([["business_api_keys", "No API keys yet.", "Create API key"], ["business_webhook_endpoints", "No webhook endpoints yet.", "Create webhook"]])("does not treat failed %s as empty", async (table, empty, create) => {
    state.tables[table] = {data: null, error: {message: "offline"}};
    const html = await render();
    expect(html).toContain("temporarily unavailable");
    expect(html).not.toContain(empty);
    expect(html).not.toContain(create);
  });
  it("isolates a rejected usage read and recovers the next visit", async () => {
    state.rejected = "api_usage_events";
    expect(await render()).toContain("API usage is temporarily unavailable");
    state.rejected = "";
    const html = await render();
    expect(html).not.toContain("API usage is temporarily unavailable");
    expect(html).toContain("Existing automation");
  });
  it("preserves verified empty usage and webhook state", async () => {
    const html = await render();
    expect(html).toContain("No webhook endpoints yet.");
    expect(html).toContain("Create webhook");
    expect(html).not.toContain("temporarily unavailable");
  });
});

it("never reflects URL credential values",async()=>{const html=renderToStaticMarkup(await BusinessApiPage({searchParams:Promise.resolve({created:"forged-api-secret",webhookSecret:"forged-webhook-secret"})}));expect(html).not.toContain("forged-api-secret");expect(html).not.toContain("forged-webhook-secret");});
