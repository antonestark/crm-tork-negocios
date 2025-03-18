
import React from 'react';
import { DepartmentList } from './DepartmentList';
import { DepartmentDetails } from './DepartmentDetails';
import { DepartmentSelectionPlaceholder } from './DepartmentSelectionPlaceholder';
import { AlertDialog } from './DeleteDepartmentDialog';
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { DepartmentPermissionsDialog } from './DepartmentPermissionsDialog';
import { useDepartmentsContext } from './DepartmentsContext';

export function DepartmentsContainer() {
  const {
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
    setIsFormOpen,
    setIsMembersOpen,
    setIsPermissionsOpen,
    setIsDeleteDialogOpen,
    handleSelectDepartment,
    handleNewDepartment,
    handleEditDepartment,
    handleDeleteClick,
    handleViewMembers,
    handleManagePermissions,
    confirmDelete,
    handleSaveDepartment
  } = useDepartmentsContext();

  return (
    <div className="flex h-[calc(100vh-220px)]">
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
          <DepartmentSelectionPlaceholder onNewDepartment={handleNewDepartment} />
        )}
      </div>
      
      {/* Department Form Dialog */}
      <DepartmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={isEditMode ? selectedDepartment : undefined}
        onSave={handleSaveDepartment}
        isEditing={isEditMode}
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
