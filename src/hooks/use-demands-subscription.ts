
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDemandsSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    const subscription = supabase
      .channel('demands_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands' 
      }, () => {
        onUpdate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);
};
