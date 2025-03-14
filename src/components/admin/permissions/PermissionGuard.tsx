
import React, { ReactNode } from 'react';
import { useCheckPermission } from '@/hooks/use-check-permission';
import { Skeleton } from '@/components/ui/skeleton';

interface PermissionGuardProps {
  permissionCode: string;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
}

export function PermissionGuard({
  permissionCode,
  children,
  fallback = null,
  showLoading = true
}: PermissionGuardProps) {
  const { hasPermission, loading } = useCheckPermission(permissionCode);

  if (loading && showLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
