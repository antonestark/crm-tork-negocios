
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchedulingData } from "@/hooks/use-scheduling-data";

type BookingCalendarProps = {
  onDateSelect?: (date: Date | undefined) => void;
};

export const BookingCalendar = ({ onDateSelect }: BookingCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { availableDates, bookedDates, loading } = useSchedulingData();

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader>
        <CardTitle>Calendário de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          locale={ptBR}
          modifiers={{
            available: (date) => 
              availableDates.includes(format(date, 'yyyy-MM-dd')),
            booked: (date) => 
              bookedDates.includes(format(date, 'yyyy-MM-dd'))
          }}
          modifiersStyles={{
            available: { 
              backgroundColor: "#10B981",
              color: "white" 
            },
            booked: { 
              backgroundColor: "#3B82F6",
              color: "white" 
            }
          }}
          className="rounded-md border"
          disabled={loading}
        />
      </CardContent>
    </Card>
  );
};
