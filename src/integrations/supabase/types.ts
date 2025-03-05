export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          cnpj: string | null
          company_name: string
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          email: string | null
          id: string
          meeting_room_credits: number | null
          phone: string | null
          status: string | null
          trading_name: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          company_name: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          meeting_room_credits?: number | null
          phone?: string | null
          status?: string | null
          trading_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          company_name?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          meeting_room_credits?: number | null
          phone?: string | null
          status?: string | null
          trading_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_history: {
        Row: {
          balance_after: number
          client_id: string
          created_at: string | null
          created_by: string | null
          credit_amount: number
          description: string | null
          id: string
          scheduling_id: string | null
        }
        Insert: {
          balance_after: number
          client_id: string
          created_at?: string | null
          created_by?: string | null
          credit_amount: number
          description?: string | null
          id?: string
          scheduling_id?: string | null
        }
        Update: {
          balance_after?: number
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          credit_amount?: number
          description?: string | null
          id?: string
          scheduling_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_history_scheduling_id_fkey"
            columns: ["scheduling_id"]
            isOneToOne: false
            referencedRelation: "scheduling"
            referencedColumns: ["id"]
          },
        ]
      }
      demands: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          client_id: string | null
          completion_notes: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_time: number | null
          id: string
          images: string[] | null
          priority: string
          requested_by: string | null
          resolution_comments: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completion_notes?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_time?: number | null
          id?: string
          images?: string[] | null
          priority: string
          requested_by?: string | null
          resolution_comments?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          completion_notes?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_time?: number | null
          id?: string
          images?: string[] | null
          priority?: string
          requested_by?: string | null
          resolution_comments?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demands_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_interactions: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          interaction_type: string
          lead_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          interaction_type: string
          lead_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          interaction_type?: string
          lead_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          email: string | null
          expected_close_date: string | null
          expected_value: number | null
          id: string
          interest: string | null
          notes: string | null
          phone: string | null
          source: string | null
          stage: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          expected_close_date?: string | null
          expected_value?: number | null
          id?: string
          interest?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          expected_close_date?: string | null
          expected_value?: number | null
          id?: string
          interest?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_executions: {
        Row: {
          created_at: string | null
          executed_by: string | null
          execution_date: string
          id: string
          images: string[] | null
          maintenance_id: string | null
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          executed_by?: string | null
          execution_date: string
          id?: string
          images?: string[] | null
          maintenance_id?: string | null
          notes?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          executed_by?: string | null
          execution_date?: string
          id?: string
          images?: string[] | null
          maintenance_id?: string | null
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_executions_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_executions_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance_records"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_maintenance: string | null
          next_maintenance: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_rooms: {
        Row: {
          capacity: number
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_group_permissions: {
        Row: {
          created_at: string
          group_id: string
          id: string
          permission_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          permission_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_group_permissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_group_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          actions: Json
          code: string
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
          resource_type: string
        }
        Insert: {
          actions?: Json
          code: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
          resource_type: string
        }
        Update: {
          actions?: Json
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
          resource_type?: string
        }
        Relationships: []
      }
      scheduling: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          room_id: string
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          room_id: string
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          room_id?: string
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "meeting_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      service_areas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          responsible_id: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          status?: string
          type?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_checklist_completed: {
        Row: {
          checklist_item_id: string
          comments: string | null
          completed_at: string | null
          completed_by: string | null
          id: string
          image_url: string | null
          service_id: string
          status: string
        }
        Insert: {
          checklist_item_id: string
          comments?: string | null
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          image_url?: string | null
          service_id: string
          status: string
        }
        Update: {
          checklist_item_id?: string
          comments?: string | null
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          image_url?: string | null
          service_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_checklist_completed_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "service_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_checklist_completed_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_checklist_completed_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_checklist_items: {
        Row: {
          active: boolean | null
          area_id: string
          created_at: string | null
          custom_days: number | null
          description: string | null
          expected_time: string | null
          frequency: string | null
          id: string
          name: string
          period: string
          priority: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          area_id: string
          created_at?: string | null
          custom_days?: number | null
          description?: string | null
          expected_time?: string | null
          frequency?: string | null
          id?: string
          name: string
          period?: string
          priority?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          area_id?: string
          created_at?: string | null
          custom_days?: number | null
          description?: string | null
          expected_time?: string | null
          frequency?: string | null
          id?: string
          name?: string
          period?: string
          priority?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_checklist_items_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reports: {
        Row: {
          area_id: string | null
          average_completion_time: number | null
          completed_tasks: number | null
          created_at: string | null
          created_by: string | null
          delayed_tasks: number | null
          id: string
          notes: string | null
          pending_tasks: number | null
          report_date: string
        }
        Insert: {
          area_id?: string | null
          average_completion_time?: number | null
          completed_tasks?: number | null
          created_at?: string | null
          created_by?: string | null
          delayed_tasks?: number | null
          id?: string
          notes?: string | null
          pending_tasks?: number | null
          report_date: string
        }
        Update: {
          area_id?: string | null
          average_completion_time?: number | null
          completed_tasks?: number | null
          created_at?: string | null
          created_by?: string | null
          delayed_tasks?: number | null
          id?: string
          notes?: string | null
          pending_tasks?: number | null
          report_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reports_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          area_id: string
          completed_by: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          id: string
          scheduled_date: string | null
          service_type: string
          status: string
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          area_id: string
          completed_by?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          scheduled_date?: string | null
          service_type: string
          status: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          area_id?: string
          completed_by?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          scheduled_date?: string | null
          service_type?: string
          status?: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_group: string | null
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_group?: string | null
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_group?: string | null
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_permission_groups: {
        Row: {
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permission_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permission_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          permission_id: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission_id: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission_id?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean | null
          created_at: string | null
          department_id: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          department_id?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          department_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: {
          _user_id: string
          _permission_code: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          _entity_type: string
          _entity_id: string
          _action: string
          _details?: Json
          _user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      area_type: "common" | "bathroom" | "private" | "external" | "ac"
      booking_status: "confirmed" | "canceled" | "completed"
      client_status: "active" | "inactive"
      lead_status: "qualified" | "disqualified" | "no_response"
      maintenance_type: "preventive" | "corrective" | "scheduled"
      room_status: "occupied" | "free"
      room_type: "private" | "meeting"
      schedule_status: "available" | "booked" | "cleaning" | "unavailable"
      service_area: "common" | "private" | "bathroom" | "external" | "ac_filter"
      service_status: "pending" | "in_progress" | "completed" | "delayed"
      task_period: "morning" | "afternoon" | "evening"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "delayed"
        | "cancelled"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
