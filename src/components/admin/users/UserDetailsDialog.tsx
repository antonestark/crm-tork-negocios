
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User } from '@/types/admin';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extractUserSettings, formatDateWithRelative } from '@/integrations/supabase/utils';
import { Separator } from '@/components/ui/separator';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: User;
}

export default function UserDetailsDialog({
  open,
  onOpenChange,
  userData,
}: UserDetailsDialogProps) {
  const userSettings = extractUserSettings(userData.settings);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o usuário.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Nome</h3>
              <p className="mt-1">{userData.first_name} {userData.last_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Função</h3>
              <p className="mt-1">{userData.role}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Departamento</h3>
              <p className="mt-1">{userData.department?.name || 'Nenhum'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
              <p className="mt-1">{userData.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Ativo</h3>
              <p className="mt-1">{userData.active ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Telefone</h3>
              <p className="mt-1">{userData.phone || 'Não cadastrado'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Último login</h3>
              <p className="mt-1">{formatDateWithRelative(userData.last_login)}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Criado em</h3>
              <p className="mt-1">{formatDateWithRelative(userData.created_at)}</p>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Configurações</h3>
            <div className="bg-muted rounded-md p-4">
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(userSettings, null, 2)}
              </pre>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Metadados</h3>
            <div className="bg-muted rounded-md p-4">
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(userData.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
