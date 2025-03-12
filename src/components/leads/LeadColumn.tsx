
import React from 'react';
import { LeadCard } from './LeadCard';
import { Lead } from '@/types/admin';
import { cn } from '@/lib/utils';

interface LeadColumnProps {
  title: string;
  count: number;
  status: string;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  className?: string;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
}

export const LeadColumn: React.FC<LeadColumnProps> = ({ 
  title, 
  count, 
  status, 
  leads,
  onEditLead,
  onDeleteLead,
  className,
  onDragOver,
  onDrop
}) => {
  // Determine background color based on status
  const getColumnColor = () => {
    switch (status) {
      case 'qualificado':
        return 'bg-green-50 border-green-200';
      case 'não qualificado':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Determine header color based on status
  const getHeaderColor = () => {
    switch (status) {
      case 'qualificado':
        return 'bg-green-100 text-green-800';
      case 'não qualificado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div 
      className={cn(
        'flex flex-col rounded-lg w-full border',
        getColumnColor(),
        className
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-status={status}
    >
      <div className={cn('px-4 py-3 rounded-t-lg font-medium flex justify-between items-center', getHeaderColor())}>
        <div>{title}</div>
        <div className="px-2 py-1 rounded-full text-xs font-semibold bg-white">{count}</div>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)]">
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum lead nesta coluna
          </div>
        ) : (
          leads.map(lead => (
            <div 
              key={lead.id} 
              draggable 
              onDragStart={(e) => {
                e.dataTransfer.setData('leadId', lead.id);
              }}
            >
              <LeadCard 
                lead={lead} 
                onEdit={onEditLead} 
                onDelete={onDeleteLead} 
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
