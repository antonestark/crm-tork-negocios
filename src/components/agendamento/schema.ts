
import * as z from 'zod';
import { format, isValid, parse } from 'date-fns';

// Regex para validação de formato de hora (HH:MM)
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

export const agendamentoFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(8, { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'Email inválido' }),
  date: z.date({ required_error: 'Selecione uma data' }),
  start_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  end_time: z.string().regex(TIME_REGEX, { message: 'Formato de hora inválido (HH:MM)' }),
  observations: z.string().optional(),
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
  };
};
