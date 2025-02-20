
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Grid2X2, List } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AgendamentoHeader = () => {
  const [date, setDate] = useState<Date>();
  const [view, setView] = useState<"day" | "week" | "month">("week");

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os agendamentos da sala de reunião
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex items-center" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
              size="sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex gap-1">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
