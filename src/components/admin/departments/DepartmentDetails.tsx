
import React from 'react';
import { Edit, Lock, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Department, User } from '@/types/admin';
import { useUsers } from '@/hooks/use-users';
import { compareDepartmentIds } from './EnhancedDepartmentsView';

interface DepartmentDetailsProps {
  department: Department;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (department: Department) => void;
  onViewMembers: (department: Department) => void;
  onManagePermissions: (department: Department) => void;
}

export function DepartmentDetails({
  department,
  onEditDepartment,
  onDeleteDepartment,
  onViewMembers,
  onManagePermissions,
}: DepartmentDetailsProps) {
  const { users } = useUsers();
  
  // Get department members
  const getDepartmentMembers = (departmentId: string) => {
    return users.filter(user => compareDepartmentIds(user.department_id, departmentId));
  };
  
  const departmentMembers = getDepartmentMembers(department.id);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{department.name}</h2>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewMembers(department)}
          >
            <Users className="h-4 w-4 mr-1" /> Membros
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePermissions(department)}
          >
            <Lock className="h-4 w-4 mr-1" /> Permissões
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditDepartment(department)}
          >
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteDepartment(department)}
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
                <dd>{department.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Criado em</dt>
                <dd>{new Date(department.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Última atualização</dt>
                <dd>{new Date(department.updated_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Gerente</dt>
                <dd>
                  {department.manager 
                    ? `${department.manager.first_name} ${department.manager.last_name}`
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
              {departmentMembers.slice(0, 5).map((user) => (
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
              
              {departmentMembers.length > 5 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => onViewMembers(department)}
                >
                  Ver todos os membros
                </Button>
              )}
              
              {departmentMembers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Este departamento não possui membros.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
