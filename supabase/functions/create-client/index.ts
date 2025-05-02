import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.40.0'
import { corsHeaders } from '../_shared/cors-headers.ts' // Assuming cors-headers exists

// Define the expected structure of the incoming client data
interface ClientData {
  company_name: string;
  contact_name?: string;
  razao_social?: string;
  document?: string;
  birth_date?: string | null;
  email?: string;
  phone?: string;
  status?: string;
  tags?: string[];
  // Add other fields as needed based on your clients table schema
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Destructure tenantId along with other client data
    const { tenantId, ...clientData } = await req.json() as ClientData & { tenantId: string };

    if (!tenantId) {
      throw new Error("Missing 'tenantId' in request body.");
    }
    if (!clientData || typeof clientData !== 'object' || !clientData.company_name) {
       throw new Error("Invalid or missing client data in request body.");
    }

    // Create a Supabase client with the service role key
    // This client bypasses RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert the client data into the 'clients' table, including tenant_id
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData, // Spread the rest of the client data
        tenant_id: tenantId // Add the tenant ID
      }])
      .select() // Select the inserted row
      .single(); // Expect a single result

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Bad Request or other appropriate error status
      });
    }

    // Return the inserted client data
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201, // Created
    });

  } catch (error) {
    console.error('Request processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
});
