export interface UserItem {
  id: string | number;
  name: string;
  username: string;
  email?: string;
  password?: string;
  roleId: string;
  roleName: string;
  status: "Active" | "Inactive";
  lastLogin?: string;
  createdAt?: string;
}

export const DEFAULT_USERS: UserItem[] = [];

let memoryUsers: UserItem[] | null = null;

export function getMemoryUsers(): UserItem[] {
  if (!memoryUsers) {
    memoryUsers = [];
  }
  return memoryUsers;
}

export function setMemoryUsers(users: UserItem[]): void {
  memoryUsers = users;
}
