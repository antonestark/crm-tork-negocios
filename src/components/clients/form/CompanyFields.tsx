
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './schema';

interface CompanyFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

export const CompanyFields: React.FC<CompanyFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
