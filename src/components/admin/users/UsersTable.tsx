
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, TrashIcon, KeyIcon, EyeIcon } from "lucide-react";
import { format } from 'date-fns';
import { User, Department } from '@/types/admin';
import { UserFilters } from './UserFilters';
import UserFormDialog from './UserFormDialog';
import UserDetailsDialog from './UserDetailsDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import ConfirmDialog from '../shared/ConfirmDialog';
import { supabase, userAdapter, departmentAdapter } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

export const UsersTable = ({ filters }: UsersTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentFilters(filters);
    fetchUsers();
    fetchDepartments();
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');

      if (error) throw error;

      const adaptedDepartments = departmentAdapter(data || []);
      setDepartments(adaptedDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select('*, departments:department_id(*)');

      // Apply filters
      if (currentFilters.status && currentFilters.status !== 'all') {
        const isActive = currentFilters.status === 'active';
        query = query.eq('active', isActive);
      }

      if (currentFilters.department && currentFilters.department !== 'all') {
        query = query.eq('department_id', currentFilters.department);
      }

      if (currentFilters.search) {
        query = query.or(`first_name.ilike.%${currentFilters.search}%,last_name.ilike.%${currentFilters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const adaptedUsers = userAdapter(data || []);
      setUsers(adaptedUsers);
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

  const handleStatusChange = (status: string) => {
    setCurrentFilters({ ...currentFilters, status });
    fetchUsers();
  };

  const handleDepartmentChange = (department: string) => {
    setCurrentFilters({ ...currentFilters, department });
    fetchUsers();
  };

  const handleSearchChange = (search: string) => {
    setCurrentFilters({ ...currentFilters, search });
    fetchUsers();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsUserPermissionsOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleSaveUser = async (formData: Partial<User>) => {
    try {
      const { first_name, last_name, role, active, department_id, phone, profile_image_url } = formData;
      
      const userData = {
        first_name: first_name || '',
        last_name: last_name || '',
        role: role || 'user',
        active: active !== undefined ? active : true,
        department_id,
        phone,
        profile_image_url
      };

      const { error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User added successfully',
      });

      setIsAddUserOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async (formData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
          active: formData.active,
          department_id: formData.department_id,
          phone: formData.phone,
          profile_image_url: formData.profile_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      setIsEditUserOpen(false);
      fetchUsers();
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

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      setIsDeleteUserOpen(false);
      
      // Update the users list by removing the deleted user
      setUsers(users.filter(u => u.id !== selectedUser.id));
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
        <h2 className="text-3xl font-bold">Users</h2>
        <Button onClick={handleAddUser}>Add User</Button>
      </div>

      <UserFilters 
        filters={currentFilters}
        departments={departments}
        onStatusChange={handleStatusChange}
        onDepartmentChange={handleDepartmentChange}
        onSearchChange={handleSearchChange}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found with the current filters.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department?.name || '—'}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <Badge variant="outline">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.created_at && format(new Date(user.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewUserDetails(user)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleManagePermissions(user)}>
                        <KeyIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteUser(user)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      {isAddUserOpen && (
        <UserFormDialog
          open={true}
          onOpenChange={setIsAddUserOpen}
          departments={departments}
          onSave={handleSaveUser}
        />
      )}

      {/* Edit User Dialog */}
      {isEditUserOpen && selectedUser && (
        <UserFormDialog
          open={true}
          onOpenChange={setIsEditUserOpen}
          departments={departments}
          user={selectedUser}
          onSave={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.first_name} ${selectedUser?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />

      {/* User Details Dialog */}
      {isUserDetailsOpen && selectedUser && (
        <UserDetailsDialog
          open={true}
          onOpenChange={setIsUserDetailsOpen}
          userId={selectedUser.id}
        />
      )}

      {/* User Permissions Dialog */}
      {isUserPermissionsOpen && selectedUser && (
        <UserPermissionsDialog
          open={true}
          onOpenChange={setIsUserPermissionsOpen}
          userId={selectedUser.id}
          userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
        />
      )}
    </div>
  );
};
