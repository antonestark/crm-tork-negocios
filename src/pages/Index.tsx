
import { Header } from "@/components/layout/Header";
import { SchedulingHeader } from "@/components/scheduling/SchedulingHeader";
import { BookingCalendar } from "@/components/dashboard/Calendar/BookingCalendar";
import { BookingsList } from "@/components/dashboard/Calendar/BookingsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <SchedulingHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookingCalendar />
          <BookingsList />
        </div>
      </main>
    </div>
  );
};

export default Index;
