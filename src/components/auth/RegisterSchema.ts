
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'O nome deve conter apenas letras' }),
  email: z.string()
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail muito longo' }),
  password: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .max(72, { message: 'A senha deve ter no máximo 72 caracteres' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
    }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Map error codes to user-friendly messages
export const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'user-already-exists': 'Este e-mail já está registrado no sistema.',
    'invalid-email': 'O formato do e-mail é inválido.',
    'weak-password': 'A senha fornecida é muito fraca. Use uma senha mais forte.',
    'email-already-in-use': 'Este e-mail já está sendo utilizado.',
    'database-error': 'Erro no banco de dados. Entre em contato com o suporte.',
    'network-error': 'Problema de conexão. Verifique sua internet e tente novamente.',
  };

  return errorMessages[errorCode] || 'Ocorreu um erro ao fazer o cadastro. Tente novamente.';
};
