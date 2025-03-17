

// This file augments the Database interface from the original types.ts file
// without modifying the read-only file directly

export interface Services {
  Row: {
    id: string;
    title: string;
    description: string;   // Changed from optional to required
    status: string;        // Changed from optional to required
    area_id: string;       // Changed from optional to required
    created_at: string;    // Changed from optional to required
    updated_at: string;    // Changed from optional to required
    assigned_to: string;   // Changed from optional to required
    due_date: string;      // Changed from optional to required
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
  Relationships: [
    {
      foreignKeyName: "services_area_id_fkey";
      columns: ["area_id"];
      isOneToOne: false;
      referencedRelation: "service_areas";
      referencedColumns: ["id"];
    }
  ];
}

export interface ServiceReports {
  Row: {
    id: string;
    report_date: string;
    area_id: string;
    average_completion_time: number;
    created_by: string;
    created_at: string;
    updated_at: string;
    completed_tasks: number;
    pending_tasks: number;
    delayed_tasks: number;
    completion_rate: number;
  };
  Insert: {
    id?: string;
    report_date: string;
    area_id?: string | null;
    average_completion_time: number;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    completed_tasks?: number | null;
    pending_tasks?: number | null;
    delayed_tasks?: number | null;
    completion_rate?: number | null;
  };
  Update: {
    id?: string;
    report_date?: string;
    area_id?: string | null;
    average_completion_time?: number;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    completed_tasks?: number | null;
    pending_tasks?: number | null;
    delayed_tasks?: number | null;
    completion_rate?: number | null;
  };
  Relationships: [
    {
      foreignKeyName: "service_reports_area_id_fkey";
      columns: ["area_id"];
      isOneToOne: false;
      referencedRelation: "service_areas";
      referencedColumns: ["id"];
    }
  ];
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
  Relationships: [
    {
      foreignKeyName: "user_permission_groups_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "user_permission_groups_group_id_fkey";
      columns: ["group_id"];
      isOneToOne: false;
      referencedRelation: "permission_groups";
      referencedColumns: ["id"];
    }
  ];
}

// Import the Database type from types.ts but don't re-export it
import type { Database as OriginalDatabase } from './types';

// Use declaration merging to extend the Database interface
declare global {
  // This will merge with any existing Database interface in global scope
  // We're NOT creating a new interface, just extending the existing one
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

// Export the Database type from types.ts as DatabaseTypes to avoid name conflicts
export type { Database } from './types';

