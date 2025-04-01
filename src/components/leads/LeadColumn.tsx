
import React from 'react';
import { LeadCard } from './LeadCard';
import { Lead } from '@/types/admin';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Import Badge for count

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
  // Removed color functions

  // Define border colors based on status
  const statusBorderColor = 
    status === 'qualificado' ? 'border-green-500' :
    status === 'não qualificado' ? 'border-red-500' :
    'border-slate-500'; // Neutral color

  return (
    // Apply dark theme styles + conditional top border color
    <div 
      className={cn(
        'flex flex-col rounded-lg w-full border bg-slate-800/60 backdrop-blur-sm border-blue-900/40 shadow-lg', 
        'border-t-4', // Add top border thickness
        statusBorderColor, // Apply conditional color
        className
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-status={status}
    >
      {/* Header - Removed rounded-t-lg as border is now on parent */}
      <div className={cn('px-4 py-3 font-medium flex justify-between items-center border-b border-blue-900/40 text-slate-100')}>
        <div>{title}</div>
        {/* Use Badge for count */}
        <Badge variant="secondary">{count}</Badge> 
      </div>
      
      {/* Apply padding to content area */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar"> 
        {leads.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm"> {/* Adjusted text color */}
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
