'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/contexts/permissions-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallbackUrl = '/dashboard' 
}: ProtectedRouteProps) {
  const { hasPermission, loading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasPermission(requiredPermission)) {
      console.warn(`Access denied to ${requiredPermission}`);
      router.push(fallbackUrl);
    }
  }, [loading, hasPermission, requiredPermission, fallbackUrl, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
