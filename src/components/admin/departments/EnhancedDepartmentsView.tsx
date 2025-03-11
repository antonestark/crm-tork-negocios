import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users, Building, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Department, User } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDepartments } from '@/hooks/use-departments';
import { useUsers } from '@/hooks/use-users';
import DepartmentFormDialog from './DepartmentFormDialog';
import DepartmentMembersDialog from './DepartmentMembersDialog';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function compareDepartmentIds(userId: number | null, departmentId: string): boolean {
  if (userId === null) return false;
  return String(userId) === departmentId;
}

export function EnhancedDepartmentsView() {
  const { departments, loading, error, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const { users } = useUsers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get department members
  const getDepartmentMembers = (departmentId: string) => {
    return users.filter(user => compareDepartmentIds(user.department_id, departmentId));
  };
  
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
  
  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    
    const departmentMembers = getDepartmentMembers(departmentToDelete.id);
    if (departmentMembers.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Este departamento possui membros associados. Remova os membros primeiro.",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      return;
    }
    
    const success = await deleteDepartment(departmentToDelete.id);
    if (success) {
      toast({
        title: "Departamento excluído",
        description: "O departamento foi excluído com sucesso."
      });
      if (selectedDepartment?.id === departmentToDelete.id) {
        setSelectedDepartment(null);
      }
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o departamento.",
        variant: "destructive"
      });
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Handle view members
  const handleViewMembers = (department: Department) => {
    setSelectedDepartment(department);
    setIsMembersOpen(true);
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
        toast({
          title: "Departamento atualizado",
          description: "As alterações foram salvas com sucesso."
        });
      }
    } else {
      // Create new department
      success = await addDepartment(data as Department);
      
      if (success) {
        toast({
          title: "Departamento criado",
          description: "O novo departamento foi criado com sucesso."
        });
      }
    }
    
    if (!success) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o departamento.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Departments List */}
      <div className="w-1/3 border-r pr-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Departamentos</h2>
          <Button onClick={handleNewDepartment} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Novo
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar departamentos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[calc(100vh-220px)]">
          {loading ? (
            <p className="text-center py-4">Carregando departamentos...</p>
          ) : error ? (
            <p className="text-center py-4 text-destructive">Erro ao carregar departamentos</p>
          ) : filteredDepartments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">Nenhum departamento encontrado</p>
          ) : (
            <div className="space-y-2">
              {filteredDepartments.map((department) => (
                <div
                  key={department.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedDepartment?.id === department.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectDepartment(department)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{department.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {department.description || 'Sem descrição'}
                  </p>
                  <div className="flex items-center mt-2">
                    <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {department._memberCount || getDepartmentMembers(department.id).length} membros
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Department Details */}
      <div className="w-2/3 pl-6">
        {selectedDepartment ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                <p className="text-muted-foreground">{selectedDepartment.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMembers(selectedDepartment)}
                >
                  <Users className="h-4 w-4 mr-1" /> Membros
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditDepartment(selectedDepartment)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(selectedDepartment)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                      <dd>{selectedDepartment.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Criado em</dt>
                      <dd>{new Date(selectedDepartment.created_at).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                      <dd>{new Date(selectedDepartment.updated_at).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Gerente</dt>
                      <dd>
                        {selectedDepartment.manager 
                          ? `${selectedDepartment.manager.first_name} ${selectedDepartment.manager.last_name}`
                          : 'Não definido'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Membros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getDepartmentMembers(selectedDepartment.id).slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </div>
                          <span>{user.first_name} {user.last_name}</span>
                        </div>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    ))}
                    
                    {getDepartmentMembers(selectedDepartment.id).length > 5 && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => handleViewMembers(selectedDepartment)}
                      >
                        Ver todos os membros
                      </Button>
                    )}
                    
                    {getDepartmentMembers(selectedDepartment.id).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Este departamento não possui membros.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o departamento "{departmentToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
