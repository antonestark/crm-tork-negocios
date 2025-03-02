
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Department, User, UserDepartmentRole } from '@/types/admin';
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, X, UserMinus } from 'lucide-react';

interface DepartmentMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
}

const DepartmentMembersDialog: React.FC<DepartmentMembersDialogProps> = ({
  isOpen,
  onClose,
  department
}) => {
  const [members, setMembers] = useState<(UserDepartmentRole & { user: User })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('member');
  const { toast } = useToast();

  // Fetch department members
  const fetchMembers = async () => {
    if (!department?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_department_roles')
        .select(`
          *,
          user:users(*)
        `)
        .eq('department_id', department.id);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching department members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load department members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch available users
  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      
      // Get current member IDs
      const memberIds = members.map(m => m.user_id);
      
      // Fetch users not in department
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('active', true)
        .not('id', 'in', memberIds.length ? `(${memberIds.join(',')})` : '()')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when dialog opens
  useEffect(() => {
    if (isOpen && department) {
      fetchMembers();
    }
  }, [isOpen, department, toast]);

  // Load available users when add members mode is activated
  useEffect(() => {
    if (showAddMembers) {
      fetchAvailableUsers();
    } else {
      setSelectedUsers([]);
    }
  }, [showAddMembers, members]);

  const handleRemoveMember = async (userId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_department_roles')
        .delete()
        .eq('user_id', userId)
        .eq('department_id', department.id);
      
      if (error) throw error;
      
      toast({
        title: 'Member Removed',
        description: 'User has been removed from the department',
      });
      
      // Refresh members list
      fetchMembers();
    } catch (error) {
      console.error('Error removing department member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member from department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Users Selected',
        description: 'Please select at least one user to add',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare records to insert
      const membersToAdd = selectedUsers.map(userId => ({
        user_id: userId,
        department_id: department.id,
        role: selectedRole
      }));
      
      const { error } = await supabase
        .from('user_department_roles')
        .insert(membersToAdd);
      
      if (error) throw error;
      
      toast({
        title: 'Members Added',
        description: `${selectedUsers.length} users have been added to the department`,
      });
      
      // Exit add mode and refresh members
      setShowAddMembers(false);
      fetchMembers();
    } catch (error) {
      console.error('Error adding department members:', error);
      toast({
        title: 'Error',
        description: 'Failed to add members to department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredMembers = members.filter(member => 
    `${member.user.first_name} ${member.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableUsers = availableUsers.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {showAddMembers ? 'Add Members' : 'Department Members'} - {department?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          
          {showAddMembers ? (
            <div className="flex items-center gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddMembers(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              
              <Button 
                size="sm"
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || loading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Selected
              </Button>
            </div>
          ) : (
            <Button 
              size="sm"
              onClick={() => setShowAddMembers(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Members
            </Button>
          )}
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {showAddMembers && (
                  <TableHead className="w-10">
                    <span className="sr-only">Select</span>
                  </TableHead>
                )}
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                {!showAddMembers && <TableHead>Added</TableHead>}
                {!showAddMembers && <TableHead className="w-10"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={showAddMembers ? 3 : 4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : showAddMembers ? (
                filteredAvailableUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                      No users available to add
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAvailableUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))
                )
              ) : filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No members in this department
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.user.first_name} {member.user.last_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {member.role}
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.user_id)}
                        title="Remove from department"
                      >
                        <UserMinus className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentMembersDialog;
