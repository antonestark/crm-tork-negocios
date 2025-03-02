import { useState, useEffect } from 'react';
import { supabase, departmentAdapter } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DepartmentTreeView from './DepartmentTreeView';
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';

interface Department {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  children?: Department[];
}

const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');

      if (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load departments',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        const adaptedDepartments = departmentAdapter(data);
        const structuredDepartments = structureDepartments(adaptedDepartments);
        setDepartments(structuredDepartments);
      }
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
  };

  const structureDepartments = (departments: any[]): Department[] => {
    const departmentMap: { [key: string]: Department } = {};
    const rootDepartments: Department[] = [];

    departments.forEach(department => {
      departmentMap[department.id] = {
        ...department,
        children: [],
      };
    });

    departments.forEach(department => {
      const structuredDepartment = departmentMap[department.id];
      if (department.parent_id) {
        if (departmentMap[department.parent_id]) {
          departmentMap[department.parent_id].children = [
            ...(departmentMap[department.parent_id].children || []),
            structuredDepartment,
          ];
        }
      } else {
        rootDepartments.push(structuredDepartment);
      }
    });

    return rootDepartments;
  };

  const handleAddDepartment = () => {
    setShowAddDialog(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowEditDialog(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteDialog(true);
  };

  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setShowMembersDialog(true);
  };

  const handleCreateDepartment = async (formData: Partial<Department>) => {
    try {
      const { error } = await supabase
        .from('departments')
        .insert([
          {
            name: formData.name,
            description: formData.description,
          },
        ]);

      if (error) {
        console.error('Error creating department:', error);
        toast({
          title: 'Error',
          description: 'Failed to create department',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDepartment = async (formData: Partial<Department>) => {
    if (!selectedDepartment) return;

    try {
      const { error } = await supabase
        .from('departments')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', selectedDepartment.id);

      if (error) {
        console.error('Error updating department:', error);
        toast({
          title: 'Error',
          description: 'Failed to update department',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);

      if (error) {
        console.error('Error deleting department:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete department',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Button onClick={handleAddDepartment}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <DepartmentTreeView 
        departments={departments} 
        onEdit={handleEditDepartment} 
        onDelete={handleDeleteDepartment}
        onViewMembers={handleViewMembers}
        loading={loading} 
      />

      {showAddDialog && (
        <DepartmentFormDialog
          isOpen={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleCreateDepartment}
          title="Add Department"
        />
      )}

      {showEditDialog && selectedDepartment && (
        <DepartmentFormDialog
          isOpen={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleUpdateDepartment}
          title="Edit Department"
          department={selectedDepartment}
        />
      )}

      {showDeleteDialog && selectedDepartment && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Delete Department"
          description={`Are you sure you want to delete the department "${selectedDepartment.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
        />
      )}

      {showMembersDialog && selectedDepartment && (
        <DepartmentMembersDialog
          isOpen={showMembersDialog}
          onOpenChange={setShowMembersDialog}
          department={selectedDepartment}
        />
      )}
    </div>
  );
};

export { DepartmentsView };
