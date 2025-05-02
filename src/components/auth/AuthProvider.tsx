import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Import Database type
import type { User as AppUser } from '@/types/admin'; // Importa seu tipo User completo
import { getUserPermissionIds } from '@/services/permissions-service';

// Define the specific type for the user data we fetch, including tenant_id
type FetchedUser = Database['public']['Tables']['users']['Row'] & {
  department: { name: string } | null; // Add the nested department structure explicitly
};

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  tenantId: string | null; // Added tenantId
  permissions: string[];
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null); // Added tenantId state
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false); // Track if initial auth check is done

  async function fetchFullUser(supabaseUser: SupabaseUser | null): Promise<void> {
    console.log('[AuthProvider] Iniciando fetchFullUser para:', supabaseUser?.id);
    if (!supabaseUser) {
      console.log('[AuthProvider] Nenhum usuário Supabase, definindo user=null e tenantId=null');
      setUser(null);
      setTenantId(null); // Clear tenantId
      setPermissions([]);
      return;
    }

    try {
      let fetchedUserData: FetchedUser | null = null;
      let isNewUser = false; // Flag to track if user was just created

      // 1. Fetch user from 'users' table
      const { data: existingUserData, error: userError } = await supabase
        .from('users')
        .select(`
          id, name, email, role, tenant_id, department_id, status, active, profile_image_url, phone, last_login,
          department:departments ( name )
        `)
        .eq('id', supabaseUser.id)
        .maybeSingle<FetchedUser>();

      if (userError) {
        console.error('Erro ao buscar usuário completo:', userError);
        setUser(null);
        setTenantId(null);
        setPermissions([]);
        return;
      }

      fetchedUserData = existingUserData;

      // 2. If user not found, create them
      if (!fetchedUserData) {
        isNewUser = true; // Set the flag
        console.warn('Usuário não encontrado na tabela users, criando novo usuário...');
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
            role: 'user',
            tenant_id: null, // New users start without a tenant
            department_id: null,
            status: 'active',
            active: true,
          })
          .select(`
            id, name, email, role, tenant_id, department_id, status, active, profile_image_url, phone, last_login,
            department:departments ( name )
          `)
          .single<FetchedUser>();

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError);
          setUser(null);
          setTenantId(null);
          setPermissions([]);
          return;
        }
        if (!insertedData) {
           console.error('Falha ao buscar usuário recém-criado.');
           setUser(null);
           setTenantId(null);
           setPermissions([]);
           return;
        }
        fetchedUserData = insertedData;
        console.log('[AuthProvider] Novo usuário criado e selecionado:', fetchedUserData.id);
      }

      // Ensure we have user data at this point
      if (!fetchedUserData) {
        console.error("User data is unexpectedly null after fetch/create.");
        setUser(null);
        setTenantId(null);
        setPermissions([]);
        return;
      }

      // 3. Adapt user data
      const fullName = fetchedUserData.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const departmentData = fetchedUserData.department;

      const adaptedUser: AppUser = {
        id: fetchedUserData.id,
        email: fetchedUserData.email || '',
        role: fetchedUserData.role || undefined,
        // Access tenant_id directly after the null check for fetchedUserData
        tenant_id: fetchedUserData.tenant_id,
        department_id: fetchedUserData.department_id,
        active: fetchedUserData.active ?? undefined,
        status: fetchedUserData.status || undefined,
        first_name: firstName,
        last_name: lastName,
        name: fullName,
        department: departmentData && fetchedUserData.department_id ? {
          id: fetchedUserData.department_id,
          name: departmentData.name,
          description: '', // Default or fetch if needed
          parent_id: null, // Default or fetch if needed
        } : null,
        profile_image_url: fetchedUserData.profile_image_url,
        phone: fetchedUserData.phone,
        last_login: fetchedUserData.last_login,
        settings: {},
        metadata: {},
      };

      setUser(adaptedUser);
      setTenantId(adaptedUser.tenant_id || null);
      console.log('[AuthProvider] Usuário completo adaptado e definido no estado:', adaptedUser.id, 'Tenant ID:', adaptedUser.tenant_id);

      // 4. Fetch permissions
      try {
        console.log('[AuthProvider] Buscando permissões para usuário:', adaptedUser.id);
        const perms = await getUserPermissionIds(adaptedUser.id);
        setPermissions(perms);
        console.log('[AuthProvider] Permissões carregadas:', perms);
      } catch (permError) {
        console.error('[AuthProvider] Erro ao buscar permissões do usuário:', permError);
        setPermissions([]);
      }

    } catch (error) {
      console.error('[AuthProvider] Erro inesperado no fetchFullUser:', error);
      setUser(null);
      setTenantId(null);
      setPermissions([]);
    }
  }

  useEffect(() => {
    let isMounted = true;
    let authListenerSubscription: any = null;

    const setupAuth = async () => {
      console.log('[AuthProvider] Iniciando setupAuth');
      if (!isMounted) return;
      setIsLoading(true);

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout na autenticação inicial')), 30000)
        );

        console.log('[AuthProvider] Verificando sessão inicial...');
        const { data: { session: initialSession }, error: sessionError } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise as Promise<{ data: { session: Session | null }, error: Error | null }>
        ]);

        if (!isMounted) return;

        if (sessionError) {
          console.error('[AuthProvider] Erro/Timeout ao verificar sessão inicial:', sessionError);
          setSession(null);
          setUser(null);
          setTenantId(null);
          setPermissions([]);
        } else {
          console.log('[AuthProvider] Sessão inicial:', initialSession ? initialSession.user.id : 'Nenhuma');
          setSession(initialSession);
          if (initialSession?.user) {
            await fetchFullUser(initialSession.user);
          } else {
            setUser(null);
            setTenantId(null);
            setPermissions([]);
          }
        }

        if (!isMounted) return;

        console.log('[AuthProvider] Configurando listener onAuthStateChange...');
        const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted) return;
          console.log('[AuthProvider] onAuthStateChange Event:', event, newSession ? newSession.user.id : 'Nenhuma sessão');

          if (JSON.stringify(session) !== JSON.stringify(newSession)) {
             setSession(newSession);
             if (newSession?.user) {
               await fetchFullUser(newSession.user);
             } else {
               setUser(null);
               setTenantId(null);
               setPermissions([]);
             }
          }
          if (!authInitialized) {
             setIsLoading(false);
             setAuthInitialized(true);
             console.log('[AuthProvider] Auth inicializado (via listener).');
          }
        });
        authListenerSubscription = data.subscription;

      } catch (error) {
        console.error('[AuthProvider] Erro crítico inesperado no setupAuth:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setTenantId(null); // Ensure tenantId is cleared on critical error
          setPermissions([]);
        }
      } finally {
        if (isMounted && !authInitialized) {
          setIsLoading(false);
          setAuthInitialized(true);
          console.log('[AuthProvider] Auth inicializado (via finally).');
        }
      }
    };

    setupAuth();

    return () => {
      isMounted = false;
      if (authListenerSubscription) {
        console.log('[AuthProvider] Desinscrevendo listener de auth.');
        authListenerSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    tenantId, // Include tenantId in context value
    permissions,
    isLoading: isLoading || !authInitialized,
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
