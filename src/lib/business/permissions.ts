export const businessRoles = ["owner", "admin", "manager", "member", "viewer"] as const;
export type BusinessRole = (typeof businessRoles)[number];

const rank: Record<BusinessRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1
};

export function hasMinimumRole(role: BusinessRole, minimum: BusinessRole): boolean {
  return rank[role] >= rank[minimum];
}

export function canManageMembers(role: BusinessRole): boolean {
  return hasMinimumRole(role, "admin");
}

export function canManageProjects(role: BusinessRole): boolean {
  return hasMinimumRole(role, "manager");
}

export function canEditSharedWork(role: BusinessRole): boolean {
  return hasMinimumRole(role, "member");
}

export function canTransferOwnership(role: BusinessRole): boolean {
  return role === "owner";
}

export const BUSINESS_INCLUDED_SEATS = 5;
