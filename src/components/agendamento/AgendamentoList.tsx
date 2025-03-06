
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
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const AgendamentoList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayBookings = async () => {
      try {
        setLoading(true);
        
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const { data, error } = await supabase
          .from("scheduling")
          .select(`
            id,
            title,
            start_time,
            end_time,
            status,
            client:client_id (company_name)
          `)
          .gte("start_time", today.toISOString())
          .lt("start_time", tomorrow.toISOString())
          .order("start_time", { ascending: true });
        
        if (error) throw error;
        
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Falha ao carregar agendamentos");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodayBookings();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('scheduling_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scheduling' 
      }, () => {
        fetchTodayBookings();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento para hoje
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
                <TableRow key={booking.id}>
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
