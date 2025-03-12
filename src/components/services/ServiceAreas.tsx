import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";

interface ServiceAreasProps {
  areas: any[];
  loading: boolean;
}

export const ServiceAreas = ({ areas, loading }: ServiceAreasProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (!areas.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Nenhuma área de serviço encontrada</p>
          <Button asChild className="mt-4">
            <Link to="/services/areas">Adicionar Área</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {areas.map((area) => (
        <Card key={area.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {area.name}
            </CardTitle>
            <Badge variant={area.status === 'active' ? 'default' : 'secondary'}>
              {area.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  {area.description || 'Sem descrição'}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{area.task_count} tarefas</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/services/areas/${area.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
