export type OrganizationRole = "owner" | "admin" | "manager" | "member" | "viewer";

export type BusinessPermission =
  | "organization.manage"
  | "members.manage"
  | "projects.manage"
  | "clients.manage"
  | "templates.manage"
  | "calculations.create"
  | "calculations.read"
  | "audit.read";

const roleRank: Record<OrganizationRole, number> = {
  viewer: 10,
  member: 20,
  manager: 30,
  admin: 40,
  owner: 50
};

const minimumRole: Record<BusinessPermission, OrganizationRole> = {
  "organization.manage": "admin",
  "members.manage": "admin",
  "projects.manage": "manager",
  "clients.manage": "manager",
  "templates.manage": "manager",
  "calculations.create": "member",
  "calculations.read": "viewer",
  "audit.read": "manager"
};

export function hasBusinessPermission(role: OrganizationRole, permission: BusinessPermission): boolean {
  return roleRank[role] >= roleRank[minimumRole[permission]];
}

export function canAssignRole(actor: OrganizationRole, target: OrganizationRole): boolean {
  if (target === "owner") return false;
  return roleRank[actor] >= roleRank.admin && roleRank[target] < roleRank[actor];
}

export function businessRoleLabel(role: OrganizationRole): string {
  return role[0].toUpperCase() + role.slice(1);
}
