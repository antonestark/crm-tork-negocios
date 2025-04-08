
import React, { ReactNode } from 'react';

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
  // Removido a verificação de departamento - permite qualquer usuário
  return <>{children}</>;
}
