"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  username: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

const routePermissionMap: Record<string, string> = {
  "/console": "dashboard:view",
  "/console/layers": "solutions:view",
  "/console/inventory": "products:view",
  "/console/news": "news:view",
  "/console/openings": "openings:view",
  "/console/submissions": "submissions:view",
  "/console/mailbox": "mailbox:view",
  "/console/requests": "requests:view",
  "/console/identity": "company:view",
  "/console/members": "members:view",
  "/console/access": "access:view",
  "/console/preferences": "settings:view",
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setLoading(false);
          return data.user;
        }
      }
      setUser(null);
      setLoading(false);
      return null;
    } catch (err) {
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const hasPermission = useCallback(
    (permissionId: string): boolean => {
      if (!user) return false;
      if (user.roleId === "super_admin" || user.roleName === "Super Admin" || user.roleName === "Administrator") {
        return true;
      }
      return Array.isArray(user.permissions) && user.permissions.includes(permissionId);
    },
    [user]
  );

  const canAccessRoute = useCallback(
    (path: string): boolean => {
      if (!user) return false;
      if (user.roleId === "super_admin" || user.roleName === "Super Admin" || user.roleName === "Administrator") {
        return true;
      }

      // Find longest matching route prefix
      const matchingRoute = Object.keys(routePermissionMap).find(
        (route) => path === route || path.startsWith(route + "/")
      );

      if (!matchingRoute) return true; // Default allow for unmapped subpages

      const requiredPermission = routePermissionMap[matchingRoute];
      return hasPermission(requiredPermission);
    },
    [user, hasPermission]
  );

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    router.replace("/gate/login");
  };

  return {
    user,
    loading,
    hasPermission,
    canAccessRoute,
    logout,
    refetchAuth: checkAuth,
  };
}
