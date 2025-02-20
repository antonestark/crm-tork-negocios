
import { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to generate sample dates
const generateSampleDates = () => {
  const today = new Date();
  const available = Array.from({ length: 5 }, (_, i) => addDays(today, i + 1));
  const booked = Array.from({ length: 3 }, (_, i) => addDays(today, i + 3));
  const unavailable = Array.from({ length: 2 }, (_, i) => addDays(today, i + 6));

  return {
    available: available.map(date => date.toISOString().split('T')[0]),
    booked: booked.map(date => date.toISOString().split('T')[0]),
    unavailable: unavailable.map(date => date.toISOString().split('T')[0])
  };
};

const dates = generateSampleDates();

export const BookingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader>
        <CardTitle>Schedule Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={{
            available: (date) => 
              dates.available.includes(format(date, 'yyyy-MM-dd')),
            booked: (date) => 
              dates.booked.includes(format(date, 'yyyy-MM-dd')),
            unavailable: (date) => 
              dates.unavailable.includes(format(date, 'yyyy-MM-dd')),
          }}
          modifiersStyles={{
            available: { 
              backgroundColor: "#10B981",
              color: "white" 
            },
            booked: { 
              backgroundColor: "#3B82F6",
              color: "white" 
            },
            unavailable: { 
              backgroundColor: "#E5E7EB",
              color: "#9CA3AF" 
            },
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};
