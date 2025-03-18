
import React from 'react';
import { DepartmentsProvider } from './DepartmentsContext';
import { DepartmentsContainer } from './DepartmentsContainer';

// This helper function is still needed by other components
export function compareDepartmentIds(userId: number | null, departmentId: string): boolean {
  if (userId === null) return false;
  return String(userId) === departmentId;
}

export function EnhancedDepartmentsView() {
  console.log('Rendering EnhancedDepartmentsView'); // Debugging log
  return (
    <DepartmentsProvider>
      <DepartmentsContainer />
    </DepartmentsProvider>
  );
}
