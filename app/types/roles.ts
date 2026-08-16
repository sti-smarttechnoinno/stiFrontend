export interface RoleItem {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  permissions: string[];
  created_at?: string;
}

export interface PermissionDefinition {
  id: string;
  label: string;
  category: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  { id: "dashboard:view", label: "View Dashboard", category: "Dashboard" },
  { id: "solutions:view", label: "View Solutions", category: "Solutions" },
  { id: "solutions:manage", label: "Create / Edit / Delete Solutions", category: "Solutions" },
  { id: "products:view", label: "View Products", category: "Products" },
  { id: "products:manage", label: "Create / Edit / Delete Products", category: "Products" },
  { id: "news:view", label: "View News Articles", category: "News" },
  { id: "news:manage", label: "Create / Edit / Delete News", category: "News" },
  { id: "openings:view", label: "View Job Offers", category: "Careers" },
  { id: "openings:manage", label: "Create / Edit / Delete Jobs", category: "Careers" },
  { id: "submissions:view", label: "View Candidate Applications", category: "Careers" },
  { id: "submissions:manage", label: "Manage / Delete Applications", category: "Careers" },
  { id: "mailbox:view", label: "View Messages", category: "Communication" },
  { id: "mailbox:manage", label: "Manage / Reply / Delete Messages", category: "Communication" },
  { id: "requests:view", label: "View Quote Requests", category: "Communication" },
  { id: "requests:manage", label: "Manage / Update / Delete Quotes", category: "Communication" },
  { id: "company:view", label: "View Company Info", category: "Company" },
  { id: "company:manage", label: "Update Company Details", category: "Company" },
  { id: "members:view", label: "View Users", category: "Users & Access" },
  { id: "members:manage", label: "Create / Edit / Delete Users", category: "Users & Access" },
  { id: "access:view", label: "View Roles & Access", category: "Users & Access" },
  { id: "access:manage", label: "Create / Edit / Delete Roles", category: "Users & Access" },
  { id: "settings:view", label: "View Settings", category: "Settings" },
  { id: "settings:manage", label: "Update General Settings", category: "Settings" },
];
