import { ALL_PERMISSIONS, type RoleItem } from "../../types/roles";

export const DEFAULT_ROLES: RoleItem[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all console features, security settings, and user management",
    isSystem: true,
    permissions: ALL_PERMISSIONS.map((p) => p.id),
  },
  {
    id: "content_manager",
    name: "Content Manager",
    description: "Manage solutions, product catalog, news articles, and company information",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "solutions:view",
      "solutions:manage",
      "products:view",
      "products:manage",
      "news:view",
      "news:manage",
      "company:view",
      "company:manage",
    ],
  },
  {
    id: "recruitment_manager",
    name: "Recruitment Manager",
    description: "Manage career job openings and candidate application submissions",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "openings:view",
      "openings:manage",
      "submissions:view",
      "submissions:manage",
    ],
  },
  {
    id: "sales_manager",
    name: "Sales Manager",
    description: "Manage client messages and wholesale quotation requests",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "mailbox:view",
      "mailbox:manage",
      "requests:view",
      "requests:manage",
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only view access across dashboard and non-sensitive management reports",
    isSystem: false,
    permissions: [
      "dashboard:view",
      "solutions:view",
      "products:view",
      "news:view",
      "openings:view",
      "submissions:view",
      "mailbox:view",
      "requests:view",
      "company:view",
    ],
  },
];

let memoryRoles: RoleItem[] | null = null;

export function getMemoryRoles(): RoleItem[] {
  if (!memoryRoles) {
    memoryRoles = [...DEFAULT_ROLES];
  }
  return memoryRoles;
}

export function setMemoryRoles(roles: RoleItem[]): void {
  memoryRoles = roles;
}

export function getPermissionsForRole(roleId: string, roleName: string): string[] {
  const roles = getMemoryRoles();
  const found = roles.find((r) => r.id === roleId || r.name?.toLowerCase() === roleName?.toLowerCase());
  if (found && Array.isArray(found.permissions)) {
    return found.permissions;
  }
  const defaultFound = DEFAULT_ROLES.find((r) => r.id === roleId || r.name?.toLowerCase() === roleName?.toLowerCase());
  if (defaultFound && Array.isArray(defaultFound.permissions)) {
    return defaultFound.permissions;
  }
  if (roleId === "super_admin" || roleName === "Super Admin" || roleName === "Administrator") {
    return ALL_PERMISSIONS.map((p) => p.id);
  }
  return [];
}
