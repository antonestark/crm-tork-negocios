
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { User, FormValues } from './types';

interface UserAssignmentFieldsProps {
  form: UseFormReturn<FormValues>;
  users: User[];
}

export const UserAssignmentFields: React.FC<UserAssignmentFieldsProps> = ({ form, users }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="assigned_to"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsável</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Não atribuído</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="requested_by"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solicitante</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um solicitante" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Não especificado</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
