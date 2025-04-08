import { ResourcePage, ActionType } from './permissions';

export interface SystemPermission {
  page: ResourcePage;
  action: ActionType;
  title: string;
  description: string;
  code: string;
}

export const SYSTEM_PERMISSIONS: SystemPermission[] = [
  // Dashboard
  {
    page: ResourcePage.DASHBOARD,
    action: ActionType.VIEW,
    title: 'Visualizar Dashboard',
    description: 'Permite visualizar o painel principal do sistema',
    code: 'dashboard:view',
  },

  // Clientes
  {
    page: ResourcePage.CLIENTS,
    action: ActionType.VIEW,
    title: 'Visualizar Clientes',
    description: 'Permite visualizar a lista de clientes',
    code: 'clients:view',
  },
  {
    page: ResourcePage.CLIENTS,
    action: ActionType.CREATE,
    title: 'Criar Clientes',
    description: 'Permite criar novos clientes',
    code: 'clients:create',
  },
  {
    page: ResourcePage.CLIENTS,
    action: ActionType.EDIT,
    title: 'Editar Clientes',
    description: 'Permite editar informações dos clientes',
    code: 'clients:edit',
  },
  {
    page: ResourcePage.CLIENTS,
    action: ActionType.DELETE,
    title: 'Excluir Clientes',
    description: 'Permite excluir clientes',
    code: 'clients:delete',
  },

  // Leads
  {
    page: ResourcePage.LEADS,
    action: ActionType.VIEW,
    title: 'Visualizar Leads',
    description: 'Permite visualizar a lista de leads',
    code: 'leads:view',
  },
  {
    page: ResourcePage.LEADS,
    action: ActionType.CREATE,
    title: 'Criar Leads',
    description: 'Permite criar novos leads',
    code: 'leads:create',
  },
  {
    page: ResourcePage.LEADS,
    action: ActionType.EDIT,
    title: 'Editar Leads',
    description: 'Permite editar informações dos leads',
    code: 'leads:edit',
  },
  {
    page: ResourcePage.LEADS,
    action: ActionType.DELETE,
    title: 'Excluir Leads',
    description: 'Permite excluir leads',
    code: 'leads:delete',
  },

  // Checklist
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.VIEW,
    title: 'Visualizar Checklist',
    description: 'Permite visualizar o checklist',
    code: 'checklist:view',
  },
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.START_ITEM,
    title: 'Iniciar Item do Checklist',
    description: 'Permite iniciar um item do checklist',
    code: 'checklist:startItem',
  },
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.FINISH_ITEM,
    title: 'Finalizar Item do Checklist',
    description: 'Permite finalizar um item do checklist',
    code: 'checklist:finishItem',
  },
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.CREATE,
    title: 'Criar Checklist',
    description: 'Permite criar novos checklists',
    code: 'checklist:create',
  },
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.EDIT,
    title: 'Editar Checklist',
    description: 'Permite editar checklists',
    code: 'checklist:edit',
  },
  {
    page: ResourcePage.CHECKLIST,
    action: ActionType.DELETE,
    title: 'Excluir Checklist',
    description: 'Permite excluir checklists',
    code: 'checklist:delete',
  },

  // Configurações
  {
    page: ResourcePage.CONFIGURATIONS,
    action: ActionType.VIEW,
    title: 'Visualizar Configurações',
    description: 'Permite visualizar as configurações do sistema',
    code: 'configurations:view',
  },
  {
    page: ResourcePage.CONFIGURATIONS,
    action: ActionType.EDIT,
    title: 'Editar Configurações',
    description: 'Permite editar as configurações do sistema',
    code: 'configurations:edit',
  },

  // Relatórios
  {
    page: ResourcePage.REPORTS,
    action: ActionType.VIEW,
    title: 'Visualizar Relatórios',
    description: 'Permite visualizar relatórios do sistema',
    code: 'reports:view',
  },
  {
    page: ResourcePage.REPORTS,
    action: ActionType.EXPORT,
    title: 'Exportar Relatórios',
    description: 'Permite exportar relatórios do sistema',
    code: 'reports:export',
  },
];
