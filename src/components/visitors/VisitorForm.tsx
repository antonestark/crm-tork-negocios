import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisitorFormValues, visitorFormSchema } from './visitorFormSchema';
import { supabase } from '@/integrations/supabase/client'; // Assuming supabase client is here
import { toast } from "sonner";

interface SimpleClient {
  id: string;
  company_name: string;
}

interface VisitorFormProps {
  onSubmit: (values: VisitorFormValues) => void;
  initialValues?: Partial<VisitorFormValues>;
}

export const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, initialValues }) => {
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      document: initialValues?.document || "",
      client_id: initialValues?.client_id || "",
      visit_time: initialValues?.visit_time || new Date().toISOString().slice(0, 16), // Default to current time
      notes: initialValues?.notes || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      const { data, error } = await supabase
        .from('clients')
        .select('id, company_name') // Select only necessary fields
        .order('company_name', { ascending: true });

      if (error) {
        console.error("Error fetching clients:", error);
        toast.error("Falha ao carregar a lista de clientes.");
      } else {
        setClients(data || []);
      }
      setIsLoadingClients(false);
    };

    fetchClients();
  }, []);

  const handleSubmit = (values: VisitorFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Visitante</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="CPF ou RG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente Visitado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingClients ? (
                    <SelectItem value="loading" disabled>Carregando clientes...</SelectItem>
                  ) : clients.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhum cliente encontrado.</SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visit_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e Hora da Visita</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas sobre a visita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Registrar Visitante</Button>
      </form>
    </Form>
  );
};
