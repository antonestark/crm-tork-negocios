
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AreaFormValues } from "../hooks/useAreaForm";
import { AreaType } from "../types";

interface TypeFieldProps {
  form: UseFormReturn<AreaFormValues>;
  areaTypes: AreaType[];
  loadingTypes: boolean;
  disabled?: boolean;
}

export const TypeField = ({ form, areaTypes, loadingTypes, disabled }: TypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loadingTypes ? "Carregando tipos..." : "Selecione o tipo"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loadingTypes ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : areaTypes.length > 0 ? (
                areaTypes.map((type) => (
                  <SelectItem key={type.id} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-types" disabled>Nenhum tipo cadastrado</SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
