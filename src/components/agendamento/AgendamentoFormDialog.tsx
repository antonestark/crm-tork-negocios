
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { format, isValid, parse } from 'date-fns';
import { BookingEvent } from '@/hooks/use-scheduling-data';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Regex para validação de formato de hora (HH:MM)
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

interface AgendamentoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<BookingEvent, 'id' | 'date'>) => Promise<any>;
  selectedDate?: Date;
}

export const AgendamentoFormDialog: React.FC<AgendamentoFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  selectedDate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      date: selectedDate || new Date(),
      start_time: '09:00',
      end_time: '10:00',
      observations: '',
    }
  });

  // Update the date field whenever selectedDate changes
  React.useEffect(() => {
    if (selectedDate && open) {
      form.setValue('date', selectedDate);
    }
  }, [selectedDate, open, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate the date and time formats
      const dateStr = format(values.date, 'yyyy-MM-dd');
      const startDateTime = parse(`${dateStr} ${values.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDateTime = parse(`${dateStr} ${values.end_time}`, 'yyyy-MM-dd HH:mm', new Date());
      
      if (!isValid(startDateTime) || !isValid(endDateTime)) {
        throw new Error('Data ou hora inválida');
      }
      
      // Create booking data object to submit
      const bookingData = {
        title: `Reunião: ${values.name}`,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'confirmed',
        client: { company_name: values.name },
      };
      
      // Try to submit and handle success/failure
      const result = await onSubmit(bookingData);
      
      if (result) {
        form.reset();
        onOpenChange(false);
        toast.success("Agendamento criado com sucesso");
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      // Check for specific database constraint errors
      if (error.message?.includes('conflito com outro agendamento')) {
        toast.error("Este horário já está reservado. Por favor, escolha outro horário.");
      } else if (error.message?.includes('check_end_after_start')) {
        toast.error("O horário de término deve ser posterior ao horário de início.");
      } else {
        toast.error(error.message || "Erro ao criar agendamento. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data*</FormLabel>
                  <DatePicker 
                    date={field.value} 
                    setDate={(date) => {
                      if (date) field.onChange(date);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Início*</FormLabel>
                    <FormControl>
                      <Input placeholder="09:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Fim*</FormLabel>
                    <FormControl>
                      <Input placeholder="10:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre o agendamento"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  'Agendar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
