
import { useForm } from 'react-hook-form';
import { User } from '@/types/admin';
import { UserFormFields } from './types';
import { UserCreate } from '@/hooks/users';

export function useUserForm(user: User | null) {
  // Initialize form with user data or empty values
  const formMethods = useForm<UserFormFields>({
    defaultValues: user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      department_id: user.department_id || null,
      active: user.active !== false,
      status: user.status || 'active',
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'user',
      department_id: null,
      active: true,
      status: 'active',
      password: '',
    }
  });

  const handleFormSubmit = (onSave: (userData: UserCreate) => void) => {
    const onSubmit = (data: UserFormFields) => {
      onSave({
        ...data,
        active: !!data.active,
      });
    };

    return formMethods.handleSubmit(onSubmit);
  };

  return {
    formMethods,
    handleFormSubmit,
  };
}
