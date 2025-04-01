
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { agendamentoFormSchema, AgendamentoFormValues } from './schema';
import { Loader2 } from 'lucide-react';

interface AppointmentFormFieldsProps {
  initialValues: Partial<AgendamentoFormValues>;
  onSubmit: (values: AgendamentoFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const AppointmentFormFields: React.FC<AppointmentFormFieldsProps> = ({
  initialValues,
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      date: new Date(),
      start_time: '09:00',
      end_time: '10:00',
      observations: '',
      description: '',
      location: '',
      customer_id: '',
      ...initialValues
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Nome*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="Nome do cliente" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">ID do Cliente (opcional)</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="Será gerado automaticamente se vazio" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </FormControl>
                <FormDescription className="text-xs text-slate-400"> {/* Style Description */}
                  Deixe em branco para gerar automaticamente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Telefone*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="(00) 00000-0000" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                <FormLabel className="text-slate-300">Email*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="email@exemplo.com" type="email" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-300">Data*</FormLabel> {/* Style Label */}
                {/* Style DatePicker Trigger Button using className */}
                <DatePicker 
                  className="bg-slate-800/50 border-blue-900/40 text-slate-300 hover:bg-slate-800/70 hover:text-slate-100 data-[state=open]:ring-2 data-[state=open]:ring-blue-500" // Apply styles via className
                  date={field.value} 
                  setDate={(date) => {
                    if (date) field.onChange(date);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Horário Início*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="09:00" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
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
                <FormLabel className="text-slate-300">Horário Fim*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="10:00" {...field} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Descrição*</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Textarea */}
                  <Textarea 
                    placeholder="Descreva o propósito do agendamento"
                    className="min-h-[80px] bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Localização (opcional)</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Input */}
                  <Input placeholder="Local do agendamento" {...field} value={field.value || ''} className="bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Observações (opcional)</FormLabel> {/* Style Label */}
                <FormControl>
                  {/* Style Textarea */}
                  <Textarea 
                    placeholder="Observações adicionais"
                    className="min-h-[80px] bg-slate-800/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Apply green style */}
        <Button 
          type="submit" 
          className="w-full bg-green-600 text-white hover:bg-green-700" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            'Registrar Agendamento'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentFormFields;
