
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Clock, Users, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MetricCard = ({ 
  title, 
  value, 
  trend = 0,
  status = "",
  icon: Icon,
  className = "",
  isLoading = false
}: {
  title: string;
  value: string;
  trend?: number;
  status?: string;
  icon: any;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <Card className={`${className} hover:shadow-lg transition-shadow animate-fade-in`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "..." : value}
        </div>
        {trend !== 0 && (
          <p className={`text-xs flex items-center mt-1 ${trend > 0 ? "text-success" : "text-danger"}`}>
            {trend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}% em relação ao mês anterior
          </p>
        )}
        {status && (
          <p className="text-sm text-muted-foreground mt-1">{status}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const MetricsGrid = () => {
  const [metrics, setMetrics] = useState({
    activeClients: "0",
    roomStatus: "Carregando...",
    roomNextBooking: "",
    dailyBookings: "0",
    nextBookingTime: "",
    activeDemands: "0",
    priorityDemands: "0"
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch active clients count
        const { count: activeClients, error: clientsError } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        if (clientsError) throw clientsError;

        // 2. Fetch room status and next booking
        const now = new Date().toISOString();
        const { data: roomBookings, error: roomError } = await supabase
          .from("scheduling")
          .select("start_time, end_time, title")
          .gte("end_time", now)
          .order("start_time", { ascending: true })
          .limit(1);

        if (roomError) throw roomError;

        // 3. Fetch today's bookings count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { count: todayBookings, error: bookingsError } = await supabase
          .from("scheduling")
          .select("*", { count: "exact", head: true })
          .gte("start_time", today.toISOString())
          .lt("start_time", tomorrow.toISOString());

        if (bookingsError) throw bookingsError;

        // 4. Fetch active demands and priority demands
        const { data: demands, error: demandsError } = await supabase
          .from("demands")
          .select("*")
          .not("status", "eq", "completed");

        if (demandsError) throw demandsError;

        const priorityDemands = demands?.filter(d => d.priority === "high").length || 0;

        // Determine room status
        let roomStatus = "Livre";
        let nextBooking = "";

        if (roomBookings && roomBookings.length > 0) {
          const booking = roomBookings[0];
          const start = new Date(booking.start_time);
          const end = new Date(booking.end_time);
          const currentTime = new Date();

          if (currentTime >= start && currentTime <= end) {
            roomStatus = "Ocupada";
            nextBooking = "Livre após " + end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          } else {
            nextBooking = "Próximo: " + start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }
        }

        // Calculate next booking time
        let nextBookingTime = "";
        if (roomBookings && roomBookings.length > 0) {
          const bookingStart = new Date(roomBookings[0].start_time);
          const now = new Date();
          const diffMs = bookingStart.getTime() - now.getTime();
          const diffMins = Math.round(diffMs / 60000);
          
          if (diffMins <= 0) {
            nextBookingTime = "Em andamento";
          } else if (diffMins < 60) {
            nextBookingTime = `Em ${diffMins}min`;
          } else {
            nextBookingTime = `Em ${Math.floor(diffMins / 60)}h ${diffMins % 60}min`;
          }
        }

        setMetrics({
          activeClients: activeClients?.toString() || "0",
          roomStatus,
          roomNextBooking: nextBooking,
          dailyBookings: todayBookings?.toString() || "0",
          nextBookingTime,
          activeDemands: demands?.length.toString() || "0",
          priorityDemands: priorityDemands.toString()
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh the dashboard every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Total de Clientes Ativos"
        value={metrics.activeClients}
        trend={8}
        icon={Users}
        isLoading={loading}
      />
      <MetricCard
        title="Status Sala de Reunião"
        value={metrics.roomStatus}
        status={metrics.roomNextBooking}
        icon={Clock}
        className={`border-l-4 ${metrics.roomStatus === "Livre" ? "border-success" : "border-amber-500"}`}
        isLoading={loading}
      />
      <MetricCard
        title="Agendamentos do Dia"
        value={metrics.dailyBookings}
        status={metrics.nextBookingTime}
        icon={Calendar}
        isLoading={loading}
      />
      <MetricCard
        title="Demandas Ativas"
        value={metrics.activeDemands}
        status={`${metrics.priorityDemands} prioritárias`}
        icon={AlertTriangle}
        className="border-l-4 border-warning"
        isLoading={loading}
      />
    </div>
  );
};
