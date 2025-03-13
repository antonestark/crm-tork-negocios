
import * as z from 'zod';
import { format, isValid, parse } from 'date-fns';

// Regex para validação de formato de hora (HH:MM)
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

// User schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2, { message: 'Nome de usuário inválido' })
});

export const agendamentoFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(8, { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'Email inválido' }),
  date: z.date({ required_error: 'Selecione uma data' }),
  start_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  end_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  observations: z.string().optional(),
  // New fields
  user: userSchema,
  description: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  location: z.string().optional()
})
.refine(data => {
  // Validate start_time is before end_time
  if (!TIME_REGEX.test(data.start_time) || !TIME_REGEX.test(data.end_time)) {
    return true; // Skip this validation if format is invalid (will be caught by regex validation)
  }
  
  const dateStr = format(data.date, 'yyyy-MM-dd');
  const startDateTime = parse(`${dateStr} ${data.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
  const endDateTime = parse(`${dateStr} ${data.end_time}`, 'yyyy-MM-dd HH:mm', new Date());
  
  return isValid(startDateTime) && isValid(endDateTime) && startDateTime < endDateTime;
}, {
  message: "O horário de início deve ser anterior ao horário de término",
  path: ["end_time"]
});

export type AgendamentoFormValues = z.infer<typeof agendamentoFormSchema>;

export const createBookingData = (values: AgendamentoFormValues) => {
  const dateStr = format(values.date, 'yyyy-MM-dd');
  const startDateTime = parse(`${dateStr} ${values.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
  const endDateTime = parse(`${dateStr} ${values.end_time}`, 'yyyy-MM-dd HH:mm', new Date());
  
  return {
    title: `Reunião: ${values.name}`,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    status: 'confirmed',
    client: { company_name: values.name },
    user_id: values.user.id,
    user_name: values.user.name,
    description: values.description,
    location: values.location || null
  };
};

// New function to register an appointment
export const registerAppointment = async (appointmentData: ReturnType<typeof createBookingData>, supabase: any) => {
  try {
    // Validate user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name")
      .eq("id", appointmentData.user_id)
      .single();
    
    if (userError || !userData) {
      throw new Error('Usuário não encontrado. Verifique o ID do usuário.');
    }
    
    // Create the appointment
    const { data, error } = await supabase
      .from("scheduling")
      .insert([{
        title: appointmentData.title,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: appointmentData.status,
        client_id: null,
        user_id: appointmentData.user_id,
        description: appointmentData.description,
        location: appointmentData.location
      }])
      .select();
    
    if (error) {
      if (error.message.includes('check_end_after_start')) {
        throw new Error("O horário de término deve ser posterior ao horário de início");
      } else if (error.message.includes('conflito com outro agendamento')) {
        throw new Error("Este horário já está reservado. Por favor, escolha outro horário");
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
