
import { Header } from "@/components/layout/Header";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { TaskPanel } from "@/components/dashboard/TaskPanel";
import { BookingCalendar } from "@/components/dashboard/Calendar/BookingCalendar";
import { BookingsList } from "@/components/dashboard/Calendar/BookingsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <MetricsGrid />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookingCalendar />
          <BookingsList />
        </div>
        <div className="mt-6">
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default Index;
