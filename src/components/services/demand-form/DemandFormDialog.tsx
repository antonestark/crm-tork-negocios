
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DemandForm } from './DemandForm';
import { DemandFormProps } from './types';

export interface DemandFormDialogProps extends DemandFormProps {}

export const DemandFormDialog: React.FC<DemandFormDialogProps> = (props) => {
  // Log when dialog open state changes for debugging
  useEffect(() => {
    console.log("DemandFormDialog open state:", props.open);
  }, [props.open]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{props.demand?.id ? 'Editar Demanda' : 'Nova Demanda'}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {props.demand?.id ? 'editar a' : 'criar uma nova'} demanda.
          </DialogDescription>
        </DialogHeader>
        <DemandForm {...props} />
      </DialogContent>
    </Dialog>
  );
};
