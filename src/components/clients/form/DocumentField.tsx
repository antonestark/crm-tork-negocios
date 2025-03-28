
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from 'react-input-mask';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './schema';
import { CPF_MASK, CNPJ_MASK } from './schema';

interface DocumentFieldProps {
  form: UseFormReturn<ClientFormValues>;
  documentMask: string;
  onDocumentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DocumentField: React.FC<DocumentFieldProps> = ({ 
  form, 
  documentMask, 
  onDocumentChange 
}) => {
  return (
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
              onChange={onDocumentChange}
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
  );
};
