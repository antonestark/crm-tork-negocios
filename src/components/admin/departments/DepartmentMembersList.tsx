
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types/admin';

export interface UserDepartmentRoleMember {
  id: string;
  user_id: string;
  department_id: string;
  role: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  user: Partial<User>;
}

interface DepartmentMembersListProps {
  members: UserDepartmentRoleMember[];
  isLoading: boolean;
  onRemoveMember: (userId: string) => void;
}

const DepartmentMembersList: React.FC<DepartmentMembersListProps> = ({
  members,
  isLoading,
  onRemoveMember
}) => {
  return (
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
                    onClick={() => onRemoveMember(member.user_id)}
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
  );
};

export default DepartmentMembersList;
