import { describe, expect, it } from "vitest";
import {
  BUSINESS_INCLUDED_SEATS,
  canEditSharedWork,
  canManageMembers,
  canManageProjects,
  canTransferOwnership,
  hasMinimumRole,
  isBusinessRole,
  type BusinessRole
} from "./permissions";

describe("business role permissions", () => {
  it("uses the five-role hierarchy", () => {
    expect(hasMinimumRole("owner", "admin")).toBe(true);
    expect(hasMinimumRole("admin", "manager")).toBe(true);
    expect(hasMinimumRole("manager", "member")).toBe(true);
    expect(hasMinimumRole("viewer", "member")).toBe(false);
  });

  it("reserves member administration for owner/admin", () => {
    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("admin")).toBe(true);
    expect(canManageMembers("manager")).toBe(false);
  });

  it("separates project, editing and ownership capabilities", () => {
    expect(canManageProjects("manager")).toBe(true);
    expect(canEditSharedWork("member")).toBe(true);
    expect(canEditSharedWork("viewer")).toBe(false);
    expect(canTransferOwnership("owner")).toBe(true);
    expect(canTransferOwnership("admin")).toBe(false);
  });

  it("includes five seats in the initial Business entitlement", () => {
    expect(BUSINESS_INCLUDED_SEATS).toBe(5);
  });
  it("fails closed for malformed runtime roles",()=>{expect(isBusinessRole("owner")).toBe(true);expect(isBusinessRole("superadmin")).toBe(false);expect(hasMinimumRole("superadmin" as BusinessRole,"viewer")).toBe(false);});
});
