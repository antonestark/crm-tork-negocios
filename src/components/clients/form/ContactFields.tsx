
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { ClientFormValues } from './schema';

interface ContactFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

export const ContactFields: React.FC<ContactFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
