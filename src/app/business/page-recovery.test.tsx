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
vi.mock("./actions", () => ({createOrganization: vi.fn(), createProject: vi.fn(), createClientWorkspace: vi.fn(), inviteMember: vi.fn()}));
import BusinessPage from "./page";
const render = async () => renderToStaticMarkup(await BusinessPage({searchParams: Promise.resolve({})}));
beforeEach(() => {
  state.rejected = "";
  state.memberDetails = null;
  state.tables = {profiles: {data: {plan: "business"}, error: null}, organization_members: {data: [{organization_id: "org-a", user_id: "user-a", role: "owner"}], error: null}, organizations: {data: {id: "org-a", name: "Acme"}, error: null}};
});
describe("Business dashboard read recovery", () => {
  it("does not downgrade a failed plan read to an upgrade prompt", async () => {
    state.tables.profiles = {data: null, error: {message: "private detail"}};
    const html = await render();
    expect(html).toContain("Plan details are temporarily unavailable");
    expect(html).not.toContain("Upgrade to Business");
    expect(html).not.toContain("private detail");
  });
  it("does not offer organization creation after a failed membership read", async () => {
    state.tables.organization_members = {data: null, error: {message: "offline"}};
    const html = await render();
    expect(html).toContain("Workspace membership is temporarily unavailable");
    expect(html).not.toContain("Create Business workspace");
    expect(html).toContain('href="/business"');
  });
  it("does not show an active workspace when organization details cannot load", async () => {
    state.tables.organizations = {data: null, error: {message: "offline"}};
    const html = await render();
    expect(html).toContain("Organization details are temporarily unavailable");
    expect(html).not.toContain("Business active");
    expect(html).not.toContain('name="organizationId"');
  });
  it.each([['business_projects', 'Projects', 'No projects yet.'], ['client_workspaces', 'Client workspaces', 'No client workspaces yet.'], ['organization_audit_log', 'Recent audit activity', 'No audit events yet.']])("isolates a failed %s section", async (table, label, empty) => {
    state.tables[table] = {data: null, error: {message: "private detail"}};
    const html = await render();
    expect(html).toContain(`${label} ${table === "organization_audit_log" ? "is" : "are"} temporarily unavailable`);
    expect(html).not.toContain(empty);
    expect(html).toContain("Acme");
    expect(html).not.toContain("private detail");
    expect(html).toContain('role="status"');
  });
  it("isolates a rejected project read and recovers on the next visit", async () => {
    state.rejected = "business_projects";
    expect(await render()).toContain("Projects are temporarily unavailable");
    state.rejected = "";
    state.tables.business_projects = {data: [{id: "p1", name: "Recovered project", status: "active"}], error: null};
    const html = await render();
    expect(html).toContain("Recovered project");
    expect(html).not.toContain("Projects are temporarily unavailable");
  });
  it("preserves genuine successful empty states", async () => {
    const html = await render();
    expect(html).toContain("No projects yet.");
    expect(html).toContain("No client workspaces yet.");
    expect(html).toContain("No audit events yet.");
  });
  it("preserves setup for a successfully empty membership read", async () => {
    state.tables.organization_members = {data: [], error: null};
    expect(await render()).toContain("Create Business workspace");
  });
});

it("keeps unknown member usage distinct from zero and suppresses invitations", async () => {
  state.memberDetails = {data: null, error: {message: "offline"}};
  const html = await render();
  expect(html).toContain("Seat usage unavailable");
  expect(html).toContain("Members are temporarily unavailable");
  expect(html).not.toContain("0 / 5");
  expect(html).not.toContain("Create invitation");
  expect(html).toContain("Create project");
});
it.each(["profiles", "organization_members", "organizations"])("recovers gracefully from a rejected %s read", async table => {
  state.rejected = table;
  const html = await render();
  expect(html).toContain("Workspace temporarily unavailable");
  expect(html).not.toContain("private transport detail");
  expect(html).not.toContain("Create Business workspace");
});
it("treats a missing profile as unavailable instead of assuming a Free plan", async () => {
  state.tables.profiles = {data: null, error: null};
  expect(await render()).toContain("Plan details are temporarily unavailable");
});
it("keeps a verified Free plan upgrade route", async () => {
  state.tables.profiles = {data: {plan: "free"}, error: null};
  expect(await render()).toContain("Upgrade to Business");
});
it("identifies bounded project and client counts as recent items shown", async () => {
  const html = await render();
  expect(html).toContain("Latest 12 projects shown");
  expect(html).toContain("Latest 12 client workspaces shown");
});
