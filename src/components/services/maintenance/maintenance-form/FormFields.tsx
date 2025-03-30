
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { UseFormReturn } from "react-hook-form";
import { MaintenanceFormValues } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface FormFieldProps {
  form: UseFormReturn<MaintenanceFormValues>;
}

interface AreaFieldProps extends FormFieldProps {
  areas: any[];
  areasLoading: boolean;
}

export const TitleField = ({ form }: FormFieldProps) => (
  <FormField
    control={form.control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Título</FormLabel>
        <FormControl>
          <Input placeholder="Título da manutenção" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const DescriptionField = ({ form }: FormFieldProps) => (
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Descrição</FormLabel>
        <FormControl>
          <Textarea placeholder="Descrição (opcional)" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const TypeField = ({ form }: FormFieldProps) => (
  <FormField
    control={form.control}
    name="type"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Tipo</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="preventive">Preventiva</SelectItem>
            <SelectItem value="corrective">Corretiva</SelectItem>
            <SelectItem value="scheduled">Programada</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const FrequencyField = ({ form }: FormFieldProps) => (
  <FormField
    control={form.control}
    name="frequency"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Frequência</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="semiannual">Semestral</SelectItem>
            <SelectItem value="annual">Anual</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const AreaField = ({ form, areas, areasLoading }: AreaFieldProps) => (
  <FormField
    control={form.control}
    name="area_id"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Área</FormLabel>
        {areasLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {areas && areas.length > 0 ? (
                areas.map(area => (
                  <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-areas" disabled>Nenhuma área disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const ScheduledDateField = ({ form }: FormFieldProps) => (
  <FormField
    control={form.control}
    name="scheduled_date"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Data Programada</FormLabel>
        <DatePicker
          date={field.value}
          setDate={(date) => {
            console.log("Setting scheduled date:", date);
            field.onChange(date);
          }}
        />
        <FormMessage />
      </FormItem>
    )}
  />
);
