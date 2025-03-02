
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Key, Clock, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserFormDialog } from "./UserFormDialog";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { UserPermissionsDialog } from "./UserPermissionsDialog";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  department_id: string | null;
  department?: {
    name: string;
  };
  status: string;
  last_login: string | null;
  profile_image_url: string | null;
  phone: string | null;
  active: boolean;
}

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

export function UsersTable({ filters }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      
      try {
        let query = supabase
          .from('users')
          .select(`
            *,
            department:departments(name)
          `);
          
        // Apply filters
        if (filters.status !== 'all') {
          if (filters.status === 'active') {
            query = query.eq('active', true);
          } else if (filters.status === 'inactive') {
            query = query.eq('active', false);
          }
        }
        
        if (filters.department !== 'all') {
          query = query.eq('department_id', filters.department);
        }
        
        if (filters.search) {
          query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Ocorreu um erro ao buscar a lista de usuários.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [filters]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive"
      });
    } finally {
      setShowConfirmDelete(false);
      setSelectedUser(null);
    }
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge variant="default" className="bg-success">Ativo</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-10 w-28 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              // Users list
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.profile_image_url || undefined} alt={`${user.first_name} ${user.last_name}`} />
                      <AvatarFallback>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department?.name || '-'}</TableCell>
                  <TableCell>{getStatusBadge(user.active)}</TableCell>
                  <TableCell>
                    {user.last_login 
                      ? format(new Date(user.last_login), "dd 'de' MMM, yyyy", { locale: ptBR })
                      : 'Nunca acessou'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Detalhes</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissionsDialog(true);
                        }}
                      >
                        <Key className="h-4 w-4" />
                        <span className="sr-only">Permissões</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowConfirmDelete(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Edit Dialog */}
      {selectedUser && (
        <UserFormDialog 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog}
          user={selectedUser}
          onUserUpdated={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          }}
        />
      )}

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          user={selectedUser}
        />
      )}

      {/* User Permissions Dialog */}
      {selectedUser && (
        <UserPermissionsDialog
          open={showPermissionsDialog}
          onOpenChange={setShowPermissionsDialog}
          user={selectedUser}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir o usuário ${selectedUser?.first_name} ${selectedUser?.last_name}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
