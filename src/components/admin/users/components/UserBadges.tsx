
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/admin';

interface StatusBadgeProps {
  active?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ active }) => (
  <Badge variant={active ? 'success' : 'destructive'}>
    {active ? 'Ativo' : 'Inativo'}
  </Badge>
);

interface RoleBadgeProps {
  role?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => (
  <Badge variant={role === 'admin' ? 'default' : 'outline'}>
    {role === 'admin' 
      ? 'Administrador' 
      : role === 'super_admin' 
        ? 'Super Admin' 
        : 'Usuário'
    }
  </Badge>
);

export { StatusBadge, RoleBadge };
