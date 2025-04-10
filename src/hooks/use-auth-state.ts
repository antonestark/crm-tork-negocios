
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  sessionExpired: boolean;
};

export const useAuthState = () => {
  const { user, isLoading, session } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Automatically attempt to refresh expired sessions
  useEffect(() => {
    const handleSessionRefresh = async () => {
      // Only attempt refresh if we're not loading and session is expired
      if (!isLoading && !session && user?.id) {
        console.log('Sessão possivelmente expirada, tentando atualizar...');
        await refreshSession();
      }
    };

    handleSessionRefresh();
  }, [isLoading, session, user]);

  const refreshSession = async () => {
    try {
      setIsRefreshing(true);
      console.log('Tentando atualizar sessão...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Erro ao atualizar sessão:", error);
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        return false;
      }
      
      if (data.session) {
        console.log("Sessão atualizada com sucesso");
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Falha na atualização da sessão:", err);
      return false;
    } finally {
      setIsRefreshing(true);
    }
  };

  return {
    isAuthenticated: !!user,
    isLoading: isLoading || isRefreshing,
    userId: user?.id || null,
    sessionExpired: !session && !isLoading,
    refreshSession,
    user, // adiciona o objeto user completo
  };
};
