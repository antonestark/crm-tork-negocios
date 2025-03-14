
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepartmentList } from './DepartmentList';
import { DepartmentDetails } from './DepartmentDetails';
import DepartmentFormDialog from './DepartmentFormDialog'; // Changed from named import to default import
import DepartmentMembersDialog from './DepartmentMembersDialog'; // Changed from named import to default import
import { DepartmentPermissionsDialog } from './DepartmentPermissionsDialog';
import { Department } from '@/types/admin';
import { useDepartments } from '@/hooks/use-departments';
import { AlertDialog } from './DeleteDepartmentDialog';

export function compareDepartmentIds(userId: number | null, departmentId: string): boolean {
  if (userId === null) return false;
  return String(userId) === departmentId;
}

export function EnhancedDepartmentsView() {
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
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
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
      }
    } else {
      // Create new department
      success = await addDepartment(data as Department);
      
      if (success) {
        toast.success("Departamento criado", {
          description: "O novo departamento foi criado com sucesso."
        });
      }
    }
    
    if (!success) {
      toast.error("Erro", {
        description: "Ocorreu um erro ao salvar o departamento."
      });
    }
  };
  
  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Departments List */}
      <DepartmentList 
        departments={filteredDepartments}
        selectedDepartment={selectedDepartment}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectDepartment={handleSelectDepartment}
        onNewDepartment={handleNewDepartment}
      />
      
      {/* Department Details */}
      <div className="w-2/3 pl-6">
        {selectedDepartment ? (
          <DepartmentDetails
            department={selectedDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteClick}
            onViewMembers={handleViewMembers}
            onManagePermissions={handleManagePermissions}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Plus className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum departamento selecionado</h3>
            <p className="text-muted-foreground mb-4">
              Selecione um departamento para ver seus detalhes ou crie um novo.
            </p>
            <Button onClick={handleNewDepartment}>
              <Plus className="h-4 w-4 mr-1" /> Novo Departamento
            </Button>
          </div>
        )}
      </div>
      
      {/* Department Form Dialog */}
      <DepartmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={isEditMode ? selectedDepartment : undefined}
        onSave={handleSaveDepartment}
      />
      
      {/* Department Members Dialog */}
      <DepartmentMembersDialog
        open={isMembersOpen}
        onOpenChange={setIsMembersOpen}
        department={selectedDepartment}
      />
      
      {/* Department Permissions Dialog */}
      <DepartmentPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        department={selectedDepartment}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir o departamento "${departmentToDelete?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
