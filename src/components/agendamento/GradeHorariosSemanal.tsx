import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format, isSameDay, isToday, parse, startOfDay } from "date-fns";
import { BookingEvent } from "@/types/scheduling";
import { fetchSchedulingSettings, fetchWeeklyAvailability } from "@/services/scheduling-service";

// Função utilitária para gerar horários dinâmicos
function generateHorarios(
  day: Date,
  slotDuration: number,
  availabilityRules: { start_time: string; end_time: string; is_available: boolean; day_of_week: number }[]
) {
  const dow = day.getDay();
  const rules = availabilityRules.filter(r => r.is_available && r.day_of_week === dow);
  if (rules.length === 0) return [];

  const slots: { start: string; end: string }[] = [];
  for (const rule of rules) {
    let [h, m] = rule.start_time.split(":").map(Number);
    let [eh, em] = rule.end_time.split(":").map(Number);
    let start = new Date(day);
    start.setHours(h, m, 0, 0);
    let end = new Date(day);
    end.setHours(eh, em, 0, 0);

    while (start < end) {
      const slotStart = format(start, "HH:mm");
      const slotEndDate = new Date(start.getTime() + slotDuration * 60000);
      if (slotEndDate > end) break;
      const slotEnd = format(slotEndDate, "HH:mm");
      slots.push({ start: slotStart, end: slotEnd });
      start = slotEndDate;
    }
  }
  return slots;
}

interface GradeHorariosSemanalProps {
  weekDates: Date[];
  selectedDate: Date;
  bookingsByDay: BookingEvent[][];
  onHorarioClick: (horario: { start: string; end: string }, date: Date) => void;
  onDateSelect: (date: Date) => void;
}

export const GradeHorariosSemanal: React.FC<GradeHorariosSemanalProps> = ({
  weekDates,
  selectedDate,
  bookingsByDay,
  onHorarioClick,
  onDateSelect,
}) => {
  const [slotDuration, setSlotDuration] = useState(60);
  const [availability, setAvailability] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const settings = await fetchSchedulingSettings();
      setSlotDuration(settings.slot_duration_minutes || 60);
      const avail = await fetchWeeklyAvailability();
      setAvailability(avail);
    })();
  }, []);

  const today = new Date();

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, idx) => {
          // Não renderizar dias anteriores a hoje
          if (date < startOfDay(today)) return <div key={date.toISOString()} className="flex flex-col items-center" />;
          // Gerar horários dinâmicos para o dia
          const horarios = generateHorarios(date, slotDuration, availability);
          return (
            <div key={date.toISOString()} className="flex flex-col items-center">
              {/* Cabeçalho do dia */}
              <div className="mb-2 flex flex-col items-center">
                <span className="text-xs text-muted-foreground">
                  {["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."][date.getDay()]}
                </span>
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 border-primary transition-colors
                    ${isSameDay(date, selectedDate)
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-primary"}
                  `}
                  onClick={() => onDateSelect(date)}
                >
                  {format(date, "d")}
                </button>
              </div>
              {/* Horários */}
              <div className="flex flex-col gap-2 w-full">
                {(() => {
                  const horariosFuturos = horarios
                    .filter(horario => {
                      // Para o dia de hoje, só mostrar horários futuros
                      if (isToday(date)) {
                        const slotDate = parse(horario.start, "HH:mm", date);
                        return slotDate > new Date();
                      }
                      return true;
                    });

                  if (horariosFuturos.length === 0) {
                    return (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhum horário disponível para este dia
                      </div>
                    );
                  }

                  return horariosFuturos.map((horario) => {
                    const bookings = bookingsByDay[idx] || [];
                    const ocupado = bookings
                      .filter((b) => b.status === "confirmed")
                      .some((b) => b.start_time.slice(0, 5) === horario.start);

                    return (
                      <Button
                        key={horario.start}
                        className={`w-full rounded-full border-2 border-primary font-semibold transition-colors
                          ${ocupado
                            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            : "bg-background text-primary hover:bg-primary/10"
                          }
                        `}
                        style={{ minWidth: 90 }}
                        onClick={() => onHorarioClick(horario, date)}
                        variant="ghost"
                        disabled={ocupado}
                      >
                        {horario.start}
                      </Button>
                    );
                  });
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeHorariosSemanal;
