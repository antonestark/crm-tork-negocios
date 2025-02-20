
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

export const AgendamentoCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ptBR}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};
