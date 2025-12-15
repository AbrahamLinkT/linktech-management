"use client";

import { usePermissions } from "@/contexts/permissions-context";
import { UnauthorizedAccess } from "./UnauthorizedAccess";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    console.warn(`⚠️ Usuario no tiene permiso para: ${requiredPermission}`);
    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
}
