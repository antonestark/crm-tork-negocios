import { useMemo } from "react";
import { mockChecklistItems, ChecklistItem } from "@/mocks/checklists";
import { format } from "date-fns";

interface UseMockChecklistsOptions {
  userId: string;
  isAdmin: boolean;
  date?: string; // formato 'YYYY-MM-DD', default hoje
}

export function useMockChecklists({ userId, isAdmin, date }: UseMockChecklistsOptions) {
  const today = date || format(new Date(), "yyyy-MM-dd");

  const items = useMemo<ChecklistItem[]>(() => {
    if (isAdmin) {
      // Admin vê todos os itens, qualquer data, qualquer usuário
      return mockChecklistItems;
    } else {
      // Operacional vê só os seus itens do dia atual
      return mockChecklistItems.filter(
        (item) =>
          item.assigned_user_id === userId &&
          item.scheduled_date === today
      );
    }
  }, [userId, isAdmin, today]);

  return { items };
}
