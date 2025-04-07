
import React from 'react';
import { User } from '@/types/admin';
import { ensureDepartmentFormat } from '../UsersTable.helper';
import { StatusBadge, RoleBadge } from './UserBadges';
import UserActions from './UserActions';

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

interface RenderedRow {
  name: React.ReactNode;
  role: React.ReactNode;
  department: React.ReactNode;
  status: React.ReactNode;
  actions: React.ReactNode;
}

export const UserRow = ({ 
  user, 
  onEdit, 
  onDelete 
}: UserRowProps): RenderedRow => {
  return {
    name: (
      <div className="flex flex-col">
<span className="font-medium text-gray-200">{`${user.first_name} ${user.last_name}`}</span>
<span className="text-xs text-gray-200">{user.email}</span>
      </div>
    ),
    role: <RoleBadge role={user.role} />,
    department: (
<span className="text-gray-200">
        {user.department ? ensureDepartmentFormat(user.department).name : 'Sem departamento'}
      </span>
    ),
    status: <StatusBadge active={user.active} />,
    actions: <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />,
  };
};

export default UserRow;
