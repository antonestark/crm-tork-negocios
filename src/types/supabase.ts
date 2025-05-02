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
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_activity_logs_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      area_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_area_types_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string | null
          id: number
          message_type: string | null
          phone: string | null
          tenant_id: string
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          tenant_id: string
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          tenant_id?: string
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_chat_messages_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string | null
          id: number
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_chats_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_completions: {
        Row: {
          checklist_item_id: string
          completed_at: string
          completed_by: string | null
          created_at: string | null
          id: string
          tenant_id: string
        }
        Insert: {
          checklist_item_id: string
          completed_at: string
          completed_by?: string | null
          created_at?: string | null
          id?: string
          tenant_id: string
        }
        Update: {
          checklist_item_id?: string
          completed_at?: string
          completed_by?: string | null
          created_at?: string | null
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_completions_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_completions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_item_status: {
        Row: {
          checklist_item_id: string | null
          created_at: string | null
          id: string
          status: string
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          created_at?: string | null
          id?: string
          status: string
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_status_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_item_status_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          active: boolean | null
          area_id: string | null
          created_at: string | null
          department_id: number | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          period: string | null
          responsible: string | null
          responsible_id: string | null
          start_date: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string | null
          department_id?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          period?: string | null
          responsible?: string | null
          responsible_id?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string | null
          department_id?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          period?: string | null
          responsible?: string | null
          responsible_id?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          auth_id: string | null
          birth_date: string | null
          cnpj: string | null
          company_name: string
          contact_name: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          meeting_room_credits: number | null
          monthly_value: number | null
          notes: string | null
          organization_id: string | null
          phone: string | null
          razao_social: string | null
          responsible: string | null
          room: string | null
          status: string | null
          tags: string[] | null
          tenant_id: string
          trading_name: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auth_id?: string | null
          birth_date?: string | null
          cnpj?: string | null
          company_name: string
          contact_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          meeting_room_credits?: number | null
          monthly_value?: number | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          razao_social?: string | null
          responsible?: string | null
          room?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id: string
          trading_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auth_id?: string | null
          birth_date?: string | null
          cnpj?: string | null
          company_name?: string
          contact_name?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          meeting_room_credits?: number | null
          monthly_value?: number | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          razao_social?: string | null
          responsible?: string | null
          room?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string
          trading_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      dados_cliente: {
        Row: {
          created_at: string | null
          id: number
          sessionid: string | null
          telefone: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          sessionid?: string | null
          telefone?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          sessionid?: string | null
          telefone?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dados_cliente_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      demands: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          created_at: string | null
          department_id: number | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          requested_by: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          requested_by?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          requested_by?: string | null
          status?: string | null
          tenant_id?: string
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
            foreignKeyName: "demands_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demands_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      department_permissions: {
        Row: {
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          department_id: number
          id: string
          page_code: string | null
          permission_id: string | null
          tenant_id: string
        }
        Insert: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          department_id: number
          id?: string
          page_code?: string | null
          permission_id?: string | null
          tenant_id: string
        }
        Update: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          department_id?: number
          id?: string
          page_code?: string | null
          permission_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_permissions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permission"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "department_permission_view"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "fk_permission"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "system_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      department_user_permissions: {
        Row: {
          created_at: string | null
          department_id: number
          id: string
          permission_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department_id: number
          id?: string
          permission_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          department_id?: number
          id?: string
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_user_permissions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      department_users: {
        Row: {
          created_at: string | null
          department_id: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department_id: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          department_id?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_effective_permissions"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "department_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_with_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_users_user_id_fkey"
            columns: ["user_id"]
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
          id: number
          name: string
          organization_id: string | null
          parent_id: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          organization_id?: string | null
          parent_id?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          organization_id?: string | null
          parent_id?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      group_permissions: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          permission_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          permission_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          permission_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_permissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_permissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          lead_id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          lead_id: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          lead_id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_activities_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          department_id: number | null
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          phone: string | null
          sessionid: string | null
          source: string | null
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          department_id?: number | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          sessionid?: string | null
          source?: string | null
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          department_id?: number | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          sessionid?: string | null
          source?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          frequency: string | null
          id: string
          scheduled_date: string
          status: string | null
          tenant_id: string
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          scheduled_date: string
          status?: string | null
          tenant_id: string
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          scheduled_date?: string
          status?: string | null
          tenant_id?: string
          title?: string
          type?: string | null
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
            foreignKeyName: "maintenance_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
          tenant_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
          tenant_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_n8n_chat_histories_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permission_groups_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          actions: string[]
          code: string
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
          resource_type: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          actions: string[]
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
          resource_type: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          actions?: string[]
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
          resource_type?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling: {
        Row: {
          client_id: string | null
          company_id: string | null
          created_at: string | null
          customer_id: string | null
          department_id: number | null
          description: string | null
          email: string | null
          end_time: string
          externo: boolean | null
          id: string
          location: string | null
          phone: string | null
          start_time: string
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          department_id?: number | null
          description?: string | null
          email?: string | null
          end_time: string
          externo?: boolean | null
          id?: string
          location?: string | null
          phone?: string | null
          start_time: string
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          department_id?: number | null
          description?: string | null
          email?: string | null
          end_time?: string
          externo?: boolean | null
          id?: string
          location?: string | null
          phone?: string | null
          start_time?: string
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "scheduling_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_settings: {
        Row: {
          created_at: string | null
          id: number
          max_advance_booking_days: number
          min_advance_booking_hours: number
          slot_duration_minutes: number
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          max_advance_booking_days?: number
          min_advance_booking_hours?: number
          slot_duration_minutes?: number
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          max_advance_booking_days?: number
          min_advance_booking_hours?: number
          slot_duration_minutes?: number
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_areas: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          responsible_id: string | null
          status: string | null
          tenant_id: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          status?: string | null
          tenant_id: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          status?: string | null
          tenant_id?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reports: {
        Row: {
          area_id: string | null
          average_completion_time: number | null
          completed_tasks: number | null
          completion_rate: number | null
          created_at: string | null
          created_by: string | null
          delayed_tasks: number | null
          id: string
          pending_tasks: number | null
          report_date: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          average_completion_time?: number | null
          completed_tasks?: number | null
          completion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          delayed_tasks?: number | null
          id?: string
          pending_tasks?: number | null
          report_date?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          average_completion_time?: number | null
          completed_tasks?: number | null
          completion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          delayed_tasks?: number | null
          id?: string
          pending_tasks?: number | null
          report_date?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_reports_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reports_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      system_permissions: {
        Row: {
          action: string
          code: string
          description: string | null
          id: string
          resource: string
          tenant_id: string
          title: string
        }
        Insert: {
          action: string
          code: string
          description?: string | null
          id?: string
          resource: string
          tenant_id: string
          title: string
        }
        Update: {
          action?: string
          code?: string
          description?: string | null
          id?: string
          resource?: string
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_system_permissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          asaas_status: string | null
          asaas_token: string | null
          connection_limit: number | null
          created_at: string
          customer_id: string | null
          disable_unofficial: boolean | null
          id: string
          identity: string | null
          name: string
          schema_name: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_secure: boolean | null
          smtp_user: string | null
          status: string | null
          tier: string | null
          trial_days: number | null
          updated_at: string
          user_limit: number | null
        }
        Insert: {
          asaas_status?: string | null
          asaas_token?: string | null
          connection_limit?: number | null
          created_at?: string
          customer_id?: string | null
          disable_unofficial?: boolean | null
          id?: string
          identity?: string | null
          name: string
          schema_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          status?: string | null
          tier?: string | null
          trial_days?: number | null
          updated_at?: string
          user_limit?: number | null
        }
        Update: {
          asaas_status?: string | null
          asaas_token?: string | null
          connection_limit?: number | null
          created_at?: string
          customer_id?: string | null
          disable_unofficial?: boolean | null
          id?: string
          identity?: string | null
          name?: string
          schema_name?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          status?: string | null
          tier?: string | null
          trial_days?: number | null
          updated_at?: string
          user_limit?: number | null
        }
        Relationships: []
      }
      user_groups: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_groups_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "permission_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_permissions_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean | null
          created_at: string | null
          department_id: number | null
          email: string
          id: string
          is_admin: boolean | null
          last_login: string | null
          name: string | null
          phone: string | null
          profile_image_url: string | null
          role: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          department_id?: number | null
          email: string
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          department_id?: number | null
          email?: string
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          client_id: string
          created_at: string | null
          document: string | null
          id: string
          name: string
          notes: string | null
          tenant_id: string
          visit_time: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          document?: string | null
          id?: string
          name: string
          notes?: string | null
          tenant_id: string
          visit_time: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          document?: string | null
          id?: string
          name?: string
          notes?: string | null
          tenant_id?: string
          visit_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitors_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: number
          is_available: boolean
          start_time: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: number
          is_available?: boolean
          start_time: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: number
          is_available?: boolean
          start_time?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_availability_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      department_permission_view: {
        Row: {
          action: string | null
          assigned: boolean | null
          code: string | null
          department_id: number | null
          description: string | null
          permission_id: string | null
          resource: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_permissions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_effective_permissions: {
        Row: {
          permission_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_list: {
        Row: {
          department_id: number | null
          email: string | null
          id: string | null
          name: string | null
          role: string | null
        }
        Insert: {
          department_id?: number | null
          email?: string | null
          id?: string | null
          name?: string | null
          role?: string | null
        }
        Update: {
          department_id?: number | null
          email?: string | null
          id?: string | null
          name?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_with_logs: {
        Row: {
          active: boolean | null
          activity_logs: Json | null
          created_at: string | null
          department_id: number | null
          email: string | null
          id: string | null
          is_admin: boolean | null
          last_login: string | null
          name: string | null
          phone: string | null
          profile_image_url: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      count_services_by_area: {
        Args: Record<PropertyKey, never>
        Returns: {
          area_id: string
          total: number
          pending: number
        }[]
      }
      create_tenant_as_admin: {
        Args: { tenant_data: Json }
        Returns: {
          asaas_status: string | null
          asaas_token: string | null
          connection_limit: number | null
          created_at: string
          customer_id: string | null
          disable_unofficial: boolean | null
          id: string
          identity: string | null
          name: string
          schema_name: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_secure: boolean | null
          smtp_user: string | null
          status: string | null
          tier: string | null
          trial_days: number | null
          updated_at: string
          user_limit: number | null
        }[]
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      get_my_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_recent_services: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          status: string
          area_id: string
          area_name: string
          updated_at: string
        }[]
      }
      get_service_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          completed: number
          pending: number
          delayed: number
          avg_completion_time: number
        }[]
      }
      get_service_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          completed: number
          pending: number
          delayed: number
          avg_completion_time: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
