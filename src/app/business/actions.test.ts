import { beforeEach, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  role: "owner" as unknown, membershipError: false, profileError: false, authError: false, throwTable: "",
  memberCount: 1 as unknown, pendingCount: 0 as unknown,
  memberError: false, pendingError: false,
  inserts: [] as { table: string; value: Record<string, unknown> }[],
  reads: [] as { table: string; filters: Record<string, unknown> }[],
  rpc: vi.fn(), revalidate: vi.fn(), redirect: vi.fn()
}));
vi.mock("next/cache", () => ({ revalidatePath: state.revalidate }));
vi.mock("next/navigation", () => ({ redirect: state.redirect }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({
  auth: { getUser: async () => ({ data: { user: { id: "user-a" } }, error: state.authError ? { message: "private diagnostic" } : null }) },
  rpc: state.rpc,
  from: (table: string) => {
    const filters: Record<string, unknown> = {};
    let countRead = false;
    const result = () => {
      state.reads.push({ table, filters });
      if (state.throwTable === table) throw new Error("Transport unavailable");
      if (table === "profiles") return { data: { plan: "business" }, error: state.profileError ? { message: "private diagnostic" } : null };
      if (!countRead) return { data: state.role === null ? null : { role: state.role }, error: state.membershipError ? { message: "private diagnostic" } : null };
      return { count: table === "organization_members" ? state.memberCount : state.pendingCount, error: (table === "organization_members" ? state.memberError : state.pendingError) ? { message: "private diagnostic" } : null };
    };
    const chain = {
      select: (_columns: string, options?: { count?: string }) => { countRead = !!options?.count; return chain; },
      eq: (key: string, value: unknown) => { filters[key] = value; return chain; },
      is: (key: string, value: unknown) => { filters[key] = value; return chain; },
      gt: (key: string, value: unknown) => { filters[key] = value; return chain; },
      maybeSingle: async () => result(),
      then: (resolve: (value: unknown) => unknown) => Promise.resolve(result()).then(resolve),
      insert: async (value: Record<string, unknown>) => { state.inserts.push({ table, value }); return { error: null }; }
    };
    return chain;
  }
}) }));
import { acceptInvitation, createClientWorkspace, createProject, inviteMember } from "./actions";

function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ organizationId: "org-requested", name: "Project A", email: "Person@Example.com", role: "member", token: "a".repeat(64) })) data.set(key, value);
  return data;
}
beforeEach(() => {
  Object.assign(state, { role: "owner", membershipError: false, profileError: false, authError: false, throwTable: "", memberCount: 1, pendingCount: 0, memberError: false, pendingError: false, inserts: [], reads: [] });
  state.rpc.mockReset().mockResolvedValue({ error: null }); state.revalidate.mockReset(); state.redirect.mockReset();
});

it.each(["memberError", "pendingError"] as const)("refuses invitation when %s prevents capacity verification", async key => {
  state[key] = true;
  await expect(inviteMember(form())).rejects.toThrow("Unable to verify Business seat availability");
  expect(state.inserts).toHaveLength(0); expect(state.redirect).not.toHaveBeenCalled();
});
it.each([null, undefined, -1, 1.5, "1", NaN, Infinity])("refuses malformed member capacity %s", async count => {
  state.memberCount = count;
  await expect(inviteMember(form())).rejects.toThrow("Unable to verify Business seat availability");
  expect(state.inserts).toHaveLength(0);
});
it.each([null, undefined, -1, 0.5, "0", NaN, Infinity])("refuses malformed pending capacity %s", async count => {
  state.pendingCount = count;
  await expect(inviteMember(form())).rejects.toThrow("Unable to verify Business seat availability");
  expect(state.inserts).toHaveLength(0);
});
it("counts pending seats at the limit and permits the last available seat", async () => {
  state.memberCount = 3; state.pendingCount = 2;
  await expect(inviteMember(form())).rejects.toThrow("five Business seats"); expect(state.inserts).toHaveLength(0);
  state.pendingCount = 1;
  await inviteMember(form());
  expect(state.inserts[0]).toMatchObject({ table: "organization_invitations", value: { organization_id: "org-requested", email: "person@example.com", role: "member", invited_by: "user-a" } });
  const redirect = state.redirect.mock.calls[0][0] as string;
  const token = new URL(redirect, "http://localhost").searchParams.get("invite")!;
  expect(token).toMatch(/^[a-f0-9]{64}$/); expect(state.inserts[0].value.token_hash).not.toBe(token);
});
it.each([inviteMember, createProject, createClientWorkspace])("denies missing, unknown or unavailable membership before writes", async action => {
  for (const role of [null, "unknown", "viewer", "member"]) {
    state.role = role;
    await expect(action(form())).rejects.toThrow("permission required");
  }
  state.role = "owner"; state.membershipError = true;
  await expect(action(form())).rejects.toThrow("permission required");
  expect(state.inserts).toHaveLength(0);
});
it.each([createProject, createClientWorkspace])("allows manager workspace creation only for the requested organization", async action => {
  state.role = "manager";
  await action(form());
  expect(state.inserts).toHaveLength(1);
  expect(state.reads).toContainEqual({ table: "organization_members", filters: { organization_id: "org-requested", user_id: "user-a" } });
});
it("does not allow managers to invite colleagues", async () => {
  state.role = "manager"; await expect(inviteMember(form())).rejects.toThrow("permission required"); expect(state.inserts).toHaveLength(0);
});
it.each([inviteMember, createProject, createClientWorkspace])("rejects failed entitlement read even with returned profile data", async action => {
  state.profileError = true; await expect(action(form())).rejects.toThrow("Business plan required"); expect(state.inserts).toHaveLength(0);
});
it.each(["", "a", "g".repeat(64), "a".repeat(63), "a".repeat(65), " "+"a".repeat(64)])("refuses malformed invitation token before RPC: %s", async token => {
  const data = form(); data.set("token", token);
  await expect(acceptInvitation(data)).rejects.toThrow("valid invitation token"); expect(state.rpc).not.toHaveBeenCalled();
});
it("passes only the digest of a valid invitation token to the existing acceptance RPC", async () => {
  await acceptInvitation(form());
  expect(state.rpc).toHaveBeenCalledWith("accept_business_invitation", { invite_token_hash: expect.stringMatching(/^[a-f0-9]{64}$/) });
  expect(state.rpc.mock.calls[0][1].invite_token_hash).not.toBe("a".repeat(64));
  expect(state.redirect).toHaveBeenCalledWith("/business");
});

it.each([inviteMember, createProject, createClientWorkspace, acceptInvitation])("rejects auth errors even when a user accompanies the failed read", async action => {
  state.authError = true;
  await expect(action(form())).rejects.toThrow("Authentication could not be verified");
  expect(state.inserts).toHaveLength(0); expect(state.rpc).not.toHaveBeenCalled(); expect(state.reads).toHaveLength(0);
});

it.each(["profiles", "organization_members", "organization_invitations"])("does not write when %s rejects its read", async table => {
  state.throwTable = table;
  await expect(inviteMember(form())).rejects.toThrow("Transport unavailable");
  expect(state.inserts).toHaveLength(0); expect(state.redirect).not.toHaveBeenCalled();
});
it("allows an existing admin to invite through the organization-scoped role check", async () => {
  state.role = "admin"; await inviteMember(form());
  expect(state.inserts).toHaveLength(1);
  expect(state.reads).toContainEqual({ table: "organization_members", filters: { organization_id: "org-requested", user_id: "user-a" } });
});
