import { supabase } from '@/integrations/supabase/client';
import { VisitorFormValues } from '@/components/visitors/visitorFormSchema';
import { Database } from '@/types/supabase'; // Import the generated types

// Define the type for the visitor row and insert based on the generated Supabase types
type VisitorRow = Database['public']['Tables']['visitors']['Row'];
type VisitorInsert = Database['public']['Tables']['visitors']['Insert'];

export const createVisitor = async (visitorData: VisitorFormValues): Promise<VisitorRow | null> => {
  // Ensure the data conforms to the Insert type, especially handling optional fields
  const dataToInsert: VisitorInsert = {
    name: visitorData.name,
    client_id: visitorData.client_id,
    visit_time: visitorData.visit_time,
    document: visitorData.document || null, // Ensure null if empty/undefined
    notes: visitorData.notes || null,       // Ensure null if empty/undefined
  };

  // Invoke the Edge Function instead of direct insert
  const { data, error } = await supabase.functions.invoke('create-visitor', {
    body: dataToInsert, // Pass validated data in the body
  });

  if (error) {
    console.error('Error invoking create-visitor function:', error);
    // Attempt to parse Supabase Function error if possible
    let errorMessage = error.message;
    try {
      // Supabase Functions often return errors in data.error
      if (data?.error) {
         errorMessage = data.error;
      }
    } catch (e) { /* Ignore parsing errors */ }
    throw new Error(errorMessage); // Re-throw a more specific error if possible
  }

  // The data returned by the function should match the VisitorRow type
  // Note: Ensure the Edge Function returns the same structure as .select().single()
  return data as VisitorRow | null; // Cast might be needed depending on function return type
};

// You can add other service functions here, e.g., getVisitors, deleteVisitor, etc.
