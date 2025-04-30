import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.40.0'

// Define standard CORS headers directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 
};

// Define the expected structure of the incoming lead data
// Match the NewLead type structure as closely as possible
interface LeadData {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  notes?: string | null;
  status?: string; // Should be normalized already by service if needed
  assigned_to?: string | null; // Should be UUID or null
}

console.log("create-lead function initializing..."); // Log initialization

Deno.serve(async (req) => {
  console.log(`create-lead received request: ${req.method} ${req.url}`);
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure request body is valid JSON
    let leadData: LeadData;
    try {
      console.log("Parsing request body...");
      leadData = await req.json() as LeadData;
      console.log("Parsed leadData:", leadData);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message, jsonError.stack); // Log stack trace
      return new Response(JSON.stringify({ error: 'Invalid request body: ' + jsonError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Basic validation
    if (!leadData.name) {
       console.error("Validation failed: Missing name");
       return new Response(JSON.stringify({ error: 'Missing required field: name' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    console.log("Supabase URL found:", !!supabaseUrl);
    // Avoid logging the actual key
    console.log("Supabase Service Role Key found:", !!serviceRoleKey); 

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    console.log("Supabase client created with service role.");

    // Prepare data for insertion (match table columns)
    const dataToInsert = {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        source: leadData.source,
        notes: leadData.notes,
        status: leadData.status || 'neutro', // Default status if not provided
        assigned_to: leadData.assigned_to, // Already expected to be UUID or null
    };
    console.log("Data prepared for insertion:", dataToInsert);

    // Insert lead data
    console.log("Attempting to insert into 'leads' table...");
    const { data, error } = await supabase
      .from('leads')
      .insert([dataToInsert])
      .select() // Select the inserted row
      .single(); // Expect a single result

    if (error) {
      console.error('Supabase insert error (create-lead):', error.message, error.details, error.hint, error.code); // Log more details
      // Handle potential foreign key errors for assigned_to if it's invalid
       if (error.code === '23503') { 
         return new Response(JSON.stringify({ error: 'Invalid assigned_to UUID provided.' }), {
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
    console.log("Insertion successful, returning data:", data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201, // Created
    });

  } catch (error) {
    console.error('Request processing error (create-lead):', error.message, error.stack); // Log stack trace
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
