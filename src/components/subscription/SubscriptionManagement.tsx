
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/use-auth-state";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { SubscriptionStatus, useSubscription } from "@/hooks/use-subscription";

export function SubscriptionManagement() {
  const { userId, isAuthenticated } = useAuthState();
  const { subscription, loading, refreshSubscription } = useSubscription();
  
  const handleUpgrade = () => {
    // Navigate to plans page
    window.location.href = "/planos";
  };

  const handleCancel = async () => {
    try {
      if (!subscription?.id) {
        toast.error("Não foi possível identificar sua assinatura");
        return;
      }
      
      // For now, just update the status in the database
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: "canceled" })
        .eq('id', subscription.id);

      if (error) throw error;
      
      await refreshSubscription();
      toast.success("Assinatura cancelada com sucesso");
    } catch (err) {
      console.error("Error canceling subscription:", err);
      toast.error("Erro ao cancelar assinatura");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
          <CardDescription>Você ainda não possui um plano ativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={handleUpgrade}>Escolher um Plano</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";
  const expirationDate = new Date(subscription.currentPeriodEnd);
  const isExpired = expirationDate < new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isActive ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warning" />
          )}
          Plano {subscription.planName}
        </CardTitle>
        <CardDescription>
          {isActive 
            ? "Seu plano está ativo" 
            : subscription.status === "canceled" 
              ? "Assinatura cancelada" 
              : "Pagamento pendente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${isActive ? "text-success" : "text-warning"}`}>
              {isActive ? "Ativo" : subscription.status === "canceled" ? "Cancelado" : "Pendente"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Agendamentos</span>
            <span className="font-medium">{subscription.maxScheduling === 999 ? "Ilimitado" : subscription.maxScheduling}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Áreas de serviço</span>
            <span className="font-medium">{subscription.maxServiceAreas === 999 ? "Ilimitado" : subscription.maxServiceAreas}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Próxima cobrança</span>
            <span className="font-medium flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {format(expirationDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          
          <div className="pt-4 flex gap-2">
            {isActive && (
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
            )}
            <Button onClick={handleUpgrade} className="flex-1">
              {isActive ? "Alterar plano" : "Escolher plano"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
