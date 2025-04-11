
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { agendamentoFormSchema, AgendamentoFormValues } from './schema';

interface AgendamentoFormFieldsProps {
  onSubmit: (values: AgendamentoFormValues) => Promise<void>;
  selectedDate?: Date;
  isSubmitting: boolean;
  startTime?: string;
  endTime?: string;
}

export const AgendamentoFormFields: React.FC<AgendamentoFormFieldsProps> = ({
  onSubmit,
  selectedDate,
  isSubmitting,
  startTime,
  endTime
}) => {
  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      date: selectedDate || new Date(),
      start_time: startTime || '09:00',
      end_time: endTime || '10:00',
      observations: '',
    }
  });

  // Atualiza o campo de data sempre que selectedDate mudar
  React.useEffect(() => {
    if (selectedDate) {
      form.setValue('date', selectedDate);
    }
  }, [selectedDate, form]);

  // Atualiza os campos de horário sempre que startTime ou endTime mudarem
  React.useEffect(() => {
    if (startTime) {
      form.setValue('start_time', startTime);
    }
    if (endTime) {
      form.setValue('end_time', endTime);
    }
  }, [startTime, endTime, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};
