
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookingEvent } from '@/hooks/use-scheduling-data';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  phone: z.string().min(8, { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'Email inválido' }),
  date: z.date({ required_error: 'Selecione uma data' }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:MM)' }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:MM)' }),
  observations: z.string().optional(),
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

  const handleSubmit = async (values: FormValues) => {
    try {
      // Parse date and times to create ISO strings
      const dateStr = format(values.date, 'yyyy-MM-dd');
      const startDateTime = new Date(`${dateStr}T${values.start_time}:00`);
      const endDateTime = new Date(`${dateStr}T${values.end_time}:00`);
      
      await onSubmit({
        title: `Reunião: ${values.name}`,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: 'confirmed',
        client: { company_name: values.name },
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <FormControl>
                    <DatePicker 
                      date={field.value} 
                      setDate={field.onChange}
                    />
                  </FormControl>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
