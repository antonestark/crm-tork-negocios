
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AreaFormValues } from "../hooks/useAreaForm";

interface DescriptionFieldProps {
  form: UseFormReturn<AreaFormValues>;
  disabled?: boolean;
}

export const DescriptionField = ({ form, disabled }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descrição (opcional)" 
              {...field} 
              value={field.value || ''} 
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
