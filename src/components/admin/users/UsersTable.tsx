import { useState, useEffect } from 'react';
import { supabase, userAdapter } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shield, EyeIcon, Plus } from 'lucide-react';
import { UserFilters } from './UserFilters';
import { UserFormDialog } from './UserFormDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from 'sonner';

interface UsersTableProps {
  filters?: {
    status: string;
    department: string;
    search: string;
  };
}

export const UsersTable = ({ filters: initialFilters }: UsersTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*, departments:department_id(*)');
      
      if (error) throw error;

      const adaptedUsers = userAdapter(data);
      setUsers(adaptedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;

      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const applyFilters = () => {
    let result = [...users];
    
    if (filters.status !== 'all') {
      const activeStatus = filters.status === 'active';
      result = result.filter(user => user.active === activeStatus);
    }
    
    if (filters.department !== 'all') {
      result = result.filter(user => user.department_id === filters.department);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredUsers(result);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsConfirmDialogOpen(true);
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<User>) => {
    try {
      if (selectedUser) {
        const { error } = await supabase
          .from('users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            phone: formData.phone,
            department_id: formData.department_id,
            active: formData.active,
            profile_image_url: formData.profile_image_url
          })
          .eq('id', selectedUser.id);
          
        if (error) throw error;
        
        toast.success('User updated successfully');
      } else {
        const { error } = await supabase
          .from('users')
          .insert({
            id: crypto.randomUUID(),
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            role: formData.role || 'user',
            phone: formData.phone,
            department_id: formData.department_id,
            active: formData.active !== undefined ? formData.active : true,
            profile_image_url: formData.profile_image_url
          });
          
        if (error) throw error;
        
        toast.success('User created successfully');
      }
      
      setIsEditDialogOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast.success('User deleted successfully');
      setIsConfirmDialogOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <UserFilters 
        filters={filters}
        departments={departments}
        onStatusChange={(status) => handleFilterChange({ status })}
        onDepartmentChange={(department) => handleFilterChange({ department })}
        onSearchChange={(search) => handleFilterChange({ search })}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profile_image_url || undefined} />
                        <AvatarFallback>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="text-sm text-muted-foreground">{user.phone || 'No phone'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.department?.name || 'No department'}
                  </TableCell>
                  <TableCell>
                    {user.active ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(user)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleViewPermissions(user)}>
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
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

      {isAddDialogOpen && (
        <UserFormDialog 
          open={true} 
          onOpenChange={setIsAddDialogOpen}
          departments={departments}
          onSave={handleFormSubmit}
        />
      )}

      {isEditDialogOpen && selectedUser && (
        <UserFormDialog 
          open={true} 
          onOpenChange={setIsEditDialogOpen}
          departments={departments}
          user={selectedUser}
          onSave={handleFormSubmit}
        />
      )}

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.first_name} ${selectedUser?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
      />

      {isDetailsDialogOpen && selectedUser && (
        <UserDetailsDialog 
          open={true}
          onOpenChange={setIsDetailsDialogOpen}
          user={selectedUser}
        />
      )}

      {isPermissionsDialogOpen && selectedUser && (
        <UserPermissionsDialog 
          open={true}
          onOpenChange={setIsPermissionsDialogOpen}
          user={selectedUser}
        />
      )}
    </div>
  );
};
