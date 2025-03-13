
import * as z from 'zod';
import { format, isValid, parse } from 'date-fns';

// Regex para validação de formato de hora (HH:MM)
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

// User schema - now optional
export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Nome de usuário inválido' }).optional()
});

export const agendamentoFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(8, { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'Email inválido' }),
  date: z.date({ required_error: 'Selecione uma data' }),
  start_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  end_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  observations: z.string().optional(),
  // User is now optional
  user: userSchema.optional().default({}),
  description: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  location: z.string().optional(),
  customer_id: z.string().regex(/^[0-9]+$/, { message: 'ID do cliente deve ser numérico' }).optional()
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
    description: values.description,
    location: values.location || null,
    customer_id: values.customer_id || null
  };
};

// New function to register an appointment
export const registerAppointment = async (appointmentData: ReturnType<typeof createBookingData>, supabase: any) => {
  try {
    // Create the appointment
    const { data, error } = await supabase
      .from("scheduling")
      .insert([{
        title: appointmentData.title,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        status: appointmentData.status,
        client_id: null,
        description: appointmentData.description,
        location: appointmentData.location,
        customer_id: appointmentData.customer_id
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
