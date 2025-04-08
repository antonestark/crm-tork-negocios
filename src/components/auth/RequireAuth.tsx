
import React, { ReactNode, useEffect, useState } from 'react';
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Simplificado: apenas verifica se o usuário está autenticado
    if (!isLoading) {
      setCheckingAuth(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login page with return path
        navigate('/login', { state: { from: location.pathname } });
      } else if (sessionExpired) {
        // Try to refresh the session
        const tryRefresh = async () => {
          const success = await refreshSession();
          if (!success) {
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            navigate('/login', { state: { from: location.pathname } });
          }
        };
        tryRefresh();
      }
    }
  }, [user, isLoading, sessionExpired, navigate, location, refreshSession]);

  if (isLoading || checkingAuth) {
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
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
