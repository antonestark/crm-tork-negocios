
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

type AgendamentoCalendarProps = {
  onDateChange: (date: Date | undefined) => void;
};

export const AgendamentoCalendar = ({ onDateChange }: AgendamentoCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    // Fetch dates that have bookings to highlight in calendar
    const fetchBookedDates = async () => {
      const startOfMonth = new Date(date?.getFullYear() || new Date().getFullYear(), 
                                   date?.getMonth() || new Date().getMonth(), 1);
      const endOfMonth = new Date(date?.getFullYear() || new Date().getFullYear(), 
                                 (date?.getMonth() || new Date().getMonth()) + 1, 0);
      
      const { data, error } = await supabase
        .from("scheduling")
        .select("start_time")
        .gte("start_time", startOfMonth.toISOString())
        .lte("start_time", endOfMonth.toISOString());
      
      if (error) {
        console.error("Error fetching booked dates:", error);
        return;
      }
      
      const dates = data?.map(item => new Date(item.start_time)) || [];
      setBookedDates(dates);
    };
    
    fetchBookedDates();
  }, [date?.getMonth(), date?.getFullYear()]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  // Function to add a CSS class to dates with bookings
  const modifiersStyles = {
    hasBooking: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '100%'
    }
  };

  // Create a modifiers object to highlight dates with bookings
  const modifiers = {
    hasBooking: (date: Date) => 
      bookedDates.some(bookedDate => 
        bookedDate.getDate() === date.getDate() && 
        bookedDate.getMonth() === date.getMonth() && 
        bookedDate.getFullYear() === date.getFullYear()
      )
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          locale={ptBR}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </CardContent>
    </Card>
  );
};
