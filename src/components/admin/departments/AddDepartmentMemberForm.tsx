
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/admin';

interface AddDepartmentMemberFormProps {
  availableUsers: User[];
  selectedUser: string;
  selectedRole: string;
  isAddingMember: boolean;
  onUserChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onAddMember: () => void;
}

const AddDepartmentMemberForm: React.FC<AddDepartmentMemberFormProps> = ({
  availableUsers,
  selectedUser,
  selectedRole,
  isAddingMember,
  onUserChange,
  onRoleChange,
  onAddMember
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <Select value={selectedUser} onValueChange={onUserChange}>
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
      
      <Select value={selectedRole} onValueChange={onRoleChange}>
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
        onClick={onAddMember} 
        disabled={!selectedUser || isAddingMember}
      >
        {isAddingMember ? 'Adding...' : 'Add'}
      </Button>
    </div>
  );
};

export default AddDepartmentMemberForm;
