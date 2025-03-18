
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

interface TitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TitleField = ({ title, setTitle }: TitleFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="title">Título</Label>
    <Input
      id="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Título do serviço"
      required
    />
  </div>
);

interface DescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
}

export const DescriptionField = ({ description, setDescription }: DescriptionFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="description">Descrição</Label>
    <Textarea
      id="description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Descreva o serviço"
      rows={3}
    />
  </div>
);

interface StatusFieldProps {
  status: string;
  setStatus: (status: string) => void;
}

export const StatusField = ({ status, setStatus }: StatusFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="status">Status</Label>
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger id="status">
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pendente</SelectItem>
        <SelectItem value="in_progress">Em Andamento</SelectItem>
        <SelectItem value="completed">Concluído</SelectItem>
        <SelectItem value="cancelled">Cancelado</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

interface AreaFieldProps {
  areaId: string;
  setAreaId: (areaId: string) => void;
  areas: any[];
  areasLoading: boolean;
}

export const AreaField = ({ areaId, setAreaId, areas, areasLoading }: AreaFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="area">Área</Label>
    <Select value={areaId} onValueChange={setAreaId}>
      <SelectTrigger id="area" disabled={areasLoading}>
        <SelectValue placeholder={areasLoading ? "Carregando..." : "Selecione uma área"} />
      </SelectTrigger>
      <SelectContent>
        {areas.map((area) => (
          <SelectItem key={area.id} value={area.id}>
            {area.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

interface DateFieldProps {
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
}

export const DateField = ({ dueDate, setDueDate }: DateFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="dueDate">Data de Vencimento</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="dueDate"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dueDate}
          onSelect={setDueDate}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  </div>
);
