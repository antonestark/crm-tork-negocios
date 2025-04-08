import React, { ReactNode } from 'react';
import { usePermission } from '../../hooks/use-permission';
import { ResourcePage, ActionType } from '../../types/permissions';
import { Navigate } from 'react-router-dom';

interface PermissionGuardProps {
  page: ResourcePage;
  action: ActionType;
  children: ReactNode;
  fallbackPath?: string;
}

/**
 * Componente para proteger rotas e componentes baseado em permissões granulares
 */
export function PermissionGuard({
  page,
  action,
  children,
  fallbackPath = '/services/checklist',
}: PermissionGuardProps) {
  const hasPermission = usePermission(page, action);

  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
