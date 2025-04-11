import React from "react";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingEvent } from "@/types/scheduling"; // Importar tipo

// Horários padrão (pode ser passado como prop se necessário)
const HORARIOS = Array.from({ length: 10 }, (_, i) => {
  const hour = 8 + i;
  return {
    start: `${hour.toString().padStart(2, "0")}:00`,
    end: `${(hour + 1).toString().padStart(2, "0")}:00`,
  };
});

// Nomes dos dias da semana (pode ser passado como prop se necessário)
const weekDays = [
  { short: "SEG.", long: "Segunda" },
  { short: "TER.", long: "Terça" },
  { short: "QUA.", long: "Quarta" },
  { short: "QUI.", long: "Quinta" },
  { short: "SEX.", long: "Sexta" },
  { short: "SÁB.", long: "Sábado" },
  { short: "DOM.", long: "Domingo" },
];

interface GradeHorariosSemanalProps {
  weekDates: Date[];
  selectedDate: Date;
  bookingsByDay: BookingEvent[][]; // Array de arrays de agendamentos, um para cada dia da semana
  onHorarioClick: (horario: { start: string; end: string }, date: Date) => void;
  onDateSelect: (date: Date) => void; // Função para selecionar o dia no cabeçalho
}

export const GradeHorariosSemanal: React.FC<GradeHorariosSemanalProps> = ({
  weekDates,
  selectedDate,
  bookingsByDay,
  onHorarioClick,
  onDateSelect,
}) => {
  return (
    <div className="flex-1 overflow-x-auto">
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, idx) => (
          <div key={date.toISOString()} className="flex flex-col items-center">
            {/* Cabeçalho do dia */}
            <div className="mb-2 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">
                {weekDays[idx]?.short || format(date, "EEE", { locale: ptBR })}
              </span>
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 border-primary transition-colors
                  ${isSameDay(date, selectedDate)
                    ? "bg-primary text-primary-foreground" // Dia selecionado
                    : "bg-card text-primary"} // Dia não selecionado
                `}
                onClick={() => onDateSelect(date)} // Usar a prop para selecionar a data
              >
                {format(date, "d")}
              </button>
            </div>
            {/* Horários */}
            <div className="flex flex-col gap-2 w-full">
              {HORARIOS.map((horario) => {
                // Busca agendamentos do dia específico
                const bookings = bookingsByDay[idx] || [];
                const ocupado = bookings
                  .filter((b) => b.status === "confirmed")
                  .some((b) => b.start_time.slice(0, 5) === horario.start);
                return (
                  <Button
                    key={horario.start}
                    className={`w-full rounded-full border-2 border-primary font-semibold transition-colors
                      ${ocupado
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-background text-primary hover:bg-primary/10"
                      }
                    `}
                    style={{ minWidth: 90 }}
                    onClick={() => onHorarioClick(horario, date)} // Usar a prop para clique no horário
                    variant="ghost"
                    disabled={ocupado}
                  >
                    {horario.start}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeHorariosSemanal;
