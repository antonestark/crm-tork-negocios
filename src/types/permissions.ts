export enum ResourcePage {
  DASHBOARD = 'dashboard',
  CLIENTS = 'clients',
  LEADS = 'leads',
  CHECKLIST = 'checklist',
  CONFIGURATIONS = 'configurations',
  REPORTS = 'reports',
}

export enum ActionType {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  START_ITEM = 'startItem',
  FINISH_ITEM = 'finishItem',
  EXPORT = 'export',
}

export interface Permission {
  page: ResourcePage;
  actions: Partial<Record<ActionType, boolean>>;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

/**
 * Exemplo de configuração inicial para os departamentos
 */
export const DepartmentsConfig: Department[] = [
  {
    id: 'admin',
    name: 'Administração',
    description: 'Acesso total ao sistema',
    permissions: Object.values(ResourcePage).map((page) => ({
      page,
      actions: {
        [ActionType.VIEW]: true,
        [ActionType.CREATE]: true,
        [ActionType.EDIT]: true,
        [ActionType.DELETE]: true,
        [ActionType.START_ITEM]: true,
        [ActionType.FINISH_ITEM]: true,
        [ActionType.EXPORT]: true,
      },
    })),
  },
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Acesso a leads, clientes e checklist',
    permissions: [
      {
        page: ResourcePage.LEADS,
        actions: {
          [ActionType.VIEW]: true,
          [ActionType.CREATE]: true,
          [ActionType.EDIT]: true,
          [ActionType.DELETE]: true,
        },
      },
      {
        page: ResourcePage.CLIENTS,
        actions: {
          [ActionType.VIEW]: true,
          [ActionType.CREATE]: true,
          [ActionType.EDIT]: true,
          [ActionType.DELETE]: true,
        },
      },
      {
        page: ResourcePage.CHECKLIST,
        actions: {
          [ActionType.VIEW]: true,
          [ActionType.START_ITEM]: true,
          [ActionType.FINISH_ITEM]: true,
        },
      },
    ],
  },
  {
    id: 'operacoes',
    name: 'Operações',
    description: 'Acesso ao checklist',
    permissions: [
      {
        page: ResourcePage.CHECKLIST,
        actions: {
          [ActionType.VIEW]: true,
          [ActionType.START_ITEM]: true,
          [ActionType.FINISH_ITEM]: true,
        },
      },
    ],
  },
];
