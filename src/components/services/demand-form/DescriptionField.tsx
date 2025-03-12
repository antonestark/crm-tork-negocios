
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface DescriptionFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descrição detalhada da demanda"
              className="min-h-[100px]"
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
