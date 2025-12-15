'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserPermissionsResponse } from '@/types/permissions';

interface PermissionsContextType {
  permissions: UserPermissionsResponse | null;
  loading: boolean;
  hasPermission: (module: string) => boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  role: string;
}

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: null,
  loading: true,
  hasPermission: () => false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canExport: false,
  role: 'viewer',
});

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [permissions, setPermissions] = useState<UserPermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://linktech-ma-server-db.vercel.app/api/permissions?email=${encodeURIComponent(email)}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.isActive) {
            setPermissions(data);
          }
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [isLoaded, user]);

  const hasPermission = (module: string): boolean => {
    if (!permissions) return false;
    return permissions.permissions[module as keyof typeof permissions.permissions] === true;
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        hasPermission,
        canCreate: permissions?.permissions.canCreate || false,
        canEdit: permissions?.permissions.canEdit || false,
        canDelete: permissions?.permissions.canDelete || false,
        canExport: permissions?.permissions.canExport || false,
        role: permissions?.role || 'viewer',
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}
