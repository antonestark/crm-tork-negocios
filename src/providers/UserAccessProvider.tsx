import React, { createContext, useContext } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserRole } from '@/hooks/use-user-role';
import { useUserPermissions } from '@/hooks/use-user-permissions';

interface UserAccessContextType {
  role: string | null;
  permissions: any[];
  loading: boolean;
}

const UserAccessContext = createContext<UserAccessContextType>({
  role: null,
  permissions: [],
  loading: true,
});

export function UserAccessProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);
  const { permissions, loading: permsLoading } = useUserPermissions(user?.id ?? '', role);

  const loading = authLoading || roleLoading || permsLoading;

  return (
    <UserAccessContext.Provider value={{ role, permissions, loading }}>
      {children}
    </UserAccessContext.Provider>
  );
}

export function useUserAccess() {
  return useContext(UserAccessContext);
}
