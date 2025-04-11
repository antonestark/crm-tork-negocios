import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface DepartmentGuardProps {
  allowedDepartments: string[];
  children: ReactNode;
  fallbackPath?: string;
}

export function DepartmentGuard({ 
  allowedDepartments, 
  children, 
  fallbackPath = '/services/checklist'
}: DepartmentGuardProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Usuário não carregado ainda
    return null;
  }

  const isAdminRole = user.role === 'admin' || user.role === 'superadmin';
  const isAllowedDepartment = user.department_id && allowedDepartments.includes(user.department_id.toString());

  if (isAdminRole || isAllowedDepartment) {
    return <>{children}</>;
  }

  // Redireciona para fallback se não tiver permissão
  return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
}
