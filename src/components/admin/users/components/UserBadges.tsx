
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
  <Badge variant="default">
    {role === 'admin' 
      ? 'Administrador' 
      // : role === 'super_admin'  // Removido super_admin
      //   ? 'Super Admin' 
        : 'Usuário' // Simplificado: ou é admin ou é Usuário
    }
  </Badge>
);
