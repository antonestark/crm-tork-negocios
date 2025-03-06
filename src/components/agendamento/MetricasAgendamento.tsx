
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, CalendarCheck, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistance, startOfDay, endOfDay, subDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

type MetricData = {
  totalBookings: number;
  hoursOccupied: number;
  occupancyRate: number;
  cancelledBookings: number;
  previousTotalBookings: number;
  previousHoursOccupied: number;
};

type MetricasAgendamentoProps = {
  selectedDate?: Date;
};

export const MetricasAgendamento = ({ selectedDate = new Date() }: MetricasAgendamentoProps) => {
  const [metrics, setMetrics] = useState<MetricData>({
    totalBookings: 0,
    hoursOccupied: 0,
    occupancyRate: 0,
    cancelledBookings: 0,
    previousTotalBookings: 0,
    previousHoursOccupied: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [selectedDate]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const currentDate = selectedDate || new Date();
      const dayStart = startOfDay(currentDate);
      const dayEnd = endOfDay(currentDate);
      
      // Previous day for comparison
      const previousDayStart = startOfDay(subDays(currentDate, 1));
      const previousDayEnd = endOfDay(subDays(currentDate, 1));
      
      // Get current day bookings
      const { data: currentBookings, error: currentError } = await supabase
        .from("scheduling")
        .select("start_time, end_time, status")
        .gte("start_time", dayStart.toISOString())
        .lt("start_time", dayEnd.toISOString());
      
      if (currentError) throw currentError;
      
      // Get previous day bookings for comparison
      const { data: previousBookings, error: previousError } = await supabase
        .from("scheduling")
        .select("start_time, end_time")
        .gte("start_time", previousDayStart.toISOString())
        .lt("start_time", previousDayEnd.toISOString())
        .neq("status", "cancelled");
      
      if (previousError) throw previousError;
      
      // Calculate metrics
      const activeBookings = currentBookings?.filter(b => b.status !== 'cancelled') || [];
      const cancelledBookings = currentBookings?.filter(b => b.status === 'cancelled') || [];
      
      // Calculate hours occupied
      let totalHours = 0;
      activeBookings.forEach(booking => {
        const start = new Date(booking.start_time);
        const end = new Date(booking.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        totalHours += hours;
      });
      
      // Calculate previous day hours
      let previousTotalHours = 0;
      previousBookings?.forEach(booking => {
        const start = new Date(booking.start_time);
        const end = new Date(booking.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        previousTotalHours += hours;
      });
      
      // Calculate occupancy rate (assuming 10 hours of possible booking time per day)
      const workingHours = 10;
      const occupancyRate = Math.min(Math.round((totalHours / workingHours) * 100), 100);
      
      setMetrics({
        totalBookings: activeBookings.length,
        hoursOccupied: Math.round(totalHours * 10) / 10, // Round to 1 decimal
        occupancyRate,
        cancelledBookings: cancelledBookings.length,
        previousTotalBookings: previousBookings?.length || 0,
        previousHoursOccupied: Math.round(previousTotalHours * 10) / 10
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format comparison text
  const formatComparison = (current: number, previous: number, unit: string = '') => {
    if (previous === 0) return '';
    
    const diff = current - previous;
    if (diff === 0) return 'Mesmo que ontem';
    
    const prefix = diff > 0 ? '+' : '';
    return `${prefix}${diff}${unit} que ontem`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : metrics.totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {isToday(selectedDate) ? 'Hoje' : formatDistance(selectedDate, new Date(), { addSuffix: true, locale: ptBR })}
          </p>
          {!loading && metrics.previousTotalBookings > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatComparison(metrics.totalBookings, metrics.previousTotalBookings)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Horas Ocupadas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : `${metrics.hoursOccupied}h`}</div>
          <p className="text-xs text-muted-foreground">
            {!loading && formatComparison(metrics.hoursOccupied, metrics.previousHoursOccupied, 'h')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa Ocupação</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : `${metrics.occupancyRate}%`}</div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div 
              className="h-2 rounded-full bg-primary" 
              style={{ width: `${metrics.occupancyRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : metrics.cancelledBookings}</div>
          <p className="text-xs text-muted-foreground">
            {isToday(selectedDate) ? 'Hoje' : formatDistance(selectedDate, new Date(), { addSuffix: true, locale: ptBR })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
