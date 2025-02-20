
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-white border-b flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold text-primary">Tork Negócios</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-danger text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
