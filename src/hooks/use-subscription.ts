
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './use-auth-state';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none';

export type UserSubscription = {
  id: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  maxScheduling: number;
  maxServiceAreas: number;
  usageStats?: {
    schedulingCount: number;
    serviceAreasCount: number;
  };
};

export const useSubscription = () => {
  const { userId, isAuthenticated } = useAuthState();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the subscription details
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*, plans:plan_id(name)')
        .eq('user_id', userId)
        .single();

      if (subscriptionError) {
        if (subscriptionError.code === 'PGRST116') {
          // No subscription found - this is not an error
          setSubscription(null);
          return;
        }
        throw subscriptionError;
      }

      if (!subscriptionData) {
        setSubscription(null);
        return;
      }

      // Fetch usage statistics
      const [schedulingResponse, areasResponse] = await Promise.all([
        supabase
          .from('scheduling')
          .select('count', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('service_areas')
          .select('count', { count: 'exact', head: true })
          .eq('responsible_id', userId)
      ]);

      const formattedSubscription: UserSubscription = {
        id: subscriptionData.id,
        planId: subscriptionData.plan_id,
        planName: subscriptionData.plans?.name || subscriptionData.plan_id,
        status: subscriptionData.status as SubscriptionStatus,
        currentPeriodEnd: subscriptionData.current_period_end,
        maxScheduling: subscriptionData.max_scheduling,
        maxServiceAreas: subscriptionData.max_service_areas,
        usageStats: {
          schedulingCount: schedulingResponse.count || 0,
          serviceAreasCount: areasResponse.count || 0
        }
      };

      setSubscription(formattedSubscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const checkCanCreateScheduling = () => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (subscription.maxScheduling === 999) return true; // Unlimited

    return subscription.usageStats?.schedulingCount 
      ? subscription.usageStats.schedulingCount < subscription.maxScheduling 
      : true;
  };

  const checkCanCreateServiceArea = () => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (subscription.maxServiceAreas === 999) return true; // Unlimited

    return subscription.usageStats?.serviceAreasCount 
      ? subscription.usageStats.serviceAreasCount < subscription.maxServiceAreas 
      : true;
  };

  return {
    subscription,
    loading,
    error,
    refreshSubscription: fetchSubscription,
    checkCanCreateScheduling,
    checkCanCreateServiceArea
  };
};
