
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { useSchedulingData } from "@/hooks/use-scheduling-data";
import { useState, useEffect } from "react";

type StatusIconProps = {
  status: string;
  startTime: string;
  endTime: string;
};

const StatusIcon = ({ status, startTime, endTime }: StatusIconProps) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const config = {
    active: { 
      icon: Clock, 
      color: "text-warning" 
    },
    confirmed: { 
      icon: CheckCircle, 
      color: "text-success" 
    },
    cancelled: { 
      icon: AlertTriangle, 
      color: "text-danger" 
    },
  };
  
  let statusKey: 'active' | 'confirmed' | 'cancelled' = 'confirmed';
  
  if (status === 'cancelled') {
    statusKey = 'cancelled';
  } else if (now >= start && now <= end) {
    statusKey = 'active';
  }

  const Icon = config[statusKey].icon;
  return <Icon className={`h-4 w-4 ${config[statusKey].color}`} />;
};

export const BookingsList = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { bookings, loading } = useSchedulingData(selectedDate);
  
  // Agrupar os agendamentos por período (manhã/tarde)
  const morningBookings = bookings.filter(b => {
    const hour = new Date(b.start_time).getHours();
    return hour >= 0 && hour < 12;
  });
  
  const afternoonBookings = bookings.filter(b => {
    const hour = new Date(b.start_time).getHours();
    return hour >= 12 && hour < 24;
  });
  
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agendamentos do Dia</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center">
          Ver todos
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {morningBookings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Manhã
                  </h3>
                  <div className="space-y-3">
                    {morningBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{formatTime(booking.start_time)}</div>
                          <div>
                            <p className="font-medium">{booking.client?.company_name || booking.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Duração: {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </p>
                          </div>
                        </div>
                        <StatusIcon status={booking.status} startTime={booking.start_time} endTime={booking.end_time} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {afternoonBookings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Tarde
                  </h3>
                  <div className="space-y-3">
                    {afternoonBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{formatTime(booking.start_time)}</div>
                          <div>
                            <p className="font-medium">{booking.client?.company_name || booking.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Duração: {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </p>
                          </div>
                        </div>
                        <StatusIcon status={booking.status} startTime={booking.start_time} endTime={booking.end_time} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {morningBookings.length === 0 && afternoonBookings.length === 0 && (
                <div className="flex justify-center items-center py-10 text-muted-foreground">
                  Nenhum agendamento para hoje
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
