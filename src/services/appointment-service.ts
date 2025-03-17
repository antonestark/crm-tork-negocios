
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgendamentoFormValues, createBookingData } from "@/components/agendamento/schema";
import { format, parse } from "date-fns";

export interface AppointmentRegistrationResult {
  success: boolean;
  message: string;
  id?: string;
  error?: any;
}

// Function to generate a unique customer ID 
const generateCustomerId = async (): Promise<string> => {
  // Get the current highest customer ID
  const { data, error } = await supabase
    .from("scheduling")
    .select("customer_id")
    .order("customer_id", { ascending: false })
    .limit(1);
  
  if (error) {
    console.error("Error fetching customer IDs:", error);
    // Start from 1000 if we can't fetch existing IDs
    return "1000";
  }
  
  // If there are no existing customer IDs, start from 1000
  if (!data || data.length === 0 || !data[0].customer_id) {
    return "1000";
  }
  
  // Increment the highest customer ID by 1
  const highestId = parseInt(data[0].customer_id);
  return (highestId + 1).toString();
};

// Function to check for scheduling conflicts
const checkForConflicts = async (startTime: string, endTime: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("scheduling")
    .select("id")
    .lt("end_time", endTime)
    .gt("start_time", startTime)
    .or(`start_time.gte.${startTime},start_time.lt.${endTime}`)
    .or(`end_time.gt.${startTime},end_time.lte.${endTime}`)
    .not("status", "eq", "cancelled");
  
  if (error) {
    console.error("Error checking for conflicts:", error);
    return true; // Assume there's a conflict if we can't check
  }
  
  return data && data.length > 0;
};

export const registerAppointment = async (values: AgendamentoFormValues): Promise<AppointmentRegistrationResult> => {
  try {
    // Create booking data from form values
    const bookingData = createBookingData(values);
    
    // Check for scheduling conflicts
    const hasConflict = await checkForConflicts(bookingData.start_time, bookingData.end_time);
    if (hasConflict) {
      throw new Error("Este horário já está reservado. Por favor, escolha outro horário");
    }
    
    // Generate a customer ID if one wasn't provided
    let customerId = values.customer_id;
    if (!customerId) {
      customerId = await generateCustomerId();
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from("scheduling")
      .insert([{
        title: bookingData.title,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        status: bookingData.status,
        client_id: null,
        description: bookingData.description,
        location: bookingData.location,
        customer_id: customerId,
        email: bookingData.email,
        phone: bookingData.phone
      }])
      .select();
    
    if (error) {
      if (error.message.includes('check_end_after_start')) {
        throw new Error("O horário de término deve ser posterior ao horário de início");
      } else if (error.message.includes('conflito com outro agendamento')) {
        throw new Error("Este horário já está reservado. Por favor, escolha outro horário");
      } else if (error.message.includes('validate_customer_id')) {
        throw new Error("ID do cliente inválido. Deve ser numérico");
      } else if (error.message.includes('validate_status')) {
        throw new Error("Status inválido. Deve ser confirmed, cancelled ou pending");
      } else if (error.message.includes('Já existe um agendamento confirmado para este email')) {
        throw new Error("Já existe um agendamento confirmado para este email na mesma data");
      } else if (error.message.includes('Já existe um agendamento confirmado para este telefone')) {
        throw new Error("Já existe um agendamento confirmado para este telefone na mesma data");
      } else {
        throw error;
      }
    }
    
    return { 
      success: true, 
      id: data[0].id,
      message: 'Agendamento criado com sucesso' 
    };
  } catch (err: any) {
    console.error("Error registering appointment:", err);
    return { 
      success: false, 
      message: err.message || 'Falha ao criar agendamento',
      error: err
    };
  }
};
