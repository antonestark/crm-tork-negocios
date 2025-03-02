
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, XCircle, UserPlus, Users, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentTreeView from './DepartmentTreeView';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { Department } from '@/types/admin';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DepartmentsView = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
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

  const loadDepartments = async () => {
    try {
      setLoading(true);
      
      // Departamentos
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select(`
          *,
          manager:users(first_name, last_name)
        `);

      if (deptError) throw deptError;

      // Para cada departamento, buscar o número de membros
      const departmentsWithMemberCount = await Promise.all((deptData || []).map(async (dept) => {
        try {
          // Substitua isto por consultas condicionais quando user_department_roles estiver disponível
          // const { count } = await supabase
          //   .from('user_department_roles')
          //   .select('*', { count: 'exact', head: true })
          //   .eq('department_id', dept.id);
          
          // Como user_department_roles ainda não existe, definimos um valor padrão
          const count = 0;
          
          return {
            ...dept,
            _memberCount: count || 0,
            // Adicionando propriedades faltantes para corresponder à interface Department
            path: dept.path || '',
            level: dept.level || 0,
            parent_id: dept.parent_id || null,
            manager_id: dept.manager_id || null,
            settings: dept.settings || {},
            metadata: dept.metadata || {}
          };
        } catch (error) {
          console.error(`Error fetching member count for department ${dept.id}:`, error);
          return {
            ...dept,
            _memberCount: 0,
            // Adicionando propriedades faltantes
            path: dept.path || '',
            level: dept.level || 0,
            parent_id: dept.parent_id || null,
            manager_id: dept.manager_id || null,
            settings: dept.settings || {},
            metadata: dept.metadata || {}
          };
        }
      }));

      setDepartments(departmentsWithMemberCount as Department[]);
      setFilteredDepartments(departmentsWithMemberCount as Department[]);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowFormDialog(true);
  };

  const handleEditDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowFormDialog(true);
  };

  const handleDeleteDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowDeleteDialog(true);
  };

  const handleManageMembers = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowMembersDialog(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      // Primeiro, verificar se o departamento tem membros
      // Como user_department_roles ainda não existe, simulamos a verificação
      // const { count } = await supabase
      //   .from('user_department_roles')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('department_id', selectedDepartment.id);
      
      // if (count && count > 0) {
      //   throw new Error('Cannot delete department with members');
      // }
      
      // Verificar departamentos filhos
      const { data: childDepts, error: childError } = await supabase
        .from('departments')
        .select('id')
        .eq('parent_id', selectedDepartment.id);
        
      if (childError) throw childError;
      
      if (childDepts && childDepts.length > 0) {
        throw new Error('Cannot delete department with child departments');
      }
      
      // Excluir o departamento
      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .eq('id', selectedDepartment.id);
        
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      
      loadDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete department',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-gray-500">Manage your organizational structure</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode(viewMode === 'list' ? 'tree' : 'list')}>
            {viewMode === 'list' ? 'Tree View' : 'List View'}
          </Button>
          <Button onClick={handleAddDepartment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Department Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search departments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <XCircle
                  className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading departments...
                      </TableCell>
                    </TableRow>
                  ) : filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No departments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {dept.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          {dept.manager ? `${dept.manager.first_name} ${dept.manager.last_name}` : 'No manager'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {dept._memberCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleManageMembers(dept)}>
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditDepartment(dept)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteDepartment(dept)} className="text-red-500 hover:text-red-700">
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
          ) : (
            <DepartmentTreeView 
              departments={filteredDepartments} 
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
              onManageMembers={handleManageMembers}
            />
          )}
        </CardContent>
      </Card>
      
      {showFormDialog && (
        <DepartmentFormDialog
          isOpen={showFormDialog}
          onClose={() => setShowFormDialog(false)}
          onSave={loadDepartments}
          department={selectedDepartment || undefined}
          departments={departments}
        />
      )}
      
      {showMembersDialog && selectedDepartment && (
        <DepartmentMembersDialog
          isOpen={showMembersDialog}
          onClose={() => setShowMembersDialog(false)}
          department={selectedDepartment}
        />
      )}
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteDepartment}
        title="Delete Department"
        description={`Are you sure you want to delete the department "${selectedDepartment?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default DepartmentsView;
