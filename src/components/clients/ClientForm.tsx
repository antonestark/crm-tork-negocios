import React from 'react'; // Remove useState import if no longer needed elsewhere
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputMask from 'react-input-mask'; // Import InputMask
import { Button } from "@/components/ui/button"
import { Client } from '@/types/clients'; // Import Client type

// 1. Define your schema for input validation
const clientFormSchema = z.object({
  company_name: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  document: z.string().optional(),
  birth_date: z.string().optional(), // Pode ser ajustado para Date se usar um Datepicker
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(), // Keep only the array definition
});

export type ClientFormValues = z.infer<typeof clientFormSchema>; // Export the type

interface ClientFormProps {
  onSubmit: (values: ClientFormValues) => void;
  initialValues?: Partial<Client>; // Use Partial<Client> for initial values
}

// Removed CPF_MASK and CNPJ_MASK constants

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialValues }) => {
  // Removed state for dynamic document mask

  // 2. Define your form.
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      company_name: initialValues?.company_name || "",
      razao_social: initialValues?.razao_social || "",
      document: initialValues?.document || "",
      birth_date: initialValues?.birth_date || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      tags: initialValues?.tags || [], // Default to empty array
      status: initialValues?.status || "",
    },
    mode: "onChange",
  });

  // 3. Helper function to handle form submission.
  const handleSubmit = (values: ClientFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Nome fantasia da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="razao_social"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social</FormLabel>
              <FormControl>
                <Input placeholder="Razão Social da empresa" {...field} />
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
              <FormLabel>CNPJ / CPF / CAEPF</FormLabel>
              <FormControl>
                {/* Reverted to simple Input */}
                <Input placeholder="CNPJ, CPF ou CAEPF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                {/* Use InputMask for date */}
                <InputMask
                  mask="99/99/9999"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  {(inputProps: any) => <Input {...inputProps} placeholder="DD/MM/AAAA" />}
                </InputMask>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                 {/* Use InputMask for phone */}
                 <InputMask
                  mask="(99) 99999-9999"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  {(inputProps: any) => <Input {...inputProps} placeholder="(99) 99999-9999" />}
                </InputMask>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                {/* Input still takes a string, convert array to string for display/edit */}
                <Input 
                  placeholder="Tags (separadas por vírgula)" 
                  {...field} 
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))} 
                />
              </FormControl>
              <FormDescription>
                Separe as tags por vírgula.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                 <Input placeholder="Status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
};
