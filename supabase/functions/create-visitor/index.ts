import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.40.0'
// import { corsHeaders } from '../_shared/cors-headers.ts' // Removed import

// Define standard CORS headers directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Only POST and OPTIONS needed for this function
};

// Define the expected structure of the incoming visitor data
interface VisitorData {
  name: string;
  document?: string | null;
  client_id: string; // Assuming client_id is always provided
  visit_time: string; // Expecting ISO string or similar
  notes?: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure request body is valid JSON
    let visitorData: VisitorData;
    try {
      visitorData = await req.json() as VisitorData;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return new Response(JSON.stringify({ error: 'Invalid request body: ' + jsonError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Destructure tenantId along with other visitor data
    // Remove the re-declaration of visitorData here
    const { tenantId, ...restOfData } = await req.json() as VisitorData & { tenantId: string };
    visitorData = restOfData; // Assign the rest of the data to the existing visitorData variable

    // Basic validation (add more as needed)
    if (!tenantId) {
       return new Response(JSON.stringify({ error: 'Missing required field: tenantId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!visitorData.name || !visitorData.client_id || !visitorData.visit_time) {
       return new Response(JSON.stringify({ error: 'Missing required fields: name, client_id, visit_time' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert visitor data, including tenant_id
    const { data, error } = await supabase
      .from('visitors')
      .insert([{
        ...visitorData, // Spread the rest of the visitor data
        tenant_id: tenantId // Add the tenant ID
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      // Check for specific errors like foreign key violation if client_id is invalid
      if (error.code === '23503') { // Foreign key violation
         return new Response(JSON.stringify({ error: 'Invalid client_id provided.' }), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
           status: 400,
         });
      }
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, 
      });
    }

    // Return inserted data
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201, // Created
    });

  } catch (error) {
    console.error('Request processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
