
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormProvider } from 'react-hook-form';
import { User } from '@/types/admin';
import { UserCreate } from '@/hooks/users';
import { UserFormInputs } from './form/UserFormFields';
import { UserFormActions } from './form/UserFormActions';
import { useUserForm } from './form/useUserForm';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userData: UserCreate) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
}) => {
  const { formMethods, handleFormSubmit } = useUserForm(user);
  
  const onSubmitHandler = handleFormSubmit(onSave);
  
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmitHandler} className="space-y-4 mt-4">
            <UserFormInputs isNewUser={!user} />
            <UserFormActions 
              isEditMode={!!user} 
              onCancel={handleClose} 
            />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
