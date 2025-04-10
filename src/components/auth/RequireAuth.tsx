
import React, { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useAuthState } from '@/hooks/use-auth-state';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const { sessionExpired, refreshSession } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Não faça nada se ainda estiver carregando
    if (isLoading) {
      console.log('Carregando estado de autenticação...');
      return;
    }

    const checkAuthentication = async () => {
      if (!user) {
        // Redirect to login page with return path
        console.log('Usuário não autenticado, redirecionando para login...');
        navigate('/login', { state: { from: location.pathname } });
      } else if (sessionExpired) {
        // Try to refresh the session
        console.log('Sessão expirada, tentando atualizar...');
        const success = await refreshSession();
        
        if (!success) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate('/login', { state: { from: location.pathname } });
        } else {
          toast.success("Sessão atualizada com sucesso");
        }
      }
    };

    checkAuthentication();
  }, [user, isLoading, sessionExpired, navigate, location, refreshSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Return null while redirecting
    return null;
  }

  return <>{children}</>;
}
