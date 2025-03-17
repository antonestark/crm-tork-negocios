
import { Database } from './types';

// This file augments the Database interface from the original types.ts file
// without modifying the read-only file directly

declare module './types' {
  export interface Database {
    public: {
      Tables: {
        activity_logs: {
          Row: {
            created_at?: string;
            entity_id?: string;
            entity_type: string;
            action: string;
            id: string;
            user_id?: string;
            details?: any;
          };
          Insert: {
            created_at?: string;
            entity_id?: string;
            entity_type: string;
            action: string;
            id?: string;
            user_id?: string;
            details?: any;
          };
          Update: {
            created_at?: string;
            entity_id?: string;
            entity_type?: string;
            action?: string;
            id?: string;
            user_id?: string;
            details?: any;
          };
        };
        checklist_completions: {
          Row: {
            checklist_item_id: string;
            id: string;
            created_at?: string;
            completed_at: string;
            completed_by?: string;
          };
          Insert: {
            checklist_item_id: string;
            id?: string;
            created_at?: string;
            completed_at: string;
            completed_by?: string;
          };
          Update: {
            checklist_item_id?: string;
            id?: string;
            created_at?: string;
            completed_at?: string;
            completed_by?: string;
          };
        };
        checklist_items: {
          Row: {
            active?: boolean;
            area_id?: string;
            period?: string;
            description?: string;
            name: string;
            id: string;
            updated_at?: string;
            created_at?: string;
          };
          Insert: {
            active?: boolean;
            area_id?: string;
            period?: string;
            description?: string;
            name: string;
            id?: string;
            updated_at?: string;
            created_at?: string;
          };
          Update: {
            active?: boolean;
            area_id?: string;
            period?: string;
            description?: string;
            name?: string;
            id?: string;
            updated_at?: string;
            created_at?: string;
          };
        };
        clients: {
          Row: {
            monthly_value?: number;
            contract_end_date?: string;
            id: string;
            meeting_room_credits?: number;
            contract_start_date?: string;
            notes?: string;
            phone?: string;
            email?: string;
            address?: string;
            cnpj?: string;
            status?: string;
            room?: string;
            responsible?: string;
            trading_name?: string;
            company_name: string;
            updated_at?: string;
            created_at?: string;
            auth_id?: string;
          };
          Insert: {
            monthly_value?: number;
            contract_end_date?: string;
            id?: string;
            meeting_room_credits?: number;
            contract_start_date?: string;
            notes?: string;
            phone?: string;
            email?: string;
            address?: string;
            cnpj?: string;
            status?: string;
            room?: string;
            responsible?: string;
            trading_name?: string;
            company_name: string;
            updated_at?: string;
            created_at?: string;
            auth_id?: string;
          };
          Update: {
            monthly_value?: number;
            contract_end_date?: string;
            id?: string;
            meeting_room_credits?: number;
            contract_start_date?: string;
            notes?: string;
            phone?: string;
            email?: string;
            address?: string;
            cnpj?: string;
            status?: string;
            room?: string;
            responsible?: string;
            trading_name?: string;
            company_name?: string;
            updated_at?: string;
            created_at?: string;
            auth_id?: string;
          };
        };
        demands: {
          Row: {
            priority?: string;
            status?: string;
            id: string;
            area_id?: string;
            title: string;
            description?: string;
            updated_at?: string;
            created_at?: string;
            due_date?: string;
            requested_by?: string;
            assigned_to?: string;
          };
          Insert: {
            priority?: string;
            status?: string;
            id?: string;
            area_id?: string;
            title: string;
            description?: string;
            updated_at?: string;
            created_at?: string;
            due_date?: string;
            requested_by?: string;
            assigned_to?: string;
          };
          Update: {
            priority?: string;
            status?: string;
            id?: string;
            area_id?: string;
            title?: string;
            description?: string;
            updated_at?: string;
            created_at?: string;
            due_date?: string;
            requested_by?: string;
            assigned_to?: string;
          };
        };
        department_permissions: {
          Row: {
            permission_id: string;
            id: string;
            department_id: number;
            created_at?: string;
          };
          Insert: {
            permission_id: string;
            id?: string;
            department_id: number;
            created_at?: string;
          };
          Update: {
            permission_id?: string;
            id?: string;
            department_id?: number;
            created_at?: string;
          };
        };
        departments: {
          Row: {
            created_at?: string;
            updated_at?: string;
            name: string;
            parent_id?: number;
            id: number;
            description?: string;
          };
          Insert: {
            created_at?: string;
            updated_at?: string;
            name: string;
            parent_id?: number;
            id?: number;
            description?: string;
          };
          Update: {
            created_at?: string;
            updated_at?: string;
            name?: string;
            parent_id?: number;
            id?: number;
            description?: string;
          };
        };
        lead_activities: {
          Row: {
            updated_at?: string;
            id: string;
            lead_id: string;
            details?: any;
            created_at?: string;
            action: string;
          };
          Insert: {
            updated_at?: string;
            id?: string;
            lead_id: string;
            details?: any;
            created_at?: string;
            action: string;
          };
          Update: {
            updated_at?: string;
            id?: string;
            lead_id?: string;
            details?: any;
            created_at?: string;
            action?: string;
          };
        };
        leads: {
          Row: {
            id: string;
            updated_at?: string;
            notes?: string;
            status: string;
            source?: string;
            company?: string;
            created_at?: string;
            assigned_to?: string;
            phone?: string;
            email?: string;
            name: string;
          };
          Insert: {
            id?: string;
            updated_at?: string;
            notes?: string;
            status: string;
            source?: string;
            company?: string;
            created_at?: string;
            assigned_to?: string;
            phone?: string;
            email?: string;
            name: string;
          };
          Update: {
            id?: string;
            updated_at?: string;
            notes?: string;
            status?: string;
            source?: string;
            company?: string;
            created_at?: string;
            assigned_to?: string;
            phone?: string;
            email?: string;
            name?: string;
          };
        };
        maintenance_records: {
          Row: {
            area_id?: string;
            id: string;
            status?: string;
            description?: string;
            assigned_to?: string;
            scheduled_date: string;
            completed_date?: string;
            created_at?: string;
            updated_at?: string;
            title: string;
          };
          Insert: {
            area_id?: string;
            id?: string;
            status?: string;
            description?: string;
            assigned_to?: string;
            scheduled_date: string;
            completed_date?: string;
            created_at?: string;
            updated_at?: string;
            title: string;
          };
          Update: {
            area_id?: string;
            id?: string;
            status?: string;
            description?: string;
            assigned_to?: string;
            scheduled_date?: string;
            completed_date?: string;
            created_at?: string;
            updated_at?: string;
            title?: string;
          };
        };
        permission_groups: {
          Row: {
            id: string;
            updated_at?: string;
            created_at?: string;
            name: string;
            description?: string;
          };
          Insert: {
            id?: string;
            updated_at?: string;
            created_at?: string;
            name: string;
            description?: string;
          };
          Update: {
            id?: string;
            updated_at?: string;
            created_at?: string;
            name?: string;
            description?: string;
          };
        };
        permissions: {
          Row: {
            name: string;
            code: string;
            updated_at?: string;
            created_at?: string;
            id: string;
            description?: string;
            module: string;
            resource_type: string;
            actions: string[];
          };
          Insert: {
            name: string;
            code: string;
            updated_at?: string;
            created_at?: string;
            id?: string;
            description?: string;
            module: string;
            resource_type: string;
            actions: string[];
          };
          Update: {
            name?: string;
            code?: string;
            updated_at?: string;
            created_at?: string;
            id?: string;
            description?: string;
            module?: string;
            resource_type?: string;
            actions?: string[];
          };
        };
        scheduling: {
          Row: {
            id: string;
            status?: string;
            title: string;
            end_time: string;
            updated_at?: string;
            start_time: string;
            description?: string;
            location?: string;
            customer_id?: string;
            email?: string;
            client_id?: string;
            user_id?: string;
            phone?: string;
            created_at?: string;
          };
          Insert: {
            id?: string;
            status?: string;
            title: string;
            end_time: string;
            updated_at?: string;
            start_time: string;
            description?: string;
            location?: string;
            customer_id?: string;
            email?: string;
            client_id?: string;
            user_id?: string;
            phone?: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            status?: string;
            title?: string;
            end_time?: string;
            updated_at?: string;
            start_time?: string;
            description?: string;
            location?: string;
            customer_id?: string;
            email?: string;
            client_id?: string;
            user_id?: string;
            phone?: string;
            created_at?: string;
          };
        };
        service_areas: {
          Row: {
            status?: string;
            updated_at?: string;
            created_at?: string;
            responsible_id?: string;
            id: string;
            name: string;
            description?: string;
            type?: string;
          };
          Insert: {
            status?: string;
            updated_at?: string;
            created_at?: string;
            responsible_id?: string;
            id?: string;
            name: string;
            description?: string;
            type?: string;
          };
          Update: {
            status?: string;
            updated_at?: string;
            created_at?: string;
            responsible_id?: string;
            id?: string;
            name?: string;
            description?: string;
            type?: string;
          };
        };
        // Add missing tables
        services: {
          Row: {
            id: string;
            title: string;
            description?: string;
            status?: string;
            area_id?: string;
            created_at?: string;
            updated_at?: string;
            assigned_to?: string;
            due_date?: string;
          };
          Insert: {
            id?: string;
            title: string;
            description?: string;
            status?: string;
            area_id?: string;
            created_at?: string;
            updated_at?: string;
            assigned_to?: string;
            due_date?: string;
          };
          Update: {
            id?: string;
            title?: string;
            description?: string;
            status?: string;
            area_id?: string;
            created_at?: string;
            updated_at?: string;
            assigned_to?: string;
            due_date?: string;
          };
        };
        service_reports: {
          Row: {
            id: string;
            report_date: string;
            area_id?: string;
            average_completion_time: number;
            created_by?: string;
            created_at?: string;
            updated_at?: string;
          };
          Insert: {
            id?: string;
            report_date: string;
            area_id?: string;
            average_completion_time: number;
            created_by?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            report_date?: string;
            area_id?: string;
            average_completion_time?: number;
            created_by?: string;
            created_at?: string;
            updated_at?: string;
          };
        };
        user_groups: {
          Row: {
            id: string;
            created_at?: string;
            group_id: string;
            user_id: string;
          };
          Insert: {
            id?: string;
            created_at?: string;
            group_id: string;
            user_id: string;
          };
          Update: {
            id?: string;
            created_at?: string;
            group_id?: string;
            user_id?: string;
          };
        };
        user_permissions: {
          Row: {
            permission_id: string;
            id: string;
            created_at?: string;
            user_id: string;
          };
          Insert: {
            permission_id: string;
            id?: string;
            created_at?: string;
            user_id: string;
          };
          Update: {
            permission_id?: string;
            id?: string;
            created_at?: string;
            user_id?: string;
          };
        };
        users: {
          Row: {
            phone?: string;
            role?: string;
            created_at?: string;
            id: string;
            department_id?: number;
            status?: string;
            email: string;
            updated_at?: string;
            name?: string;
          };
          Insert: {
            phone?: string;
            role?: string;
            created_at?: string;
            id?: string;
            department_id?: number;
            status?: string;
            email: string;
            updated_at?: string;
            name?: string;
          };
          Update: {
            phone?: string;
            role?: string;
            created_at?: string;
            id?: string;
            department_id?: number;
            status?: string;
            email?: string;
            updated_at?: string;
            name?: string;
          };
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        user_has_permission: {
          Args: {
            permission_code: string;
          };
          Returns: boolean;
        };
      };
      Enums: {
        [_ in never]: never;
      };
      CompositeTypes: {
        [_ in never]: never;
      };
    };
  }
}
