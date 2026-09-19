export const businessRoles = ["owner", "admin", "manager", "member", "viewer"] as const;
export type BusinessRole = (typeof businessRoles)[number];

const rank: Record<BusinessRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1
};

export function isBusinessRole(value:unknown):value is BusinessRole{return typeof value==="string"&&businessRoles.includes(value as BusinessRole)}

export function hasMinimumRole(role: BusinessRole, minimum: BusinessRole): boolean {
  return isBusinessRole(role)&&isBusinessRole(minimum)&&rank[role] >= rank[minimum];
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
