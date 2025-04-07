import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/clients';
import { ClientFormValues } from '@/components/clients/ClientForm';

// Function to map form values to the database structure
// Adjust this based on the actual 'clients' table columns
// Ensure required fields like company_name are included in the return type if they are guaranteed by the form schema
const mapFormToDb = (values: ClientFormValues): Pick<Client, 'company_name'> & Partial<Omit<Client, 'company_name'>> => {
  return {
    company_name: values.company_name, // company_name is required by schema
    contact_name: values.contact_name, // Include the new field
    razao_social: values.razao_social,
    document: values.document,
    birth_date: values.birth_date || null, // Handle optional date
    email: values.email,
    phone: values.phone,
    status: values.status || 'active', // Default status if not provided
    tags: values.tags,
    // Map other fields from ClientFormValues to Client type as needed
    // Example: cnpj: values.document?.length > 14 ? values.document : undefined,
  };
};

export const createClient = async (values: ClientFormValues): Promise<Client | null> => {
  const clientData = mapFormToDb(values);
  
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
  return data;
};

export const updateClient = async (id: string, values: ClientFormValues): Promise<Client | null> => {
  const clientData = mapFormToDb(values);

  // Remove id and potentially created_at/updated_at if they are in clientData
  // Supabase update doesn't usually take the primary key in the update object
  delete (clientData as any).id; 
  delete (clientData as any).created_at;
  delete (clientData as any).updated_at;


  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
  return data;
};

// Optional: Add fetchClients function if needed elsewhere
export const fetchClients = async (): Promise<Client[]> => {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('company_name', { ascending: true });

    if (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
    return data || [];
};
