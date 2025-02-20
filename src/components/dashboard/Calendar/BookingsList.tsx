
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";

type Booking = {
  time: string;
  client: string;
  duration: string;
  status: "confirmed" | "in-progress" | "pending";
};

const StatusIcon = ({ status }: { status: Booking["status"] }) => {
  const config = {
    confirmed: { icon: CheckCircle, color: "text-success" },
    "in-progress": { icon: Clock, color: "text-warning" },
    pending: { icon: AlertTriangle, color: "text-danger" },
  };

  const Icon = config[status].icon;
  return <Icon className={`h-4 w-4 ${config[status].color}`} />;
};

const bookings: Booking[] = [
  {
    time: "09:00",
    client: "Empresa ABC",
    duration: "2h",
    status: "confirmed",
  },
  {
    time: "11:30",
    client: "Startup XYZ",
    duration: "1h",
    status: "in-progress",
  },
  {
    time: "14:00",
    client: "Consultoria 123",
    duration: "3h",
    status: "pending",
  },
  {
    time: "16:30",
    client: "Tech Solutions",
    duration: "1h30",
    status: "confirmed",
  },
];

export const BookingsList = () => {
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
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {["Manhã", "Tarde"].map((period) => (
              <div key={period}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {period}
                </h3>
                <div className="space-y-3">
                  {bookings.map((booking, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium">{booking.time}</div>
                        <div>
                          <p className="font-medium">{booking.client}</p>
                          <p className="text-sm text-muted-foreground">
                            Duração: {booking.duration}
                          </p>
                        </div>
                      </div>
                      <StatusIcon status={booking.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
