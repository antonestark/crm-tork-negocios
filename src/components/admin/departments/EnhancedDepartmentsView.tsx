import React, { useState, useEffect } from 'react';
import { User, Department } from '@/types/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Layers, Users, Activity, RefreshCw } from 'lucide-react';
import { DepartmentTreeView } from './DepartmentTreeView';
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUserData } from '@/integrations/supabase/client';
import { userAdapter, departmentAdapter } from '@/integrations/supabase/adapters';

export function EnhancedDepartmentsView() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('structure');

  // Simulated data loading - in a real app, this would fetch from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now - would be replaced with actual Supabase queries
        const mockDepartments = [{
          id: "1",
          name: "Diretoria",
          description: "Diretoria executiva",
          path: "/",
          level: 0,
          parent_id: null,
          manager_id: "1",
          settings: {},
          metadata: { memberCount: 2 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _memberCount: 2,
          manager: { first_name: "João", last_name: "Silva" }
        }, {
          id: "2",
          name: "Recursos Humanos",
          description: "Departamento de RH",
          path: "/1/",
          level: 1,
          parent_id: "1",
          manager_id: "2",
          settings: {},
          metadata: { memberCount: 5 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _memberCount: 5,
          manager: { first_name: "Maria", last_name: "Souza" }
        }];
        
        // Adapt the mock data
        const adaptedDepts = departmentAdapter(mockDepartments);
        const adaptedUsers = userAdapter(mockUserData());
        
        setDepartments(adaptedDepts);
        setUsers(adaptedUsers);
      } catch (error) {
        console.error("Error loading departments:", error);
        toast({
          title: "Erro ao carregar departamentos",
          description: "Não foi possível carregar os departamentos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Mock refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Dados atualizados",
        description: "Os dados dos departamentos foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setIsEditing(false);
    setShowFormDialog(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
    setShowFormDialog(true);
  };

  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setShowMembersDialog(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDepartment) return;
    
    // Mock deletion - would be replaced with actual Supabase delete query
    const updatedDepartments = departments.filter(d => d.id !== selectedDepartment.id);
    setDepartments(updatedDepartments);
    setShowDeleteDialog(false);
  };

  const handleSaveDepartment = (department: Department) => {
    if (isEditing && selectedDepartment) {
      // Edit existing department
      const updatedDepartments = departments.map(d => 
        d.id === department.id ? { ...d, ...department } : d
      );
      setDepartments(updatedDepartments);
      toast({
        title: "Departamento atualizado",
        description: `O departamento ${department.name} foi atualizado com sucesso.`,
      });
    } else {
      // Create new department with a mock ID
      const newDepartment = {
        ...department,
        id: `new-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setDepartments([...departments, newDepartment]);
      toast({
        title: "Departamento criado",
        description: `O departamento ${department.name} foi criado com sucesso.`,
      });
    }
    setShowFormDialog(false);
  };

  // Function to check if department has dependent entities
  const hasDependentEntities = (departmentId: string) => {
    // Check if any users belong to this department
    const hasUsers = users.some(user => user.department_id === departmentId);
    
    // Check if any departments have this as parent
    const hasChildDepartments = departments.some(dept => dept.parent_id === departmentId);
    
    return hasUsers || hasChildDepartments;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-medium">Departamentos</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={handleCreateDepartment}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="structure">
            <Layers className="h-4 w-4 mr-2" />
            Estrutura
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Membros
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura Organizacional</CardTitle>
              <CardDescription>
                Visualize e gerencie a hierarquia de departamentos da organização.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentTreeView
                departments={departments}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                onViewMembers={handleViewMembers}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membros por Departamento</CardTitle>
              <CardDescription>
                Visualize os usuários distribuídos por departamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Selecione um departamento na estrutura organizacional para visualizar seus membros.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Histórico de alterações nos departamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Não há atividades recentes para exibir.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DepartmentFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        department={selectedDepartment}
        departments={departments}
        users={users}
        onSave={handleSaveDepartment}
        isEditing={isEditing}
      />

      <DepartmentMembersDialog
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        department={selectedDepartment}
      />

      <DeleteDepartmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        department={selectedDepartment}
        onDelete={handleConfirmDelete}
        hasDependentEntities={selectedDepartment ? hasDependentEntities(selectedDepartment.id) : false}
      />
    </div>
  );
}
