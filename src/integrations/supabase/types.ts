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
      clients: {
        Row: {
          address: string | null
          cnpj: string | null
          company: string
          contract_date: string
          created_at: string | null
          credits: number
          email: string | null
          id: string
          monthly_value: number | null
          notes: string | null
          phone: string | null
          responsible: string
          room: string
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          company: string
          contract_date: string
          created_at?: string | null
          credits?: number
          email?: string | null
          id?: string
          monthly_value?: number | null
          notes?: string | null
          phone?: string | null
          responsible: string
          room: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          company?: string
          contract_date?: string
          created_at?: string | null
          credits?: number
          email?: string | null
          id?: string
          monthly_value?: number | null
          notes?: string | null
          phone?: string | null
          responsible?: string
          room?: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_usage: {
        Row: {
          client_id: string | null
          created_at: string | null
          date: string
          duration: number
          id: string
          participants: string | null
          purpose: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date: string
          duration: number
          id?: string
          participants?: string | null
          purpose?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          participants?: string | null
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          area_id: string | null
          created_at: string | null
          id: string
          last_maintenance_date: string | null
          next_maintenance_date: string | null
          notes: string | null
          responsible: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          responsible?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          responsible?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["maintenance_type"]
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
        ]
      }
      schedules: {
        Row: {
          client_id: string | null
          created_at: string | null
          duration: number
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: Database["public"]["Enums"]["schedule_status"]
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          duration: number
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["schedule_status"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          duration?: number
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["schedule_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_client_id_fkey"
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
          type: Database["public"]["Enums"]["area_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["area_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["area_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      service_demands: {
        Row: {
          area_id: string | null
          assigned_to: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          requester: string
          resolution_notes: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requester: string
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requester?: string
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_demands_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tasks: {
        Row: {
          area_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          period: Database["public"]["Enums"]["task_period"]
          responsible: string | null
          scheduled_time: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          period: Database["public"]["Enums"]["task_period"]
          responsible?: string | null
          scheduled_time: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          area_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          period?: Database["public"]["Enums"]["task_period"]
          responsible?: string | null
          scheduled_time?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_tasks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      area_type: "common" | "bathroom" | "private" | "external" | "ac"
      client_status: "active" | "inactive"
      maintenance_type: "preventive" | "corrective" | "scheduled"
      schedule_status: "available" | "booked" | "cleaning" | "unavailable"
      task_period: "morning" | "afternoon" | "evening"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "delayed"
        | "cancelled"
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
