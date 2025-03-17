
// This file augments the Database interface from the original types.ts file
// without modifying the read-only file directly

export interface Services {
  Row: {
    id: string;
    title: string;
    description?: string | null;
    status?: string | null;
    area_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    assigned_to?: string | null;
    due_date?: string | null;
  };
  Insert: {
    id?: string;
    title: string;
    description?: string | null;
    status?: string | null;
    area_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    assigned_to?: string | null;
    due_date?: string | null;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string | null;
    status?: string | null;
    area_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    assigned_to?: string | null;
    due_date?: string | null;
  };
}

export interface ServiceReports {
  Row: {
    id: string;
    report_date: string;
    area_id?: string | null;
    average_completion_time: number;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Insert: {
    id?: string;
    report_date: string;
    area_id?: string | null;
    average_completion_time: number;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    report_date?: string;
    area_id?: string | null;
    average_completion_time?: number;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export interface UserPermissionGroups {
  Row: {
    id: string;
    user_id: string;
    group_id: string;
    created_at?: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    group_id: string;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    group_id?: string;
    created_at?: string | null;
  };
}

// Import but don't directly re-export to avoid duplicate identifier
import type { Database as OriginalDatabase } from './types';

// Extend the Database interface using declaration merging
declare global {
  interface Database extends OriginalDatabase {
    public: {
      Tables: {
        activity_logs: OriginalDatabase['public']['Tables']['activity_logs'];
        checklist_completions: OriginalDatabase['public']['Tables']['checklist_completions'];
        checklist_items: OriginalDatabase['public']['Tables']['checklist_items'];
        clients: OriginalDatabase['public']['Tables']['clients'];
        demands: OriginalDatabase['public']['Tables']['demands'];
        department_permissions: OriginalDatabase['public']['Tables']['department_permissions'];
        departments: OriginalDatabase['public']['Tables']['departments'];
        lead_activities: OriginalDatabase['public']['Tables']['lead_activities'];
        leads: OriginalDatabase['public']['Tables']['leads'];
        maintenance_records: OriginalDatabase['public']['Tables']['maintenance_records'];
        permission_groups: OriginalDatabase['public']['Tables']['permission_groups'];
        permissions: OriginalDatabase['public']['Tables']['permissions'];
        scheduling: OriginalDatabase['public']['Tables']['scheduling'];
        service_areas: OriginalDatabase['public']['Tables']['service_areas'];
        user_groups: OriginalDatabase['public']['Tables']['user_groups'];
        user_permissions: OriginalDatabase['public']['Tables']['user_permissions'];
        users: OriginalDatabase['public']['Tables']['users'];
        
        // Add missing tables that are causing the type errors
        services: Services;
        service_reports: ServiceReports;
        user_permission_groups: UserPermissionGroups;
      };
      Views: OriginalDatabase['public']['Views'];
      Functions: OriginalDatabase['public']['Functions'];
      Enums: OriginalDatabase['public']['Enums'];
      CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
    };
  }
}

// Export the Database type from original types.ts
export type { Database } from './types';
