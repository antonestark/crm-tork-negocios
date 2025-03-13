
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSchedulingRealtime = (onUpdate: () => void) => {
  useEffect(() => {
    // Set up a realtime subscription for scheduling updates
    const subscription = supabase
      .channel('scheduling_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scheduling' 
      }, () => {
        onUpdate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);
};
