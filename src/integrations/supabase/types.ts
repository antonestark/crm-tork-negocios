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
          category: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          category?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          category?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string | null
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
      agente_tork: {
        Row: {
          created_at: string | null
          data: Json | null
          departamento: string
          numero: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          departamento: string
          numero: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          departamento?: string
          numero?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      appointment_slots: {
        Row: {
          appointment_id: number | null
          created_at: string | null
          end_time: string
          id: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string | null
          end_time: string
          id?: never
          start_time: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: number | null
          created_at?: string | null
          end_time?: string
          id?: never
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_slots_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          email: string
          end_time: string
          id: number
          name: string
          observations: string | null
          phone: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          email: string
          end_time: string
          id?: number
          name: string
          observations?: string | null
          phone: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          email?: string
          end_time?: string
          id?: number
          name?: string
          observations?: string | null
          phone?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments_2: {
        Row: {
          created_at: string | null
          email: string
          end_time: string
          id: number
          name: string
          observations: string | null
          phone: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          end_time: string
          id?: number
          name: string
          observations?: string | null
          phone: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          end_time?: string
          id?: number
          name?: string
          observations?: string | null
          phone?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cliente: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          nome_pet: string
          porte_animal: string | null
          servico: string
          status: string | null
          telefone: string
          tipo_animal: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          nome_pet: string
          porte_animal?: string | null
          servico: string
          status?: string | null
          telefone: string
          tipo_animal: string
          valor: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          nome_pet?: string
          porte_animal?: string | null
          servico?: string
          status?: string | null
          telefone?: string
          tipo_animal?: string
          valor?: number
        }
        Relationships: []
      }
      clients: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string | null
          id: string
          last_login: string | null
          monthly_hours_limit: unknown | null
          name: string
          password_hash: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          monthly_hours_limit?: unknown | null
          name: string
          password_hash?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          monthly_hours_limit?: unknown | null
          name?: string
          password_hash?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      demands: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          requested_by: string | null
          status: string | null
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
          priority?: string | null
          requested_by?: string | null
          status?: string | null
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
          priority?: string | null
          requested_by?: string | null
          status?: string | null
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
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          lead_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          lead_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          lead_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_user_id_fkey"
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
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
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
      memoria_classificacao: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      mensagem_pet_shop: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_history: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      permission_group_permissions: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          permission_id: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          permission_id?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          permission_id?: string | null
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
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
        }
        Relationships: []
      }
      petshop_tork: {
        Row: {
          data_atualizacao: string | null
          data_cadastro: string | null
          email: string
          id: number
          nome: string
          nome_pet: string
          porte_animal: string | null
          servico: string
          status: string | null
          telefone: string
          tipo_animal: string
          valor: number
        }
        Insert: {
          data_atualizacao?: string | null
          data_cadastro?: string | null
          email: string
          id?: number
          nome: string
          nome_pet: string
          porte_animal?: string | null
          servico: string
          status?: string | null
          telefone: string
          tipo_animal: string
          valor: number
        }
        Update: {
          data_atualizacao?: string | null
          data_cadastro?: string | null
          email?: string
          id?: number
          nome?: string
          nome_pet?: string
          porte_animal?: string | null
          servico?: string
          status?: string | null
          telefone?: string
          tipo_animal?: string
          valor?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qualificacao: {
        Row: {
          created_at: string | null
          id_usuario: string
          nome_completo: string | null
          status: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id_usuario?: string
          nome_completo?: string | null
          status: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id_usuario?: string
          nome_completo?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduling: {
        Row: {
          client_id: string | null
          created_at: string | null
          end_time: string
          id: string
          start_time: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          start_time: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          start_time?: string
          status?: string
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
        ]
      }
      service_areas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          responsible_id: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          responsible_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          responsible_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
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
          checklist_item_id: string | null
          completed_at: string | null
          completed_by: string | null
          id: string
          notes: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          notes?: string | null
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
        ]
      }
      service_checklist_items: {
        Row: {
          active: boolean | null
          area_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          period: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          period: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          area_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          period?: string
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
          created_at: string | null
          created_by: string | null
          id: string
          report_date: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          average_completion_time?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          report_date?: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          average_completion_time?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          report_date?: string
          updated_at?: string | null
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
          area_id: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      tork_gestao: {
        Row: {
          created_at: string | null
          departamento: string | null
          email: string | null
          id: number
          nomecliente: string | null
          sessionid: string | null
          telefonecliente: string
          updated_at: string | null
          usuarioid: string | null
        }
        Insert: {
          created_at?: string | null
          departamento?: string | null
          email?: string | null
          id?: number
          nomecliente?: string | null
          sessionid?: string | null
          telefonecliente: string
          updated_at?: string | null
          usuarioid?: string | null
        }
        Update: {
          created_at?: string | null
          departamento?: string | null
          email?: string | null
          id?: number
          nomecliente?: string | null
          sessionid?: string | null
          telefonecliente?: string
          updated_at?: string | null
          usuarioid?: string | null
        }
        Relationships: []
      }
      user_permission_groups: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
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
          created_at: string | null
          granted_by: string | null
          id: string
          permission_id: string | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string | null
          user_id?: string | null
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
          created_at: string
          department_id: number | null
          email: string
          id: string
          name: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: number | null
          email: string
          id?: string
          name: string
          password: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: number | null
          email?: string
          id?: string
          name?: string
          password?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      is_admin_or_super_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      log_activity: {
        Args: {
          _entity_type: string
          _entity_id: string
          _action: string
          _details?: Json
          _severity?: string
          _category?: string
        }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
      user_role: "user" | "admin" | "super_admin"
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
