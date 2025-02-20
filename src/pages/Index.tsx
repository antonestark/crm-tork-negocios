
import { Header } from "@/components/layout/Header";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { TaskPanel } from "@/components/dashboard/TaskPanel";
import { BookingCalendar } from "@/components/dashboard/Calendar/BookingCalendar";
import { BookingsList } from "@/components/dashboard/Calendar/BookingsList";
import { MaintenancePanel } from "@/components/dashboard/MaintenancePanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6">
        <MetricsGrid />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <TaskPanel />
          <BookingsList />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <BookingCalendar />
          <MaintenancePanel />
        </div>
      </main>
    </div>
  );
};

export default Index;
