import React from "react";
import { DayPicker, DateFormatter } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";

interface CalendarioMensalProps {
  selected: Date;
  onSelect: (date: Date) => void;
  availableDays?: Date[];
}

export const CalendarioMensal: React.FC<CalendarioMensalProps> = ({
  selected,
  onSelect,
}) => {
  // Custom formatter para o cabeçalho do mês
  const formatCaption: DateFormatter = (date) =>
    date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={date => date && onSelect(date)}
      locale={ptBR}
      weekStartsOn={0}
      showOutsideDays
      disabled={{ before: new Date() }} // Desabilitar dias anteriores a hoje
      className="!w-full"
      classNames={{
        months: "flex flex-col",
        month: "space-y-2",
        caption: "flex justify-between items-center mb-2 px-2 relative", // Tornar relativo para posicionar nav
        caption_label: "font-semibold text-lg text-foreground text-center flex-1", // Centralizar o label - Remover dark:
        nav: "flex items-center gap-1", // Remover posicionamento absoluto
        nav_button:
          "rounded-full w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors", // Remover dark:
        nav_button_previous: "absolute left-1", // Posicionar botão esquerdo
        nav_button_next: "absolute right-1", // Posicionar botão direito
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "text-xs text-muted-foreground w-10 h-10 font-semibold", // Remover dark:
        row: "",
        cell: "w-10 h-10 p-0 text-center align-middle",
        day: "w-10 h-10 p-0 text-center align-middle cursor-pointer font-semibold transition-colors",
        day_selected: "bg-primary text-primary-foreground rounded-full", // Usar cores primárias do tema
        day_today: "",
        day_outside: "opacity-30 text-muted-foreground", // Remover dark:
        day_disabled: "opacity-30 cursor-not-allowed text-muted-foreground", // Remover dark:
      }}
      modifiers={{
        selected: selected,
      }}
      modifiersClassNames={{
        selected: "bg-primary text-primary-foreground rounded-full", // Usar cores primárias do tema
        // Todos os dias do mês (não selecionados) com círculo azul claro
        day: "bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200", // Remover dark:
      }}
      formatters={{
        formatCaption,
      }}
      components={{
        // Remove o destaque de "hoje" se não for selecionado
      }}
    />
  );
};

export default CalendarioMensal;
