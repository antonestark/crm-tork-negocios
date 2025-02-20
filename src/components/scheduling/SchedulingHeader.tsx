
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, Clock } from "lucide-react";
import { NewScheduleModal } from "./NewScheduleModal";

export const SchedulingHeader = () => {
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scheduling</h2>
          <p className="text-muted-foreground">
            Manage your meeting room schedules and bookings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center" 
            size="sm"
            onClick={() => setIsNewScheduleOpen(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            New Schedule
          </Button>
          <Button variant="outline" className="flex items-center" size="sm">
            <Globe className="mr-2 h-4 w-4" />
            Online Schedule
          </Button>
          <Button variant="outline" className="flex items-center" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Manual Schedule
          </Button>
        </div>
      </div>

      <NewScheduleModal 
        isOpen={isNewScheduleOpen} 
        onClose={() => setIsNewScheduleOpen(false)} 
      />
    </>
  );
};
