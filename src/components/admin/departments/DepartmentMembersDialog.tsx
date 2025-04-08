
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department, UserDepartmentRoleMember } from '@/types/admin';
import DepartmentMembersList from './DepartmentMembersList';
import AddDepartmentMemberForm from './AddDepartmentMemberForm';
import { 
  fetchDepartmentUsers, 
  fetchAvailableUsers, 
  addDepartmentMember, 
  removeDepartmentMember 
} from './departmentMembersService';

export interface DepartmentMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

const DepartmentMembersDialog: React.FC<DepartmentMembersDialogProps> = ({
  open,
  onOpenChange,
  department
}) => {
  const [members, setMembers] = useState<UserDepartmentRoleMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Load data when dialog opens
  useEffect(() => {
    if (open && department?.id) {
      loadData();
    }
  }, [open, department?.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (department?.id) {
        // Use fetchDepartmentUsers instead of fetchDepartmentMembers
        const { users } = await fetchDepartmentUsers(Number(department.id));
        // Convert to the expected format for members
        const formattedMembers = users.map((user: any) => ({
          id: crypto.randomUUID(),
          user_id: user.id,
          department_id: department.id.toString(),
          role: 'member', // Default role
          start_date: null,
          end_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: user.id,
            first_name: user.name.split(' ')[0] || '',
            last_name: user.name.split(' ').slice(1).join(' ') || '',
            profile_image_url: null
          }
        }));
        
        setMembers(formattedMembers);
        
        // Fetch available users
        const usersData = await fetchAvailableUsers(Number(department.id));
        setAvailableUsers(usersData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new member
  const handleAddMember = async () => {
    if (!selectedUser || !department) return;
    
    setIsAddingMember(true);
    try {
      const newMember = await addDepartmentMember(
        selectedUser, 
        department, 
        selectedRole, 
        availableUsers
      );
      
      if (newMember) {
        setMembers(prev => [...prev, newMember]);
        setSelectedUser('');
      }
    } finally {
      setIsAddingMember(false);
    }
  };

  // Remove a member
  const handleRemoveMember = async (userId: string) => {
    const success = await removeDepartmentMember(userId);
    if (success) {
      setMembers(prev => prev.filter(member => member.user_id !== userId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Department Members - {department?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <AddDepartmentMemberForm
            availableUsers={availableUsers}
            selectedUser={selectedUser}
            selectedRole={selectedRole}
            isAddingMember={isAddingMember}
            onUserChange={setSelectedUser}
            onRoleChange={setSelectedRole}
            onAddMember={handleAddMember}
          />
          
          <DepartmentMembersList
            members={members}
            isLoading={isLoading}
            onRemoveMember={handleRemoveMember}
          />
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
