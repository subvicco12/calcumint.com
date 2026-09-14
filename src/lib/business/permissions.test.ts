import { describe, expect, it } from "vitest";
import { canAssignRole, hasBusinessPermission } from "./permissions";

describe("B5 business role permissions", () => {
  it("keeps viewers read-only", () => {
    expect(hasBusinessPermission("viewer", "calculations.read")).toBe(true);
    expect(hasBusinessPermission("viewer", "calculations.create")).toBe(false);
  });

  it("allows members to create shared calculations but not manage projects", () => {
    expect(hasBusinessPermission("member", "calculations.create")).toBe(true);
    expect(hasBusinessPermission("member", "projects.manage")).toBe(false);
  });

  it("allows managers to manage operational workspaces and audit access", () => {
    expect(hasBusinessPermission("manager", "projects.manage")).toBe(true);
    expect(hasBusinessPermission("manager", "clients.manage")).toBe(true);
    expect(hasBusinessPermission("manager", "audit.read")).toBe(true);
    expect(hasBusinessPermission("manager", "members.manage")).toBe(false);
  });

  it("allows admins to manage members but never assign ownership", () => {
    expect(hasBusinessPermission("admin", "members.manage")).toBe(true);
    expect(canAssignRole("admin", "manager")).toBe(true);
    expect(canAssignRole("admin", "owner")).toBe(false);
    expect(canAssignRole("manager", "member")).toBe(false);
  });
});
