
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { User as AppUser } from '@/types/admin'; // Importa seu tipo User completo

interface AuthContextType {
  session: Session | null;
  user: AppUser | null; // Agora o usuário completo da sua tabela
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchFullUser(supabaseUser: SupabaseUser | null) {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      // Select only necessary columns to potentially speed up the query
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, department_id, status, active') 
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar usuário completo:', error);
        setUser(null);
        return;
      }

      if (!data) {
        console.warn('Usuário não encontrado, criando novo usuário...');

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            role: 'user',
            department_id: null,
            status: 'active',
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError);
          setUser(null);
          return;
        }

        // Fetch the newly created user with specific columns
        const { data: newUser } = await supabase
          .from('users')
          .select('id, name, email, role, department_id, status, active')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (!newUser) {
          console.error('Falha ao buscar usuário recém-criado');
          setUser(null);
          return;
        }

        const fullName = newUser.name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const adaptedUser: AppUser = {
          ...newUser,
          first_name: firstName,
          last_name: lastName,
          name: newUser.name // Preserve the name field
        };

        setUser(adaptedUser);
        return;
      }

      // Adaptar o usuário do banco para o formato AppUser
      const fullName = data.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const adaptedUser: AppUser = {
        ...data,
        first_name: firstName,
        last_name: lastName,
        name: data.name // Preserve the name field
      };

      setUser(adaptedUser);
      console.log('Usuário completo adaptado e definido no estado:', adaptedUser.id);
    } catch (error) {
      console.error('Erro inesperado ao buscar/criar usuário completo:', error);
      setUser(null);
    }
  }

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      try {
        console.log('Iniciando verificação inicial de autenticação...');
        
        // Set up the auth state change listener first
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log('Auth state changed:', event, 'Session:', newSession ? 'present' : 'null');
          setSession(newSession);
          
          if (newSession?.user) {
            await fetchFullUser(newSession.user);
          } else {
            setUser(null);
          }
          
          // Only set loading to false after processing the auth state change
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            setIsLoading(false);
          }
        });
        
        // Then check for an existing session
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão existente:', error);
          setSession(null);
          setUser(null);
        } else if (existingSession) {
          console.log('Sessão existente encontrada, buscando usuário completo...');
          setSession(existingSession);
          await fetchFullUser(existingSession.user);
        }
        
        // Set loading to false after initial check is complete
        setIsLoading(false);
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Erro crítico durante inicialização de autenticação:', err);
        setIsLoading(false);
        setSession(null);
        setUser(null);
      }
    };
    
    setupAuth();
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
