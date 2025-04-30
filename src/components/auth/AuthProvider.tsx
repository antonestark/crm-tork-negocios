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
  const [authInitialized, setAuthInitialized] = useState(false); // Track if initial auth check is done

  async function fetchFullUser(supabaseUser: SupabaseUser | null): Promise<void> {
    console.log('[AuthProvider] Iniciando fetchFullUser para:', supabaseUser?.id);
    if (!supabaseUser) {
      console.log('[AuthProvider] Nenhum usuário Supabase, definindo user=null');
      setUser(null);
      setPermissions([]);
      return;
    }

    try {
      // 1. Fetch user from 'users' table, including department name
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id, 
          name, 
          email, 
          role, 
          department_id, 
          status, 
          active,
          department:departments ( name ) 
        `) // Fetch department name via relationship
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (userError) {
        console.error('Erro ao buscar usuário completo:', userError);
        setUser(null);
        setPermissions([]); // Clear permissions on error
        return;
      }

      let currentUserData = userData;

      // 2. If user not found, create them
      if (!currentUserData) {
        console.warn('Usuário não encontrado na tabela users, criando novo usuário...');
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email, // Use metadata or email as name
            role: 'user', // Default role
            department_id: null,
            status: 'active', // Default status
            active: true,
            // created_at and updated_at are usually handled by DB defaults
          })
          .select(`
            id, 
            name, 
            email, 
            role, 
            department_id, 
            status, 
            active,
            department:departments ( name )
          `) // Select after insert, including department
          .single(); // Expecting a single row back

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError);
          setUser(null);
          setPermissions([]);
          return;
        }
        if (!insertedData) {
          console.error('Falha ao buscar usuário recém-criado (dados nulos após insert/select)');
          setUser(null);
          setPermissions([]);
          return;
        }
        currentUserData = insertedData;
        console.log('[AuthProvider] Novo usuário criado e selecionado:', currentUserData.id);
      }

      // 3. Adapt user data and fetch permissions
      const fullName = currentUserData.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Ensure department is handled correctly (it might be an object or null)
      const departmentData = currentUserData.department as { name: string } | null;

      const adaptedUser: AppUser = {
        // Spread known fields from currentUserData that match AppUser
        id: currentUserData.id,
        email: currentUserData.email || '', // Ensure email is not null
        role: currentUserData.role || undefined,
        department_id: currentUserData.department_id,
        active: currentUserData.active ?? undefined, // Handle nullish coalescing for boolean
        status: currentUserData.status || undefined,
        // Adapt names
        first_name: firstName,
        last_name: lastName,
        name: currentUserData.name || '', // Ensure name is not null
        // Add department object if available
        department: departmentData ? { id: currentUserData.department_id?.toString() || '', name: departmentData.name, description: '', path: '', level: 0, parent_id: null, manager_id: null, settings: {}, metadata: {}, created_at: '', updated_at: '', _memberCount: 0 } : null,
        // Add defaults for other optional fields in AppUser if needed
        profile_image_url: null,
        phone: null,
        last_login: null,
        settings: {},
        metadata: {},
      };

      setUser(adaptedUser);
      console.log('[AuthProvider] Usuário completo adaptado e definido no estado:', adaptedUser.id);

      // 4. Fetch permissions for the user
      try {
        console.log('[AuthProvider] Buscando permissões para usuário:', adaptedUser.id);
        const perms = await getUserPermissionIds(adaptedUser.id);
        setPermissions(perms);
        console.log('[AuthProvider] Permissões carregadas:', perms);
      } catch (permError) {
        console.error('[AuthProvider] Erro ao buscar permissões do usuário:', permError);
        setPermissions([]); // Clear permissions on error
      }

    } catch (error) {
      console.error('[AuthProvider] Erro inesperado no fetchFullUser:', error);
      setUser(null);
      setPermissions([]);
    }
  }

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    let authListenerSubscription: any = null; // Variable to hold the subscription

    const setupAuth = async () => {
      console.log('[AuthProvider] Iniciando setupAuth');
      if (!isMounted) return; // Don't run if component unmounted
      setIsLoading(true);

      try {
        // Increased timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout na autenticação inicial')), 30000)
        );

        // Get initial session
        console.log('[AuthProvider] Verificando sessão inicial...');
        const { data: { session: initialSession }, error: sessionError } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise as Promise<{ data: { session: Session | null }, error: Error | null }>
        ]);

        if (!isMounted) return; // Check again after async operation

        if (sessionError) {
          console.error('[AuthProvider] Erro/Timeout ao verificar sessão inicial:', sessionError);
          setSession(null);
          setUser(null);
          setPermissions([]);
        } else {
          console.log('[AuthProvider] Sessão inicial:', initialSession ? initialSession.user.id : 'Nenhuma');
          setSession(initialSession);
          if (initialSession?.user) {
            await fetchFullUser(initialSession.user); // Fetch user details if session exists
          } else {
            setUser(null); // Ensure user is null if no session
            setPermissions([]);
          }
        }

        if (!isMounted) return; // Check before setting up listener

        // Setup auth state change listener *after* initial check
        console.log('[AuthProvider] Configurando listener onAuthStateChange...');
        const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted) return; // Check inside listener callback
          console.log('[AuthProvider] onAuthStateChange Event:', event, newSession ? newSession.user.id : 'Nenhuma sessão');

          // Basic check to prevent unnecessary updates if session object is identical
          if (JSON.stringify(session) !== JSON.stringify(newSession)) {
             setSession(newSession);
             if (newSession?.user) {
               await fetchFullUser(newSession.user);
             } else {
               setUser(null);
               setPermissions([]);
             }
          }
          // Always finish loading after the first auth event or initial check completes
          if (!authInitialized) {
             setIsLoading(false);
             setAuthInitialized(true);
             console.log('[AuthProvider] Auth inicializado (via listener).');
          }
        });
        authListenerSubscription = data.subscription;


      } catch (error) {
         // Catch errors from Promise.race or other unexpected issues
        console.error('[AuthProvider] Erro crítico inesperado no setupAuth:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setPermissions([]);
        }
      } finally {
        // Ensure loading is set to false if it hasn't been already
        if (isMounted && !authInitialized) {
          setIsLoading(false);
          setAuthInitialized(true);
          console.log('[AuthProvider] Auth inicializado (via finally).');
        }
      }
    };

    setupAuth();

    // Cleanup function
    return () => {
      isMounted = false;
      if (authListenerSubscription) {
        console.log('[AuthProvider] Desinscrevendo listener de auth.');
        authListenerSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const signOut = async () => {
    try {
      setIsLoading(true); // Optionally set loading during sign out
      await supabase.auth.signOut();
      // State updates will be triggered by onAuthStateChange listener
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
       // setIsLoading(false); // Loading state is handled by listener now
    }
  };

  // Memoize the context value if necessary, though with state updates it might re-render anyway
  const value = {
    session,
    user,
    permissions,
    isLoading: isLoading || !authInitialized, // Consider loading until initialized
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
