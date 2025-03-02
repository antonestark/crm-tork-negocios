
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { DepartmentTreeView } from './DepartmentTreeView';
import { Department } from '@/types/admin';
import { supabase, departmentAdapter } from "@/integrations/supabase/client";

const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get departments with manager name
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select(`
          *,
          manager:users(first_name, last_name)
        `);
        
      if (deptError) throw deptError;
      
      // For each department, count members
      const departmentsWithCounts = await Promise.all(
        (deptData || []).map(async (dept) => {
          try {
            // This is a temporary workaround since user_department_roles table doesn't exist yet
            // When the table exists, uncomment this code and remove the temporary workaround
            /*
            const { count, error } = await supabase
              .from('user_department_roles')
              .select('id', { count: 'exact', head: true })
              .eq('department_id', dept.id);
            
            if (error) throw error;
            */
            
            // Temporary workaround - just add a count of 0
            const count = 0;
            
            return {
              ...dept,
              _memberCount: count || 0
            };
          } catch (error) {
            console.error(`Error counting members for department ${dept.id}:`, error);
            return {
              ...dept,
              _memberCount: 0
            };
          }
        })
      );
      
      // Apply adapter to match the expected Department interface
      const adaptedDepartments = departmentAdapter(departmentsWithCounts);
      
      setDepartments(adaptedDepartments as Department[]);
      setFilteredDepartments(adaptedDepartments as Department[]);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddDepartment = async (formData: Partial<Department>) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          name: formData.name || '',
          description: formData.description || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
      
      fetchDepartments();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    }
  };

  const handleEditDepartment = async (formData: Partial<Department>) => {
    if (!currentDepartment) return;
    
    try {
      const { error } = await supabase
        .from('departments')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', currentDepartment.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
      
      fetchDepartments();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return;
    
    try {
      // Check if department has members
      // This is a temporary workaround since user_department_roles table doesn't exist yet
      // When the table exists, uncomment this code and remove the temporary workaround
      /*
      const { count, error: countError } = await supabase
        .from('user_department_roles')
        .select('id', { count: 'exact', head: true })
        .eq('department_id', currentDepartment.id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'Department has members assigned to it. Remove members first.',
          variant: 'destructive',
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      */
      
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', currentDepartment.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      
      fetchDepartments();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (dept: Department) => {
    setCurrentDepartment(dept);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (dept: Department) => {
    setCurrentDepartment(dept);
    setIsDeleteDialogOpen(true);
  };

  const handleManageMembersClick = (dept: Department) => {
    setCurrentDepartment(dept);
    setIsMembersDialogOpen(true);
  };

  const filterDepartments = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredDepartments(departments);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredDepartments(
        departments.filter(dept => 
          dept.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (dept.description && dept.description.toLowerCase().includes(lowerCaseSearchTerm))
        )
      );
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Departments</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading departments...</div>
            ) : departments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">No departments found</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first department
                </Button>
              </div>
            ) : (
              <DepartmentTreeView 
                departments={filteredDepartments} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onManageMembers={handleManageMembersClick}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      {isAddDialogOpen && (
        <DepartmentFormDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddDepartment}
          title="Add Department"
        />
      )}

      {/* Edit Department Dialog */}
      {isEditDialogOpen && currentDepartment && (
        <DepartmentFormDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditDepartment}
          title="Edit Department"
          department={currentDepartment}
        />
      )}

      {/* Manage Members Dialog */}
      {isMembersDialogOpen && currentDepartment && (
        <DepartmentMembersDialog
          isOpen={isMembersDialogOpen}
          onClose={() => setIsMembersDialogOpen(false)}
          department={currentDepartment}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        description={`Are you sure you want to delete ${currentDepartment?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default DepartmentsView;
