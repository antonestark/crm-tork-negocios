import React, { useState, useEffect } from 'react';
import { supabase, userAdapter } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Key, Eye, Plus } from 'lucide-react';
import { UserFilters } from './UserFilters';
import UserFormDialog from './UserFormDialog';
import UserDetailsDialog from './UserDetailsDialog';
import UserPermissionsDialog from './UserPermissionsDialog';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for our components
interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  active: boolean;
  department_id: string | null;
  phone: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  last_login: string | null;
  settings: Record<string, any>;
  metadata: Record<string, any>;
}

interface Department {
  id: string;
  name: string;
  description?: string | null;
}

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

export const UsersTable: React.FC<UsersTableProps> = ({ filters: initialFilters }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('*');

      if (filters.status !== 'all') {
        query = query.eq('active', filters.status === 'active');
      }

      if (filters.department !== 'all') {
        query = query.eq('department_id', filters.department);
      }

      if (filters.search) {
        query = query.ilike('first_name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      }

      if (data) {
        const adaptedUsers = userAdapter(data);
        setUsers(adaptedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load departments',
          variant: 'destructive',
        });
      }

      if (data) {
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };

  const handleCreateUser = async (formData: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            ...formData,
            id: Math.random().toString(36).substring(2, 15), // Generate a random ID
          },
        ]);

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: 'Error',
          description: 'Failed to create user',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async (formData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: 'Error',
          description: 'Failed to update user',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
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
        status={filters.status}
        department={filters.department}
        search={filters.search}
        onStatusChange={(status) => handleFilterChange({ status })}
        onDepartmentChange={(department) => handleFilterChange({ department })}
        onSearchChange={(search) => handleFilterChange({ search })}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Loading users...</TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No users found.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewPermissions(user)}>
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {showAddDialog && (
        <UserFormDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSave={handleCreateUser}
        />
      )}

      {showEditDialog && selectedUser && (
        <UserFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={selectedUser}
          onSave={handleUpdateUser}
        />
      )}

      {showDeleteDialog && selectedUser && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          description={`Are you sure you want to delete the user "${selectedUser.first_name} ${selectedUser.last_name}"?`}
          confirmText="Delete"
          variant="destructive"
        />
      )}

      {showDetailsDialog && selectedUser && (
        <UserDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          user={selectedUser}
        />
      )}
      
      {showPermissionsDialog && selectedUser && (
        <UserPermissionsDialog
          open={showPermissionsDialog}
          onOpenChange={setShowPermissionsDialog}
          user={selectedUser}
        />
      )}
    </div>
  );
};
