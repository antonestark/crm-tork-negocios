
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AreaFormValues } from "../hooks/useAreaForm";

interface NameFieldProps {
  form: UseFormReturn<AreaFormValues>;
  disabled?: boolean;
}

export const NameField = ({ form, disabled }: NameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input placeholder="Nome da área" {...field} disabled={disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
