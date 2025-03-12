
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Phone, Mail, Building } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete }) => {
  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow">
      <CardHeader className="pb-2 pt-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-none">{lead.name}</h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(lead.id)} className="h-8 w-8 p-0 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {lead.company && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-3.5 w-3.5 mr-1" />
            {lead.company}
          </div>
        )}
      </CardHeader>
      <CardContent className="py-2">
        {lead.notes && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{lead.notes}</p>
        )}
        
        <div className="space-y-1">
          {lead.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>{lead.phone}</span>
            </div>
          )}
          
          {lead.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(lead.created_at), { 
            addSuffix: true, 
            locale: ptBR 
          })}
        </div>
        
        {lead.assignedUser && (
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={lead.assignedUser.profile_image_url || ""} 
              alt={`${lead.assignedUser.first_name} ${lead.assignedUser.last_name}`} 
            />
            <AvatarFallback className="text-xs">
              {lead.assignedUser.first_name[0]}{lead.assignedUser.last_name[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </CardFooter>
    </Card>
  );
};
