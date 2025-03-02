
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UserFilters from './UserFilters';
import UserFormDialog from './UserFormDialog';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import UserDetailsDialog from './UserDetailsDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { supabase, departmentAdapter, mockUserData } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import type { User, Department } from '@/types/admin';

export interface UserTableProps {
  filters?: {
    status: string;
    department: string;
    search: string;
  };
}

const UsersTable: React.FC<UserTableProps> = ({ filters = { status: 'all', department: 'all', search: '' } }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentFilters, setCurrentFilters] = useState(filters);

  // Local state for filtering
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [departmentFilter, setDepartmentFilter] = useState(filters.department);
  const [searchFilter, setSearchFilter] = useState(filters.search);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, statusFilter, departmentFilter, searchFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the Supabase API
      // For now, use mock data
      const mockUsers = mockUserData();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from('departments').select('*');
      
      if (error) {
        throw error;
      }
      
      const adaptedDepartments = departmentAdapter(data || []);
      setDepartments(adaptedDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filter by department
    if (departmentFilter && departmentFilter !== 'all') {
      filtered = filtered.filter(user => user.department_id === departmentFilter);
    }

    // Filter by search
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserForm(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setShowUserPermissions(true);
  };

  const saveUser = async (formData: Partial<User>) => {
    try {
      // In a real implementation, this would call the Supabase API
      console.log('Saving user:', formData);
      toast({
        title: 'Success',
        description: 'User saved successfully.',
      });
      await fetchUsers();
      setShowAddUserForm(false);
      setShowEditUserForm(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to save user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real implementation, this would call the Supabase API
      console.log('Deleting user:', selectedUser.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
      });
      await fetchUsers();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>
      
      <UserFilters 
        status={statusFilter}
        department={departmentFilter}
        search={searchFilter}
        departments={departments}
        onStatusChange={setStatusFilter}
        onDepartmentChange={setDepartmentFilter}
        onSearchChange={setSearchFilter}
      />
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const department = departments.find(d => d.id === user.department_id);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profile_image_url || undefined} />
                            <AvatarFallback>
                              {user.first_name.charAt(0) + user.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{department?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 
                                 user.status === 'inactive' ? 'secondary' : 
                                 user.status === 'blocked' ? 'destructive' : 'outline'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewUserDetails(user)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleManagePermissions(user)}
                          >
                            Permissions
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add User Dialog */}
      {showAddUserForm && (
        <UserFormDialog
          open={showAddUserForm}
          onOpenChange={setShowAddUserForm}
          departments={departments}
          onSave={saveUser}
        />
      )}
      
      {/* Edit User Dialog */}
      {showEditUserForm && selectedUser && (
        <UserFormDialog
          open={showEditUserForm}
          onOpenChange={setShowEditUserForm}
          departments={departments}
          user={selectedUser}
          onSave={saveUser}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.first_name} ${selectedUser?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
      
      {/* User Details Dialog */}
      {showUserDetails && selectedUser && (
        <UserDetailsDialog
          open={showUserDetails}
          onOpenChange={setShowUserDetails}
          userId={selectedUser.id}
          firstName={selectedUser.first_name}
          lastName={selectedUser.last_name}
        />
      )}
      
      {/* User Permissions Dialog */}
      {showUserPermissions && selectedUser && (
        <UserPermissionsDialog
          open={showUserPermissions}
          onOpenChange={setShowUserPermissions}
          user={{
            id: selectedUser.id,
            name: `${selectedUser.first_name} ${selectedUser.last_name}`
          }}
        />
      )}
    </div>
  );
};

export default UsersTable;
