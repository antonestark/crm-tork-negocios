
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from 'lucide-react';
import { supabase, departmentAdapter } from '@/integrations/supabase/client';
import { Department } from '@/types/admin';
import { Input } from '@/components/ui/input';
import DepartmentFormDialog from './DepartmentFormDialog';
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import DepartmentTreeView from "./DepartmentTreeView";
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { useToast } from '@/hooks/use-toast';

export function DepartmentsView() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const { toast } = useToast();
  
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      // Fetch departments from Supabase
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      
      // Process the data to include member counts
      // In a real implementation, we would join with user_department_roles table
      // Since we're mocking, add a mock member count to each department
      const departmentsWithCounts = data.map(dep => ({
        ...dep,
        _memberCount: Math.floor(Math.random() * 20) // Mock member count
      }));
      
      // Adapt the data to match the Department interface
      const adaptedDepartments = departmentAdapter(departmentsWithCounts);
      
      setDepartments(adaptedDepartments);
      setFilteredDepartments(adaptedDepartments);
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
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    if (search) {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        (dept.description && dept.description.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  }, [search, departments]);
  
  const handleAddDepartment = async (formData: Partial<Department>) => {
    try {
      // Insert new department into Supabase
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: formData.name || '',
          description: formData.description || null,
        }])
        .select();
      
      if (error) throw error;
      
      // Refresh the departments list
      fetchDepartments();
      
      toast({
        title: 'Department Added',
        description: 'The department has been created successfully',
      });
      
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive',
      });
    }
  };
  
  const handleEditDepartment = async (formData: Partial<Department>) => {
    if (!selectedDepartment) return;
    
    try {
      // Update department in Supabase
      const { error } = await supabase
        .from('departments')
        .update({
          name: formData.name || selectedDepartment.name,
          description: formData.description !== undefined ? formData.description : selectedDepartment.description,
        })
        .eq('id', selectedDepartment.id);
      
      if (error) throw error;
      
      // Refresh the departments list
      fetchDepartments();
      
      toast({
        title: 'Department Updated',
        description: 'The department has been updated successfully',
      });
      
      setShowEditDialog(false);
      setSelectedDepartment(null);
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
    if (!selectedDepartment) return;
    
    try {
      // Delete department from Supabase
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);
      
      if (error) throw error;
      
      // Refresh the departments list
      fetchDepartments();
      
      toast({
        title: 'Department Deleted',
        description: 'The department has been deleted successfully',
      });
      
      setShowDeleteConfirm(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };
  
  const handleOpenEdit = (department: Department) => {
    setSelectedDepartment(department);
    setShowEditDialog(true);
  };
  
  const handleOpenDelete = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteConfirm(true);
  };
  
  const handleOpenMembers = (department: Department) => {
    setSelectedDepartment(department);
    setShowMembersDialog(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            onClick={() => setViewMode('tree')}
          >
            Tree
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>Add Department</Button>
        </div>
      </div>
      
      {viewMode === 'tree' ? (
        <DepartmentTreeView 
          departments={filteredDepartments} 
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onViewMembers={handleOpenMembers}
          loading={loading}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredDepartments.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500">
              No departments found. Add a new department to get started.
            </div>
          ) : (
            filteredDepartments.map((department) => (
              <Card key={department.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{department.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {department.description || 'No description provided'}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    Members: {department._memberCount || 0}
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenMembers(department)}
                    >
                      Members
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenEdit(department)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleOpenDelete(department)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      {showAddDialog && (
        <DepartmentFormDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={handleAddDepartment}
          title="Add Department"
        />
      )}
      
      {showEditDialog && selectedDepartment && (
        <DepartmentFormDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedDepartment(null);
          }}
          onSubmit={handleEditDepartment}
          title="Edit Department"
          department={selectedDepartment}
        />
      )}
      
      {selectedDepartment && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedDepartment(null);
          }}
          onConfirm={handleDeleteDepartment}
          title="Delete Department"
          description={`Are you sure you want to delete ${selectedDepartment.name}? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="destructive"
        />
      )}
      
      {selectedDepartment && (
        <DepartmentMembersDialog
          isOpen={showMembersDialog}
          onClose={() => {
            setShowMembersDialog(false);
            setSelectedDepartment(null);
          }}
          department={selectedDepartment}
        />
      )}
    </div>
  );
}
