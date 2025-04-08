
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCheckDepartment } from '@/hooks/use-check-department';
import { Loader2, ShieldAlert } from 'lucide-react';

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
  const departmentChecks = allowedDepartments.map(dept => useCheckDepartment(dept));
  
  // Loading if any check is still loading
  const isLoading = departmentChecks.some(check => check.loading);
  
  // User is allowed if they belong to any of the allowed departments
  const isAllowed = departmentChecks.some(check => check.isInDepartment);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    // For development, temporarily allow access
    const devMode = false; // Set to false in production
    if (devMode) {
      return <>{children}</>;
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
