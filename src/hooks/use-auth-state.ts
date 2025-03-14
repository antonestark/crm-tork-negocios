
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  sessionExpired: boolean;
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    sessionExpired: false,
  });

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            userId: null,
            sessionExpired: true,
          });
          return;
        }

        setAuthState({
          isAuthenticated: !!data.session,
          isLoading: false,
          userId: data.session?.user?.id || null,
          sessionExpired: false,
        });
      } catch (err) {
        console.error("Session check failed:", err);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          sessionExpired: false,
        });
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: session?.user?.id || null,
          sessionExpired: false,
        });
      } else if (event === 'SIGNED_OUT') {
        // Removed USER_DELETED as it's not in the valid event types
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          sessionExpired: false,
        });
      } else if (event === 'TOKEN_REFRESHED') {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: session?.user?.id || null,
          sessionExpired: false,
        });
      } else if (event === 'USER_UPDATED') {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: session?.user?.id || null,
          sessionExpired: false,
        });
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        return false;
      }
      
      if (data.session) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.session.user?.id || null,
          sessionExpired: false,
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Session refresh failed:", err);
      return false;
    }
  };

  return {
    ...authState,
    refreshSession,
  };
};
