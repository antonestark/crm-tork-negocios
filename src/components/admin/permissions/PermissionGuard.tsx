
import React, { ReactNode } from 'react';
import { useCheckPermission } from '@/hooks/use-check-permission';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert } from 'lucide-react';

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

  console.log(`PermissionGuard: ${permissionCode}`, { hasPermission, loading });

  if (loading && showLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // For development, temporarily consider all permissions granted
  // Remove this in production environment!
  const devMode = true;
  const effectivePermission = devMode || hasPermission;

  if (!effectivePermission) {
    return fallback || (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Acesso restrito</h3>
        <p className="text-muted-foreground mb-2">Você não tem permissão para acessar esta página.</p>
        <p className="text-sm text-muted-foreground">Permissão necessária: {permissionCode}</p>
      </div>
    );
  }

  return <>{children}</>;
}
