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

  // Check if user role is admin
  const isAdminRole = user.role === 'admin';
  
  // Check if user's department name is in the allowed list
  // Assumes user object now includes a 'department' object with a 'name' property
  const userDepartmentName = user.department?.name;
  const isAllowedDepartment = userDepartmentName && allowedDepartments.includes(userDepartmentName);

  console.log(`[DepartmentGuard] User: ${user.email}, Role: ${user.role}, Department: ${userDepartmentName}, Allowed: ${allowedDepartments.join(', ')}, isAdmin: ${isAdminRole}, isAllowedDept: ${isAllowedDepartment}`);

  if (isAdminRole || isAllowedDepartment) {
    console.log(`[DepartmentGuard] Access granted for ${user.email} to ${location.pathname}`);
    return <>{children}</>;
  }

  console.log(`[DepartmentGuard] Access denied for ${user.email} to ${location.pathname}. Redirecting to ${fallbackPath}`);

  // Redireciona para fallback se não tiver permissão
  return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
}
