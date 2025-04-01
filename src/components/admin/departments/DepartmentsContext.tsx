
import React, { createContext, useContext, useState } from 'react';
import { Department } from '@/types/admin';
import { useDepartments } from '@/hooks/use-departments';
import { toast } from 'sonner';

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

export const DepartmentsContext = createContext<DepartmentsContextType | undefined>(undefined);

export const DepartmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { departments, loading, error, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dept.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle department selection
  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
  };
  
  // Handle new department
  const handleNewDepartment = () => {
    setIsEditMode(false);
    setSelectedDepartment(null);
    setIsFormOpen(true);
  };
  
  // Handle edit department
  const handleEditDepartment = (department: Department) => {
    setIsEditMode(true);
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };
  
  // Handle delete department
  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    
    // Check for members
    const hasMembersAssociated = departmentToDelete._memberCount > 0;
    if (hasMembersAssociated) {
      toast.error("Não é possível excluir", {
        description: "Este departamento possui membros associados. Remova os membros primeiro."
      });
      setIsDeleteDialogOpen(false);
      return;
    }
    
    const success = await deleteDepartment(departmentToDelete.id);
    if (success) {
      toast.success("Departamento excluído", {
        description: "O departamento foi excluído com sucesso."
      });
      if (selectedDepartment?.id === departmentToDelete.id) {
        setSelectedDepartment(null);
      }
    } else {
      toast.error("Erro", {
        description: "Não foi possível excluir o departamento."
      });
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Handle view members
  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setIsMembersOpen(true);
  };
  
  // Handle manage permissions
  const handleManagePermissions = (department: Department) => {
    setSelectedDepartment(department);
    setIsPermissionsOpen(true);
  };
  
  // Handle save department
  const handleSaveDepartment = async (data: Partial<Department>) => {
    let success;
    
    try {
      if (isEditMode && selectedDepartment) {
        // Update existing department
        success = await updateDepartment({
          ...selectedDepartment,
          ...data
        });
        
        if (success) {
          toast.success("Departamento atualizado", {
            description: "As alterações foram salvas com sucesso."
          });
          setIsFormOpen(false);
        }
      } else {
        // Create new department
        // Pass 'data' directly as addDepartment expects Partial<Department>
        success = await addDepartment(data); 
        
        if (success) {
          toast.success("Departamento criado", {
            description: "O novo departamento foi criado com sucesso."
          });
          setIsFormOpen(false);
        } else {
           // Add specific error toast if addDepartment returns false
           toast.error("Erro ao Criar", {
             description: "Não foi possível criar o departamento. Verifique os dados ou tente novamente."
           });
        }
      }
      
      // This generic error might still be useful for unexpected issues
      // if (!success) {
      //   toast.error("Erro", {
      //     description: "Ocorreu um erro ao salvar o departamento."
      //   });
      // }
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o departamento."
      });
    }
  };

  const value = {
    departments,
    filteredDepartments,
    loading,
    error,
    selectedDepartment,
    searchQuery,
    isFormOpen,
    isMembersOpen,
    isPermissionsOpen,
    isDeleteDialogOpen,
    departmentToDelete,
    isEditMode,
    setSearchQuery,
    setSelectedDepartment,
    setIsFormOpen,
    setIsMembersOpen,
    setIsPermissionsOpen,
    setIsDeleteDialogOpen,
    setDepartmentToDelete,
    setIsEditMode,
    handleSelectDepartment,
    handleNewDepartment,
    handleEditDepartment,
    handleDeleteClick,
    handleViewMembers,
    handleManagePermissions,
    confirmDelete,
    handleSaveDepartment
  };

  return (
    <DepartmentsContext.Provider value={value}>
      {children}
    </DepartmentsContext.Provider>
  );
};

// Custom hook to use the context
export const useDepartmentsContext = () => {
  const context = useContext(DepartmentsContext);
  if (context === undefined) {
    throw new Error('useDepartmentsContext must be used within a DepartmentsProvider');
  }
  return context;
};
