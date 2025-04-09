import React from "react";
import { ChecklistItem } from "@/mocks/checklists";
import { StatusBadge } from "./StatusBadge";

interface ChecklistCardProps {
  item: ChecklistItem;
  children?: React.ReactNode; // para botões ou ações extras
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({ item, children }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-gray-700">{item.description}</p>
      <div className="text-xs text-gray-500 space-y-0.5">
        <p>Período: {item.period}</p>
        <p>Data: {item.scheduled_date}</p>
        <p>Responsável: {item.assigned_user_id}</p>
        {item.completed_at && <p>Finalizado em: {item.completed_at}</p>}
      </div>
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};
