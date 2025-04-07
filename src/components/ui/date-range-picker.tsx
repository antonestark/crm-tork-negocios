import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ range, setRange, className }: DateRangePickerProps) {
  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  const getLabel = () => {
    if (range?.from && range.to) {
      return `${format(range.from, "PP")} - ${format(range.to, "PP")}`;
    }
    if (range?.from) {
      return `${format(range.from, "PP")} - ...`;
    }
    return "Selecione o período";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !range?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
