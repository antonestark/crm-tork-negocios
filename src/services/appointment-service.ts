
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgendamentoFormValues, createBookingData } from "@/components/agendamento/schema";

export interface AppointmentRegistrationResult {
  success: boolean;
  message: string;
  id?: string;
  error?: any;
}

export const registerAppointment = async (values: AgendamentoFormValues): Promise<AppointmentRegistrationResult> => {
  try {
    // Create booking data from form values
    const bookingData = createBookingData(values);
    
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
        customer_id: bookingData.customer_id,
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
