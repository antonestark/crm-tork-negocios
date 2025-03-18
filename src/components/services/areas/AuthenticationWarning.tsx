
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const AuthenticationWarning = () => {
  return (
    <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-yellow-600 h-6 w-6" />
        <h2 className="text-xl font-bold text-yellow-700">Autenticação Necessária</h2>
      </div>
      <p className="mb-4 text-yellow-700">
        Você precisa estar autenticado para acessar e gerenciar áreas de serviço.
      </p>
      <Button 
        // You would set this to your login page
        onClick={() => console.log("Should navigate to login page")}
        className="bg-yellow-600 hover:bg-yellow-700"
      >
        Fazer Login
      </Button>
    </div>
  );
};
