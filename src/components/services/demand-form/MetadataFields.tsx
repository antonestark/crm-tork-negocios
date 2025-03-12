
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface MetadataFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const MetadataFields: React.FC<MetadataFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Prazo</FormLabel>
            <FormControl>
              <DatePicker 
                date={field.value} 
                setDate={(date) => {
                  console.log("Setting due date:", date);
                  field.onChange(date);
                }}
              />
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
            <Select 
              onValueChange={field.onChange} 
              value={field.value || 'pending'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="delayed">Atrasado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
