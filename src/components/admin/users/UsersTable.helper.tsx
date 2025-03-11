
import { Department } from '@/types/admin';

// Create a helper function to ensure Department objects have the required _memberCount property
export const ensureDepartmentFormat = (department: any): Department => {
  if (!department) return null;
  
  // Ensure _memberCount is present
  if (department._memberCount === undefined) {
    department._memberCount = 0;
  }
  
  return department as Department;
};

// Helper function to safely compare department IDs with different types
export const compareDepartmentIds = (userId: number | null, departmentId: string): boolean => {
  if (userId === null) return false;
  return String(userId) === departmentId;
};
