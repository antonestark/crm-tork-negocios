
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AgendamentoHeaderProps = {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
};

export const AgendamentoHeader = ({ selectedDate, onDateSelect }: AgendamentoHeaderProps) => {
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const handleNewBooking = async () => {
    try {
      // Here you would open a modal/dialog for creating a new booking
      toast.info("Funcionalidade de criação de agendamento será implementada em breve.");
      
      // Example of what the creation would look like
      /*
      const { data, error } = await supabase
        .from('scheduling')
        .insert([
          { 
            title: 'Nova Reunião', 
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(),
            client_id: 'client-id-here',
            status: 'confirmed'
          }
        ]);
      */
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Falha ao criar agendamento");
    }
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os agendamentos da sala de reunião
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex items-center" size="sm" onClick={handleNewBooking}>
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
              {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
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
