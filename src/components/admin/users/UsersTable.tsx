import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon, Trash2Icon, EyeIcon, KeyRoundIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, mockUserData, userAdapter } from '@/integrations/supabase/client';
import UserFormDialog from './UserFormDialog';
import UserDetailsDialog from './UserDetailsDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { UserFilters } from './UserFilters';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { Department, User, UserStatus } from '@/types/admin';

interface UsersTableProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
}

export function UsersTable({ filters: initialFilters }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  
  const handleStatusChange = (status: string) => {
    setFilters({
      ...filters,
      status,
    });
  };
  
  const handleDepartmentChange = (department: string) => {
    setFilters({
      ...filters,
      department,
    });
  };
  
  const handleSearchChange = (search: string) => {
    setFilters({
      ...filters,
      search,
    });
  };
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const mockUsers = mockUserData();
      
      let filteredUsers = [...mockUsers];
      
      if (filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.status === filters.status
        );
      }
      
      if (filters.department !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.department_id === filters.department
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.first_name.toLowerCase().includes(searchLower) || 
          user.last_name.toLowerCase().includes(searchLower)
        );
      }
      
      setUsers(filteredUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDepartments = async () => {
    try {
      setDepartments([
        { 
          id: '1', 
          name: 'Marketing', 
          description: 'Marketing department',
          path: 'marketing',
          level: 1,
          parent_id: null,
          manager_id: null,
          settings: {},
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Engineering', 
          description: 'Engineering department',
          path: 'engineering',
          level: 1,
          parent_id: null,
          manager_id: null,
          settings: {},
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error: any) {
      console.error('Error fetching departments:', error.message);
    }
  };
  
  const createUser = async (formData: Partial<User>) => {
    try {
      const status = (formData.status as UserStatus) || 'active';
      
      const newUser: User = {
        id: Date.now().toString(),
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        role: formData.role || 'user',
        active: formData.active !== undefined ? formData.active : true,
        status: status,
        department_id: formData.department_id || null,
        phone: formData.phone || null,
        profile_image_url: formData.profile_image_url || null,
        last_login: formData.last_login || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        settings: formData.settings || {},
        metadata: formData.metadata || {},
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error.message);
      toast.error('Failed to create user');
    }
  };
  
  const updateUser = async (formData: Partial<User>) => {
    try {
      if (!formData.id) {
        throw new Error('User ID is required');
      }
      
      const status = formData.status as UserStatus | undefined;
      
      setUsers(prev => prev.map(user => 
        user.id === formData.id ? { 
          ...user, 
          ...formData, 
          status: status || user.status,
          updated_at: new Date().toISOString() 
        } : user
      ));
      
      toast.success('User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error.message);
      toast.error('Failed to update user');
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error.message);
      toast.error('Failed to delete user');
    }
  };
  
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [filters]);
  
  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };
  
  const handleViewClick = (user: User) => {
    setCurrentUser(user);
    setViewDialogOpen(true);
  };
  
  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setConfirmDeleteOpen(true);
  };
  
  const handlePermissionsClick = (user: User) => {
    setCurrentUser(user);
    setPermissionsDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <UserFilters 
        status={filters.status}
        department={filters.department}
        search={filters.search}
        onStatusChange={handleStatusChange}
        onDepartmentChange={handleDepartmentChange}
        onSearchChange={handleSearchChange}
      />
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  No users found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              users.map(user => {
                const department = departments.find(d => d.id === user.department_id);
                
                return (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{department?.name || '-'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewClick(user)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handlePermissionsClick(user)}>
                          <KeyRoundIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {addDialogOpen && (
        <UserFormDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={createUser}
        />
      )}
      
      {editDialogOpen && currentUser && (
        <UserFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={currentUser}
          onSave={updateUser}
        />
      )}
      
      {viewDialogOpen && currentUser && (
        <UserDetailsDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          userData={currentUser}
        />
      )}
      
      {confirmDeleteOpen && currentUser && (
        <ConfirmDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title="Delete User"
          description={`Are you sure you want to delete ${currentUser.first_name} ${currentUser.last_name}? This action cannot be undone.`}
          onConfirm={() => deleteUser(currentUser.id)}
          confirmText="Delete"
          variant="destructive"
        />
      )}
      
      {permissionsDialogOpen && currentUser && (
        <UserPermissionsDialog
          open={permissionsDialogOpen}
          onOpenChange={setPermissionsDialogOpen}
          user={currentUser}
        />
      )}
    </div>
  );
}
