
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
        .single();

      if (error || !data) {
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
          .single();

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
      };

      setUser(adaptedUser);
      console.log('Usuário completo adaptado e definido no estado:', adaptedUser.id);
    } catch (error) {
      console.error('Erro inesperado ao buscar/criar usuário completo:', error);
      setUser(null);
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const fetchInitialUser = async () => {
      try {
        setIsLoading(true);

        console.log('Iniciando verificação inicial de autenticação...');
        timeoutId = setTimeout(() => {
          console.warn('Timeout (5s) atingido na verificação inicial de autenticação.');
          if (isLoading) { // Só altera se ainda estiver carregando
             setIsLoading(false);
             setSession(null);
             setUser(null);
             console.log('Estado de loading forçado para false devido ao timeout.');
          }
        }, 5000);

        const { data, error } = await supabase.auth.getUser();
        console.log('Resultado de supabase.auth.getUser():', { data, error });

        if (timeoutId) clearTimeout(timeoutId); // Limpa o timeout se a resposta chegou a tempo

        if (error || !data.user) {
          console.error('Erro ao buscar usuário inicial ou usuário não autenticado:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('Usuário Supabase encontrado, buscando usuário completo...');
          await fetchFullUser(data.user);
        }
      } catch (error) {
        console.error('Erro inesperado durante fetchInitialUser:', error);
        setSession(null);
        setUser(null);
      } finally {
        if (timeoutId) clearTimeout(timeoutId); // Garante limpeza do timeout
        console.log('fetchInitialUser finalizado, definindo isLoading para false.');
        setIsLoading(false); // Garante que isLoading seja false ao final
      }
    };

    fetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session);
      setSession(session);
      if (session?.user) {
        console.log('Listener: Usuário Supabase presente, buscando usuário completo...');
        await fetchFullUser(session.user);
      } else {
        console.log('Listener: Sem usuário Supabase, definindo usuário como null.');
        setUser(null);
      }
       // Não definir isLoading aqui, pois fetchInitialUser controla o loading inicial
       // Se precisar de loading para mudanças de estado pós-inicialização, adicionar lógica separada
    });

    return () => {
      console.log('Desinscrevendo listener de autenticação.');
      authListener.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId); // Limpa timeout ao desmontar
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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
