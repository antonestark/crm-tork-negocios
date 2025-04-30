import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.40.0'

// Define standard CORS headers directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Only POST and OPTIONS needed
};

interface RequestBody {
  id: string; // Expecting the ID of the client to delete
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure request body is valid JSON and contains the ID
    let requestBody: RequestBody;
    try {
      requestBody = await req.json() as RequestBody;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return new Response(JSON.stringify({ error: 'Invalid request body: ' + jsonError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!requestBody.id) {
       return new Response(JSON.stringify({ error: 'Missing required field: id' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete the client data
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', requestBody.id); // Match the ID

    if (error) {
      console.error('Supabase delete error:', error);
      // Handle potential errors like client not found (though delete usually doesn't error on not found)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, 
      });
    }

    // Return success (no content)
    return new Response(null, { // Or JSON.stringify({ success: true })
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 204, // No Content (standard for successful delete)
    });

  } catch (error) {
    console.error('Request processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
