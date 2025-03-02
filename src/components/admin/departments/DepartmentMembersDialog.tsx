import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, mockUserDepartmentRoleData, userAdapter } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string | null;
  role: string;
  // Other user properties
}

interface Department {
  id: string;
  name: string;
  // Other department properties
}

interface UserDepartmentRole {
  id: string;
  user_id: string;
  department_id: string;
  role: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface DepartmentMembersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department;
}

const DepartmentMembersDialog: React.FC<DepartmentMembersDialogProps> = ({
  isOpen,
  onOpenChange,
  department
}) => {
  const [members, setMembers] = useState<(UserDepartmentRole & { user: User })[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const { toast } = useToast();

  // Fetch department members
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      // Since we don't have the actual table, we'll use mock data
      const mockData = mockUserDepartmentRoleData('', department.id);
      setMembers(mockData);
    } catch (error) {
      console.error('Error fetching department members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load department members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available users
  const fetchAvailableUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      
      if (error) throw error;
      
      if (data) {
        const adaptedUsers = userAdapter(data);
        setAvailableUsers(adaptedUsers);
      }
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen && department?.id) {
      fetchMembers();
      fetchAvailableUsers();
    }
  }, [isOpen, department?.id]);

  // Add a new member
  const handleAddMember = async () => {
    if (!selectedUser) return;
    
    setIsAddingMember(true);
    try {
      // Mock the API call since we don't have the actual table
      // In a real app, you would do:
      // const { error } = await supabase.from('user_department_roles').insert([{
      //   user_id: selectedUser,
      //   department_id: department.id,
      //   role: selectedRole
      // }]);
      
      // if (error) throw error;
      
      // Instead, we'll just update our local state
      const userToAdd = availableUsers.find(user => user.id === selectedUser);
      if (userToAdd) {
        const newMember = {
          id: `new-${Date.now()}`,
          user_id: selectedUser,
          department_id: department.id,
          role: selectedRole,
          start_date: new Date().toISOString(),
          end_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: userToAdd
        };
        
        setMembers(prev => [...prev, newMember]);
        setSelectedUser('');
        
        toast({
          title: 'Success',
          description: 'Member added to department',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  // Remove a member
  const handleRemoveMember = async (userId: string) => {
    try {
      // Mock the API call
      // In a real app, you would do:
      // const { error } = await supabase
      //   .from('user_department_roles')
      //   .delete()
      //   .eq('user_id', userId)
      //   .eq('department_id', department.id);
      
      // if (error) throw error;
      
      // Update local state
      setMembers(prev => prev.filter(member => member.user_id !== userId));
      
      toast({
        title: 'Success',
        description: 'Member removed from department',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Department Members - {department?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex gap-2 mb-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAddMember} 
              disabled={!selectedUser || isAddingMember}
            >
              {isAddingMember ? 'Adding...' : 'Add'}
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">Loading members...</td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">No members in this department</td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr key={member.id} className="border-t">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {member.user.profile_image_url && (
                              <AvatarImage src={member.user.profile_image_url} />
                            )}
                            <AvatarFallback>
                              {member.user.first_name.charAt(0)}{member.user.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.user.first_name} {member.user.last_name}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={
                          member.role === 'admin' ? 'destructive' : 
                          member.role === 'manager' ? 'default' : 'secondary'
                        }>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveMember(member.user_id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentMembersDialog;
