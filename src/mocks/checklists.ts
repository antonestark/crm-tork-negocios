export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  department_id: number;
  assigned_user_id: string;
  scheduled_date: string; // formato 'YYYY-MM-DD'
  period: 'Manhã' | 'Tarde' | 'Noite';
  status: 'Pendente' | 'Concluído' | 'Em andamento';
  created_by: string;
  completed_at: string | null;
}

export const mockChecklistItems: ChecklistItem[] = [
  {
    id: '1',
    title: 'Limpeza sala 1',
    description: 'Limpar e organizar',
    department_id: 2,
    assigned_user_id: 'user-123',
    scheduled_date: '2025-04-09',
    period: 'Manhã',
    status: 'Pendente',
    created_by: 'admin-1',
    completed_at: null,
  },
  {
    id: '2',
    title: 'Verificar equipamentos',
    description: 'Checar funcionamento',
    department_id: 2,
    assigned_user_id: 'user-456',
    scheduled_date: '2025-04-09',
    period: 'Tarde',
    status: 'Concluído',
    created_by: 'admin-1',
    completed_at: '2025-04-09T10:30:00Z',
  },
  {
    id: '3',
    title: 'Repor materiais',
    description: 'Repor papel e sabão',
    department_id: 2,
    assigned_user_id: 'user-123',
    scheduled_date: '2025-04-08',
    period: 'Manhã',
    status: 'Concluído',
    created_by: 'admin-1',
    completed_at: '2025-04-08T09:00:00Z',
  }
];
