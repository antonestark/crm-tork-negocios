import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types/supabase';
import { useAuth } from '@/components/auth/AuthProvider'; // Import useAuth

// Function to fetch tenants - logic depends on user role
const fetchTenants = async (isAdmin: boolean): Promise<Tenant[]> => {
  if (isAdmin) {
    // Admin: Invoke the Edge Function to get all tenants
    console.log('[useTenants] Admin user detected, invoking Edge Function...');
    const { data, error } = await supabase.functions.invoke('get-all-tenants');

    if (error) {
      console.error('Error invoking get-all-tenants function:', error);
      throw new Error(`Failed to fetch tenants via function: ${error.message}`);
    }
    console.log('[useTenants] Edge Function returned:', data);
    return (data as Tenant[]) || []; // Cast the response data
  } else {
    // Non-admin: Fetch directly, relying on RLS (should only return their own tenant if policy exists)
    console.log('[useTenants] Non-admin user detected, fetching via standard query...');
    const { data, error } = await supabase
      .from('tenants')
      .select('*, asaas_status')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tenants for non-admin:', error);
      // Don't throw, just return empty array or handle differently if needed
      // throw new Error(`Failed to fetch tenants: ${error.message}`);
      return [];
    }
    console.log('[useTenants] Standard query returned:', data);
    return data || [];
  }
};

// Custom hook to fetch tenants using React Query
export const useTenants = () => {
  const { user } = useAuth(); // Get user info to check role
  const isAdminUser = user?.role === 'admin'; // Determine if user is admin

  return useQuery<Tenant[], Error>({
    // Include isAdminUser in the queryKey so it refetches if the role changes (e.g., on login/logout)
    queryKey: ['tenants', isAdminUser],
    // Pass isAdminUser to the fetch function
    queryFn: () => fetchTenants(isAdminUser),
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
