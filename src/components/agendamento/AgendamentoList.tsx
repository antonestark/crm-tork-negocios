
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, isToday, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Booking = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  client?: {
    company_name: string;
  };
};

type AgendamentoListProps = {
  selectedDate?: Date;
};

export const AgendamentoList = ({ selectedDate }: AgendamentoListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('scheduling_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scheduling' 
      }, () => {
        fetchBookings();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Get date range based on selectedDate or default to today
      const filterDate = selectedDate || new Date();
      const dayStart = startOfDay(filterDate);
      const dayEnd = endOfDay(filterDate);
      
      let query = supabase
        .from("scheduling")
        .select(`
          id,
          title,
          start_time,
          end_time,
          status,
          client:client_id (company_name)
        `)
        .gte("start_time", dayStart.toISOString())
        .lt("start_time", dayEnd.toISOString())
        .order("start_time", { ascending: true });
      
      // Apply status filter if set
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Falha ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (status === 'cancelled') {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
    }
    
    if (now >= start && now <= end) {
      return <Badge className="bg-green-500 text-white">Em Andamento</Badge>;
    }
    
    if (now < start) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Agendado</Badge>;
    }
    
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Concluído</Badge>;
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return `${startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDateHeader = () => {
    if (!selectedDate) return "Hoje";
    
    if (isToday(selectedDate)) {
      return "Hoje";
    }
    
    return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const resetFilter = () => {
    setStatusFilter(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agendamentos: {formatDateHeader()}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={resetFilter}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
              Agendados
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
              Cancelados
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
              Concluídos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento para {isToday(selectedDate || new Date()) ? 'hoje' : 'esta data'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="cursor-pointer hover:bg-muted">
                  <TableCell>{formatTimeRange(booking.start_time, booking.end_time)}</TableCell>
                  <TableCell>{booking.client?.company_name || booking.title}</TableCell>
                  <TableCell>{getStatusBadge(booking.status, booking.start_time, booking.end_time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
