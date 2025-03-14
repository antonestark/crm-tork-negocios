
import React, { ReactNode } from 'react';
import { useCheckPermission } from '@/hooks/use-check-permission';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequirePermissionProps {
  permissionCode: string;
  children: ReactNode;
  fallbackPath?: string;
}

export function RequirePermission({
  permissionCode,
  children,
  fallbackPath = '/'
}: RequirePermissionProps) {
  const { hasPermission, loading } = useCheckPermission(permissionCode);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
          <p className="mb-6">
            Você não tem permissão para acessar esta página. Entre em contato com o administrador
            se você acredita que isso é um erro.
          </p>
          <Button onClick={() => navigate(fallbackPath)}>Voltar</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
