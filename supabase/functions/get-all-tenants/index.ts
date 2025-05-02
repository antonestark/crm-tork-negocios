import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Standard CORS headers for Supabase Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend origin for better security
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE', // Add methods as needed
};

// Function to check if a user is an admin using the service role client
// It reads from public.users table
async function isAdmin(serviceRoleClient: any, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { data, error } = await serviceRoleClient
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    return data?.role === 'admin';
  } catch (e) {
    console.error('Exception during admin check:', e);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged-in user.
    // This client will be used to verify the user's identity and role safely.
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user ID from the request context.
    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error('User not found or error fetching user:', userError);
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Create a separate client with the Service Role key to bypass RLS
    // ONLY for checking the admin role and fetching all tenants IF the user IS an admin.
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
       throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    const serviceRoleClient = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       serviceRoleKey
    );

    // Verify if the user is an admin using the service role client
    const userIsAdmin = await isAdmin(serviceRoleClient, user.id);

    if (!userIsAdmin) {
      console.warn(`User ${user.id} attempted to fetch all tenants but is not admin.`);
      // Non-admins should not be able to list all tenants via this function.
      // They should use the standard client-side query which respects RLS.
      // Return 403 Forbidden or an empty array depending on desired behavior.
      return new Response(JSON.stringify({ error: 'Forbidden: Admin role required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // If user is admin, fetch all tenants using the service role client
    console.log(`Admin user ${user.id} fetching all tenants.`);
    const { data: tenants, error: tenantsError } = await serviceRoleClient
      .from('tenants')
      .select('*, asaas_status') // Fetch all necessary columns
      .order('name', { ascending: true });

    if (tenantsError) {
      console.error('Error fetching tenants with service role:', tenantsError);
      throw tenantsError;
    }

    // Return the list of tenants
    return new Response(JSON.stringify(tenants || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
