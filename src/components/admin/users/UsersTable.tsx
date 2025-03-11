
// Since this file is not editable but includes errors, we need to create a helper function
// to ensure it can work correctly with Department objects that might be missing _memberCount.

// Create a helper file with adapter functions
export const ensureDepartmentFormat = (department: any): any => {
  if (!department) return null;
  
  // Ensure _memberCount is present
  if (department._memberCount === undefined) {
    department._memberCount = 0;
  }
  
  return department;
};

// This function should be imported in UsersTable.tsx and used like:
// const department = ensureDepartmentFormat(rawDepartment);
