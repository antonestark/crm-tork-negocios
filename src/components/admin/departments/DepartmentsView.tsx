
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Users, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Department } from '@/types/admin';
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentTreeView from './DepartmentTreeView';
import DepartmentMembersDialog from './DepartmentMembersDialog';

const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  
  const { toast } = useToast();

  // Fetch departments from Supabase
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      // Fetch departments with manager details
      const { data: depts, error: deptsError } = await supabase
        .from('departments')
        .select(`
          *,
          manager:users!departments_manager_id_fkey(first_name, last_name)
        `)
        .order('name');
      
      if (deptsError) throw deptsError;
      
      // Fetch member counts for each department
      const { data: memberCounts, error: countError } = await supabase
        .from('user_department_roles')
        .select('department_id, count', { count: 'exact' })
        .group('department_id');
      
      if (countError) throw countError;
      
      // Create a lookup for member counts
      const countMap: Record<string, number> = {};
      memberCounts?.forEach(item => {
        countMap[item.department_id] = Number(item.count);
      });
      
      // Add member count to each department
      const departmentsWithCount = depts?.map(dept => ({
        ...dept,
        _memberCount: countMap[dept.id] || 0
      })) || [];
      
      setDepartments(departmentsWithCount);
      applySearch(departmentsWithCount, searchTerm);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDepartments();
  }, [toast]);

  // Search functionality
  const applySearch = (depts: Department[], term: string) => {
    if (!term.trim()) {
      setFilteredDepartments(depts);
      return;
    }
    
    const filtered = depts.filter(dept => 
      dept.name.toLowerCase().includes(term.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredDepartments(filtered);
  };

  useEffect(() => {
    applySearch(departments, searchTerm);
  }, [searchTerm, departments]);

  // Handler for department selection
  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
  };

  // Delete department handler
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      setLoading(true);
      
      // Check if department has members
      const { count, error: countError } = await supabase
        .from('user_department_roles')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', selectedDepartment.id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'Department has members. Remove all members first.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
        return;
      }
      
      // Check if department has children
      const { data: childDepts, error: childError } = await supabase
        .from('departments')
        .select('id')
        .eq('parent_id', selectedDepartment.id);
      
      if (childError) throw childError;
      
      if (childDepts && childDepts.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'Department has sub-departments. Remove them first.',
          variant: 'destructive',
        });
        setShowDeleteDialog(false);
        return;
      }
      
      // Delete the department
      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Department Deleted',
        description: `${selectedDepartment.name} has been deleted successfully.`,
      });
      
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Department tree */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Departments</CardTitle>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
          
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No departments found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Department
              </Button>
            </div>
          ) : (
            <DepartmentTreeView 
              departments={filteredDepartments}
              onSelect={handleSelectDepartment}
              selectedId={selectedDepartment?.id}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Department details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Department Details</CardTitle>
        </CardHeader>
        
        <CardContent>
          {selectedDepartment ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                  {selectedDepartment.description && (
                    <p className="text-gray-500 mt-1">{selectedDepartment.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMembersDialog(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-500">Parent Department</h3>
                    <p className="mt-1">
                      {selectedDepartment.parent_id 
                        ? departments.find(d => d.id === selectedDepartment.parent_id)?.name || 'Unknown'
                        : 'None (Top Level)'}
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-500">Manager</h3>
                    <p className="mt-1">
                      {selectedDepartment.manager_id
                        ? (selectedDepartment.manager?.first_name && selectedDepartment.manager?.last_name
                            ? `${selectedDepartment.manager.first_name} ${selectedDepartment.manager.last_name}`
                            : 'Unknown')
                        : 'None Assigned'}
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-500">Members</h3>
                    <p className="mt-1">
                      {selectedDepartment._memberCount || 0} team members
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1">
                      {new Date(selectedDepartment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a department to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      {showCreateDialog && (
        <DepartmentFormDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={fetchDepartments}
          departments={departments}
        />
      )}
      
      {showEditDialog && selectedDepartment && (
        <DepartmentFormDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSave={fetchDepartments}
          department={selectedDepartment}
          departments={departments}
        />
      )}
      
      {showDeleteDialog && selectedDepartment && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteDepartment}
          title="Delete Department"
          description={`Are you sure you want to delete "${selectedDepartment.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="destructive"
        />
      )}
      
      {showMembersDialog && selectedDepartment && (
        <DepartmentMembersDialog
          isOpen={showMembersDialog}
          onClose={() => setShowMembersDialog(false)}
          department={selectedDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentsView;
