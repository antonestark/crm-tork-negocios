
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
import { AgendamentoFormDialog } from "./AgendamentoFormDialog";
import { useSchedulingData } from "@/hooks/use-scheduling-data";
import { toast } from "sonner";

type AgendamentoHeaderProps = {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
};

export const AgendamentoHeader = ({ selectedDate, onDateSelect }: AgendamentoHeaderProps) => {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [formOpen, setFormOpen] = useState(false);
  const { createBooking } = useSchedulingData(selectedDate);

  const handleNewBooking = () => {
    setFormOpen(true);
  };

  const handleSubmitBooking = async (bookingData: any) => {
    try {
      await createBooking(bookingData);
      toast.success("Agendamento criado com sucesso");
      return true;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Falha ao criar agendamento");
      return false;
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
        {/* Apply green style */}
        <Button className="flex items-center bg-green-600 text-white hover:bg-green-700" size="sm" onClick={handleNewBooking}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            {/* Apply green style, remove variant="outline" */}
            <Button
              className="justify-start text-left font-normal bg-green-600 text-white hover:bg-green-700"
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
          {/* Apply green style when not active (variant="outline") */}
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
            className={view !== "day" ? "bg-green-600 text-white hover:bg-green-700" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
            className={view !== "week" ? "bg-green-600 text-white hover:bg-green-700" : ""}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
            className={view !== "month" ? "bg-green-600 text-white hover:bg-green-700" : ""}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AgendamentoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitBooking}
        selectedDate={selectedDate}
      />
    </div>
  );
};
