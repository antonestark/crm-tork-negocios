
import React, { useState, useEffect } from 'react';
import { supabase, departmentAdapter, mockUserDepartmentRoleData } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Pencil, Users as UsersIcon } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import DepartmentTreeView from './DepartmentTreeView';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { DepartmentFormDialog } from './DepartmentFormDialog';
import { DepartmentMembersDialog } from './DepartmentMembersDialog';
import { Department } from '@/types/admin';

export const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  }, [searchTerm, departments]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      // Fetch departments
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*');
      
      if (deptError) throw deptError;
      
      // For each department, get the count of members
      // Since we don't have user_department_roles table, we'll use mock data
      const departmentsWithCounts = await Promise.all(deptData.map(async (dept) => {
        // This should be replaced with actual query when the table exists
        const mockData = mockUserDepartmentRoleData(undefined, dept.id);
        
        return {
          ...dept,
          _memberCount: mockData.length
        };
      }));
      
      const adaptedData = departmentAdapter(departmentsWithCounts);
      setDepartments(adaptedData);
      setFilteredDepartments(adaptedData);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsConfirmDialogOpen(true);
  };

  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setIsMembersDialogOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<Department>) => {
    try {
      if (isAddDialogOpen) {
        const { data, error } = await supabase
          .from('departments')
          .insert([{
            name: formData.name || '',
            description: formData.description
          }]);
          
        if (error) throw error;
        setIsAddDialogOpen(false);
      } else if (isEditDialogOpen && selectedDepartment) {
        const { data, error } = await supabase
          .from('departments')
          .update({
            name: formData.name || '',
            description: formData.description
          })
          .eq('id', selectedDepartment.id);
          
        if (error) throw error;
        setIsEditDialogOpen(false);
      }
      
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;
    
    try {
      // First, check if it has members
      // Since we don't have user_department_roles table, we'll use mock data
      const mockData = mockUserDepartmentRoleData(undefined, selectedDepartment.id);
      
      if (mockData.length > 0) {
        alert('Cannot delete a department with members. Please remove all members first.');
        setIsConfirmDialogOpen(false);
        return;
      }
      
      // Delete the department
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);
        
      if (error) throw error;
      
      setIsConfirmDialogOpen(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const departmentsToDisplay = searchTerm ? filteredDepartments : departments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
          />
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              onClick={() => setViewMode('list')}
              size="sm"
            >
              List View
            </Button>
            <Button 
              variant={viewMode === 'tree' ? 'default' : 'outline'} 
              onClick={() => setViewMode('tree')}
              size="sm"
            >
              Tree View
            </Button>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      {viewMode === 'tree' ? (
        <DepartmentTreeView 
          departments={departmentsToDisplay} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMembers={handleViewMembers}
          loading={loading}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading departments...
                  </TableCell>
                </TableRow>
              ) : departmentsToDisplay.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    {searchTerm ? 'No departments match your search' : 'No departments found'}
                  </TableCell>
                </TableRow>
              ) : (
                departmentsToDisplay.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description || 'No description'}</TableCell>
                    <TableCell>{department._memberCount || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewMembers(department)}>
                          <UsersIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(department)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(department)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isAddDialogOpen && (
        <DepartmentFormDialog
          open={true}
          onOpenChange={(open) => setIsAddDialogOpen(open)}
          onSubmit={handleFormSubmit}
          title="Add Department"
        />
      )}

      {isEditDialogOpen && selectedDepartment && (
        <DepartmentFormDialog
          open={true}
          onOpenChange={(open) => setIsEditDialogOpen(open)}
          onSubmit={handleFormSubmit}
          title="Edit Department"
          department={selectedDepartment}
        />
      )}

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description={`Are you sure you want to delete ${selectedDepartment?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />

      {isMembersDialogOpen && selectedDepartment && (
        <DepartmentMembersDialog
          open={true}
          onOpenChange={(open) => setIsMembersDialogOpen(open)}
          departmentId={selectedDepartment.id}
          departmentName={selectedDepartment.name}
        />
      )}
    </div>
  );
};
