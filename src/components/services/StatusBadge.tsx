
import React from 'react';
import { Badge } from "@/components/ui/badge";

type StatusType = 'pending' | 'in_progress' | 'completed' | 'canceled' | 'blocked' | string;

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', variant: 'outline' as const };
      case 'in_progress':
        return { label: 'Em Progresso', variant: 'default' as const };
      case 'completed':
        return { label: 'Concluído', variant: 'success' as const };
      case 'canceled':
        return { label: 'Cancelado', variant: 'destructive' as const };
      case 'blocked':
        return { label: 'Bloqueado', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge 
      variant={variant} 
      className={`px-2 py-1 ${
        variant === 'success' ? 'bg-green-500 hover:bg-green-600' : 
        variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : ''
      }`}
    >
      {label}
    </Badge>
  );
};
