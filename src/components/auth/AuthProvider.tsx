
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { User as AppUser } from '@/types/admin'; // Importa seu tipo User completo
import { getUserPermissionIds } from '@/services/permissions-service';

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  permissions: string[];
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  async function fetchFullUser(supabaseUser: SupabaseUser | null) {
    console.log('[AuthProvider] Iniciando fetchFullUser para:', supabaseUser?.id);
    if (!supabaseUser) {
      console.log('[AuthProvider] Nenhum usuário Supabase, definindo user=null');
      setUser(null);
      setPermissions([]);
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
      console.log('[AuthProvider] Usuário completo adaptado e definido no estado:', adaptedUser.id);

      // Buscar permissões do usuário
      try {
        console.log('[AuthProvider] Buscando permissões para usuário:', supabaseUser.id);
        const perms = await getUserPermissionIds(supabaseUser.id);
        setPermissions(perms);
        console.log('[AuthProvider] Permissões carregadas:', perms);
      } catch (permError) {
        console.error('[AuthProvider] Erro ao buscar permissões do usuário:', permError);
        setPermissions([]);
      }
    } catch (error) {
      console.error('[AuthProvider] Erro inesperado ao buscar/criar usuário completo:', error);
      setUser(null);
      setPermissions([]);
    }
  }

  useEffect(() => {
    const setupAuth = async () => {
      console.log('[AuthProvider] Iniciando setupAuth');
      setIsLoading(true);

      try {
        // Timeout para evitar travamento infinito (ex: 15 segundos)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout na autenticação')), 15000)
        );

        await Promise.race([
          (async () => {
            console.log('[AuthProvider] Configurando listener de auth...');
            const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
              console.log('[AuthProvider] Auth state changed:', event);
              setSession(newSession);

              if (newSession?.user) {
                try {
                  await fetchFullUser(newSession.user);
                } catch (error) {
                  console.error('[AuthProvider] Erro ao buscar usuário no listener:', error);
                  setUser(null);
                  setPermissions([]);
                }
              } else {
                setUser(null);
                setPermissions([]);
              }

              setIsLoading(false);
              setAuthInitialized(true);
            });

            console.log('[AuthProvider] Verificando sessão existente...');
            const { data: { session: existingSession }, error } = await supabase.auth.getSession();

            if (error) {
              console.error('[AuthProvider] Erro ao verificar sessão:', error);
              setSession(null);
              setUser(null);
              setPermissions([]);
            } else if (existingSession) {
              console.log('[AuthProvider] Sessão existente encontrada');
              setSession(existingSession);
              try {
                await fetchFullUser(existingSession.user);
              } catch (error) {
                console.error('[AuthProvider] Erro ao buscar usuário da sessão:', error);
                setUser(null);
                setPermissions([]);
              }
            } else {
              console.log('[AuthProvider] Nenhuma sessão encontrada');
              setSession(null);
              setUser(null);
              setPermissions([]);
            }

            return () => {
              authListener.subscription.unsubscribe();
            };
          })(),
          timeoutPromise
        ]);
      } catch (error) {
        console.error('[AuthProvider] Erro crítico ou timeout:', error);
        setSession(null);
        setUser(null);
        setPermissions([]);
      } finally {
        console.log('[AuthProvider] Finalizando setupAuth, setIsLoading(false)');
        setIsLoading(false);
        setAuthInitialized(true);
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
    permissions,
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
