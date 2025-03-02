
import { useState, useEffect } from 'react';
import { supabase, userAdapter } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Shield, EyeIcon } from 'lucide-react';
import { UserFilters } from './UserFilters';
import { UserFormDialog } from './UserFormDialog';
import { UserPermissionsDialog } from './UserPermissionsDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface UsersTableProps {
  filters?: {
    status: string;
    department: string;
    search: string;
  };
}

export function UsersTable({ filters = { status: 'all', department: 'all', search: '' } }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentFilters, setCurrentFilters] = useState(filters);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, currentFilters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('users').select(`
        *,
        department:departments(name)
      `);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Use the adapter to ensure all required fields are present
      const adaptedData = userAdapter(data || []);
      setUsers(adaptedData);
      setFilteredUsers(adaptedData);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];
    
    // Apply status filter
    if (currentFilters.status !== 'all') {
      const activeStatus = currentFilters.status === 'active';
      result = result.filter(user => user.active === activeStatus);
    }
    
    // Apply department filter
    if (currentFilters.department !== 'all') {
      result = result.filter(user => user.department_id === currentFilters.department);
    }
    
    // Apply search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredUsers(result);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setCurrentFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleSaveUser = async (formData: Partial<User>) => {
    try {
      if (selectedUser) {
        // Update existing user
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
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert({
            id: crypto.randomUUID(), // Generate an ID
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
      
      setIsFormOpen(false);
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
      setIsDeleteConfirmOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <UserFilters 
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onAddUser={() => {
          setSelectedUser(null);
          setIsFormOpen(true);
        }}
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
      
      {isFormOpen && (
        <UserFormDialog 
          open={true}
          onOpenChange={setIsFormOpen}
          onSubmit={handleSaveUser}
          user={selectedUser}
        />
      )}
      
      {isPermissionsOpen && selectedUser && (
        <UserPermissionsDialog 
          open={true}
          onOpenChange={setIsPermissionsOpen}
          user={selectedUser}
        />
      )}
      
      {isDetailsOpen && selectedUser && (
        <UserDetailsDialog 
          open={true}
          onOpenChange={setIsDetailsOpen}
          user={selectedUser}
        />
      )}
      
      <ConfirmDialog 
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.first_name} ${selectedUser?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
