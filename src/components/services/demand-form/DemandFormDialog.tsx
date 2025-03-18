
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DemandForm } from './DemandForm';
import { DemandFormProps } from './types';

export interface DemandFormDialogProps extends DemandFormProps {}

export const DemandFormDialog: React.FC<DemandFormDialogProps> = (props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{props.demand?.id ? 'Editar Demanda' : 'Nova Demanda'}</DialogTitle>
        </DialogHeader>
        <DemandForm {...props} />
      </DialogContent>
    </Dialog>
  );
};
