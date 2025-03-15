
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  sessionExpired: boolean;
};

export const useAuthState = () => {
  const { user, isLoading, session } = useAuth();

  const refreshSession = async () => {
    try {
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
    }
  };

  return {
    isAuthenticated: !!user,
    isLoading,
    userId: user?.id || null,
    sessionExpired: !session && !isLoading,
    refreshSession,
  };
};
