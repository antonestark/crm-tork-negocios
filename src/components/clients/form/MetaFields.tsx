
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { ClientFormValues } from './schema';

interface MetaFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

export const MetaFields: React.FC<MetaFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
