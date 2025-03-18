
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormValues } from "./types";

interface BasicFieldsProps {
  form: UseFormReturn<ServiceFormValues>;
}

export const TitleField = ({ form }: BasicFieldsProps) => (
  <FormField
    control={form.control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Título</FormLabel>
        <FormControl>
          <Input placeholder="Título do serviço" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const DescriptionField = ({ form }: BasicFieldsProps) => (
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

export const StatusField = ({ form }: BasicFieldsProps) => (
  <FormField
    control={form.control}
    name="status"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Status</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value || "pending"}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
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
);

interface AreaFieldProps extends BasicFieldsProps {
  areas: any[];
}

export const AreaField = ({ form, areas }: AreaFieldProps) => (
  <FormField
    control={form.control}
    name="area_id"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Área</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {areas && areas.length > 0 ? (
              areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled>
                Carregando áreas...
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface UserFieldProps extends BasicFieldsProps {
  users: any[];
}

export const AssignedUserField = ({ form, users }: UserFieldProps) => (
  <FormField
    control={form.control}
    name="assigned_to"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Responsável</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um responsável" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {users && users.length > 0 ? (
              users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled>
                Carregando usuários...
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const DueDateField = ({ form }: BasicFieldsProps) => (
  <FormField
    control={form.control}
    name="due_date"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Prazo</FormLabel>
        <DatePicker
          date={field.value}
          setDate={(date) => {
            console.log("Setting due date:", date);
            field.onChange(date);
          }}
        />
        <FormMessage />
      </FormItem>
    )}
  />
);
