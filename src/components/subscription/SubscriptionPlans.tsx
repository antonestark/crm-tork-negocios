
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuthState } from "@/hooks/use-auth-state";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type PlanFeature = {
  name: string;
  included: boolean;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number; 
  interval: 'monthly' | 'yearly';
  features: PlanFeature[];
  isPopular?: boolean;
  maxScheduling?: number;
  maxServiceAreas?: number;
};

const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    description: "Para pequenos negócios começarem a organizar seus serviços",
    price: 0,
    interval: 'monthly',
    features: [
      { name: "5 agendamentos por mês", included: true },
      { name: "3 áreas de serviço", included: true },
      { name: "Dashboard básico", included: true },
      { name: "Acesso para 1 usuário", included: true },
      { name: "Suporte por email", included: true },
      { name: "Relatórios avançados", included: false },
      { name: "Integração com clientes", included: false },
    ],
    maxScheduling: 5,
    maxServiceAreas: 3
  },
  {
    id: "pro",
    name: "Profissional",
    description: "Para empresas em crescimento que precisam de mais recursos",
    price: 29.90,
    interval: 'monthly',
    features: [
      { name: "50 agendamentos por mês", included: true },
      { name: "Áreas de serviço ilimitadas", included: true },
      { name: "Dashboard avançado", included: true },
      { name: "Acesso para 3 usuários", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Integração com clientes", included: false },
    ],
    isPopular: true,
    maxScheduling: 50,
    maxServiceAreas: 999
  },
  {
    id: "business",
    name: "Empresarial",
    description: "Para negócios que precisam de recursos completos e suporte dedicado",
    price: 79.90,
    interval: 'monthly',
    features: [
      { name: "Agendamentos ilimitados", included: true },
      { name: "Áreas de serviço ilimitadas", included: true },
      { name: "Dashboard personalizado", included: true },
      { name: "Acesso para equipes", included: true },
      { name: "Suporte dedicado", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Integração com clientes", included: true },
    ],
    maxScheduling: 999,
    maxServiceAreas: 999
  }
];

export const SubscriptionPlans = () => {
  const { isAuthenticated, userId } = useAuthState();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      toast.error("É necessário fazer login para assinar um plano");
      return;
    }

    try {
      if (plan.id === "free") {
        // For free plan, just update the user's subscription in the database
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_id: plan.id,
            status: "active",
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            max_scheduling: plan.maxScheduling || 5,
            max_service_areas: plan.maxServiceAreas || 3
          });

        if (error) throw error;
        toast.success("Plano gratuito ativado com sucesso!");
      } else {
        // For paid plans, redirect to a checkout page (to be implemented)
        toast.info("Redirecionando para o checkout...");
        // This would be replaced with actual checkout logic
        console.log("Subscribe to plan:", plan.id);
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Erro ao assinar o plano. Tente novamente.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Escolha o plano ideal para seu negócio</h2>
        <p className="text-muted-foreground">
          Planos flexíveis que crescem com sua empresa
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg relative' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Mais popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  R$ {plan.price.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.interval === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check 
                      className={`mr-2 h-4 w-4 ${feature.included ? 'text-primary' : 'text-muted-foreground opacity-50'}`} 
                    />
                    <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan)}
                className="w-full" 
                variant={plan.isPopular ? "default" : "outline"}
              >
                {plan.id === "free" ? "Começar Grátis" : "Assinar Agora"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
