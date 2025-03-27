
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, CreditCard } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { Progress } from "@/components/ui/progress";

export const SubscriptionBanner = () => {
  const { subscription, loading } = useSubscription();

  if (loading) return null;

  // If user has an active plan with unlimited bookings
  if (subscription?.status === 'active' && subscription.maxScheduling === 999) {
    return null; // No need to show banner for unlimited plan
  }

  // If user has no subscription or inactive subscription
  if (!subscription || subscription.status !== 'active') {
    return (
      <Alert className="mb-6 border-warning bg-warning/10">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <AlertTitle>Nenhum plano ativo</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span>
            Você não possui uma assinatura ativa. Escolha um plano para ter acesso a mais agendamentos.
          </span>
          <Button size="sm" asChild>
            <Link to="/planos">
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Planos
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // If user has an active plan with limited bookings
  const { usageStats, maxScheduling } = subscription;
  const schedulingCount = usageStats?.schedulingCount || 0;
  const usagePercentage = Math.min((schedulingCount / maxScheduling) * 100, 100);
  const isNearLimit = usagePercentage >= 80;

  if (isNearLimit) {
    return (
      <Alert className={usagePercentage >= 95 ? "mb-6 border-destructive bg-destructive/10" : "mb-6 border-warning bg-warning/10"}>
        <AlertTriangle className={`h-5 w-5 ${usagePercentage >= 95 ? "text-destructive" : "text-warning"}`} />
        <AlertTitle>Limite de agendamentos próximo</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>
              Você utilizou {schedulingCount} de {maxScheduling} agendamentos disponíveis no seu plano.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link to="/planos">Atualizar Plano</Link>
            </Button>
          </div>
          <Progress value={usagePercentage} className={usagePercentage >= 95 ? "h-2 bg-destructive/20" : "h-2 bg-warning/20"} />
        </AlertDescription>
      </Alert>
    );
  }

  // User has an active plan with plenty of available bookings
  return (
    <Alert className="mb-6 border-success bg-success/10">
      <Check className="h-5 w-5 text-success" />
      <AlertTitle>Plano {subscription.planName} ativo</AlertTitle>
      <AlertDescription className="space-y-2">
        <span>
          Você utilizou {schedulingCount} de {maxScheduling} agendamentos disponíveis no seu plano.
        </span>
        <Progress value={usagePercentage} className="h-2 bg-success/20" />
      </AlertDescription>
    </Alert>
  );
};
