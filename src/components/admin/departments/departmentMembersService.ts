
/**
 * @deprecated This file is maintained for backward compatibility.
 * Please import from services/index.ts instead.
 */

export { 
  fetchDepartmentUsers,
  fetchAvailableUsers 
} from './services/index';

export {
  addDepartmentMember,
  removeDepartmentMember
} from './services/departmentMembersManager';

export type { 
  DepartmentUser, 
  DepartmentMember,
  DepartmentWithUsers 
} from './types/departmentUserTypes';
