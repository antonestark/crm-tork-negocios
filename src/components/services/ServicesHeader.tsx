
import { Button } from "@/components/ui/button";
import { Plus, ListTodo, Filter } from "lucide-react";

export const ServicesHeader = () => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <p className="text-muted-foreground">
          Gerencie as atividades de serviços gerais
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex items-center" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
        <Button className="flex items-center" variant="outline" size="sm">
          <ListTodo className="mr-2 h-4 w-4" />
          Nova Demanda
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
