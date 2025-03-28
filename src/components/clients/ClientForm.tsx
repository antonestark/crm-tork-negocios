
import React, { useState } from 'react';
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
import InputMask from 'react-input-mask';
import { Button } from "@/components/ui/button"
import { Client } from '@/types/clients';

// Define CPF and CNPJ masks
const CPF_MASK = '999.999.999-99';
const CNPJ_MASK = '99.999.999/9999-99';

// 1. Define your schema for input validation
const clientFormSchema = z.object({
  company_name: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  document: z.string().optional(),
  birth_date: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  onSubmit: (values: ClientFormValues) => void;
  initialValues?: Partial<Client>;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialValues }) => {
  // State to track document type
  const [documentMask, setDocumentMask] = useState<string>(CPF_MASK);

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
      tags: initialValues?.tags || [],
      status: initialValues?.status || "",
    },
    mode: "onChange",
  });

  // Determine document type and set appropriate mask
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters for comparison
    const value = event.target.value.replace(/\D/g, '');
    
    // Set mask based on length
    if (value.length > 11) {
      setDocumentMask(CNPJ_MASK);
    } else {
      setDocumentMask(CPF_MASK);
    }
    
    // Update form value
    form.setValue('document', event.target.value);
  };

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
                <InputMask
                  mask={documentMask}
                  value={field.value}
                  onChange={handleDocumentChange}
                  onBlur={field.onBlur}
                >
                  {(inputProps: any) => 
                    <Input 
                      {...inputProps} 
                      placeholder={documentMask === CPF_MASK ? "000.000.000-00" : "00.000.000/0000-00"} 
                    />
                  }
                </InputMask>
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
