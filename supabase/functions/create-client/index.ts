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
    const { company_name, contact_name, razao_social, document, birth_date, email, phone, status, tags } = await req.json() as ClientData;

    // Create a Supabase client with the service role key
    // This client bypasses RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert the client data into the 'clients' table
    const { data, error } = await supabase
      .from('clients')
      .insert([{ 
        company_name, 
        contact_name, 
        razao_social, 
        document, 
        birth_date, 
        email, 
        phone, 
        status, 
        tags 
        // Map other fields here
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
