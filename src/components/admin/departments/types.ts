
import { Department } from '@/types/admin';

export interface DepartmentsContextType {
  departments: Department[];
  filteredDepartments: Department[];
  loading: boolean;
  error: Error | null;
  selectedDepartment: Department | null;
  searchQuery: string;
  isFormOpen: boolean;
  isMembersOpen: boolean;
  isPermissionsOpen: boolean;
  isDeleteDialogOpen: boolean;
  departmentToDelete: Department | null;
  isEditMode: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (department: Department | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setIsMembersOpen: (isOpen: boolean) => void;
  setIsPermissionsOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setDepartmentToDelete: (department: Department | null) => void;
  setIsEditMode: (isEdit: boolean) => void;
  handleSelectDepartment: (department: Department) => void;
  handleNewDepartment: () => void;
  handleEditDepartment: (department: Department) => void;
  handleDeleteClick: (department: Department) => void;
  handleViewMembers: (department: Department) => void;
  handleManagePermissions: (department: Department) => void;
  confirmDelete: () => Promise<void>;
  handleSaveDepartment: (data: Partial<Department>) => Promise<void>;
}
