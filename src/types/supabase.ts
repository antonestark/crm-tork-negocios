[?25l
    Select a project:                                                                                                       
                                                                                                                            
  >  1. mohusfxmikznwntjwnzj [name: torkgestaoderesultado@gmail.com's Project, org: wuyhvndacbogcyfvfwox, region: sa-east-1]
    2. msgjsjauuhzdxwajbphj [name: CRM TORK NEGOCIOS, org: zuqpsmrpsrnsvemljxco, region: sa-east-1]                         
                                                                                                                            
                                                                                                                            
    Ôåæ/k up ÔÇó Ôåô/j down ÔÇó / filter ÔÇó q quit ÔÇó ? more                                                                          
                                                                                                                            [0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K [0D[2K[?25h[?1002l[?1003l[?1006lexport type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adp98v2kay8vqxd9_chat_history: {
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
      agendamentos: {
        Row: {
          created_at: string
          data_hora: string
          id: string
          observacoes: string | null
          pet_id: string
          servico_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_hora: string
          id?: string
          observacoes?: string | null
          pet_id: string
          servico_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_hora?: string
          id?: string
          observacoes?: string | null
          pet_id?: string
          servico_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos_petshop: {
        Row: {
          data_cadastro: string | null
          data_hora: string
          id: number
          observacoes: string | null
          pet_id: number | null
          status: Database["public"]["Enums"]["status_agendamento"] | null
          telefone: string | null
          tipo_servico: Database["public"]["Enums"]["tipo_servico"]
          ultima_atualizacao: string | null
          usuario_id: number | null
          valor: number | null
        }
        Insert: {
          data_cadastro?: string | null
          data_hora: string
          id?: number
          observacoes?: string | null
          pet_id?: number | null
          status?: Database["public"]["Enums"]["status_agendamento"] | null
          telefone?: string | null
          tipo_servico: Database["public"]["Enums"]["tipo_servico"]
          ultima_atualizacao?: string | null
          usuario_id?: number | null
          valor?: number | null
        }
        Update: {
          data_cadastro?: string | null
          data_hora?: string
          id?: number
          observacoes?: string | null
          pet_id?: number | null
          status?: Database["public"]["Enums"]["status_agendamento"] | null
          telefone?: string | null
          tipo_servico?: Database["public"]["Enums"]["tipo_servico"]
          ultima_atualizacao?: string | null
          usuario_id?: number | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_petshop_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets_petshop"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_petshop_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_petshop"
            referencedColumns: ["id"]
          },
        ]
      }
      agente_tork: {
        Row: {
          clienteData: Json
          clienteDepartamento: string | null
          clienteNome: string | null
          clienteNumero: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          clienteData: Json
          clienteDepartamento?: string | null
          clienteNome?: string | null
          clienteNumero: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          clienteData?: Json
          clienteDepartamento?: string | null
          clienteNome?: string | null
          clienteNumero?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      CAMPANHA_FACEBOOK_ADS: {
        Row: {
          alcance: number | null
          campanha: string | null
          cliques: number | null
          cpm: number | null
          data: string | null
          data_de_registro: string | null
          frequencia: number | null
          gasto: number | null
          id: number
          impressoes: number | null
        }
        Insert: {
          alcance?: number | null
          campanha?: string | null
          cliques?: number | null
          cpm?: number | null
          data?: string | null
          data_de_registro?: string | null
          frequencia?: number | null
          gasto?: number | null
          id: number
          impressoes?: number | null
        }
        Update: {
          alcance?: number | null
          campanha?: string | null
          cliques?: number | null
          cpm?: number | null
          data?: string | null
          data_de_registro?: string | null
          frequencia?: number | null
          gasto?: number | null
          id?: number
          impressoes?: number | null
        }
        Relationships: []
      }
      cardapio: {
        Row: {
          dataatualizacao: string | null
          id: number
          nomerestaurante: string | null
          urlcardapio: string
        }
        Insert: {
          dataatualizacao?: string | null
          id?: number
          nomerestaurante?: string | null
          urlcardapio: string
        }
        Update: {
          dataatualizacao?: string | null
          id?: number
          nomerestaurante?: string | null
          urlcardapio?: string
        }
        Relationships: []
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string | null
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes_delivery: {
        Row: {
          enderecocliente: string | null
          id: number
          idmensagem: string | null
          nomecliente: string | null
          sessionid: string | null
          telefonecliente: string | null
        }
        Insert: {
          enderecocliente?: string | null
          id?: number
          idmensagem?: string | null
          nomecliente?: string | null
          sessionid?: string | null
          telefonecliente?: string | null
        }
        Update: {
          enderecocliente?: string | null
          id?: number
          idmensagem?: string | null
          nomecliente?: string | null
          sessionid?: string | null
          telefonecliente?: string | null
        }
        Relationships: []
      }
      clientes_petparadise: {
        Row: {
          created_at: string | null
          data_agendamento: string | null
          email: string | null
          hora_agendamento: string | null
          id: number
          idade_pet: number | null
          nome_cliente: string | null
          nome_pet: string | null
          peso_pet: number | null
          porte_pet: string | null
          raca_pet: string | null
          servico_solicitado: string | null
          sessionid: string | null
          status: string | null
          telefone: string | null
          tipo_pet: string | null
        }
        Insert: {
          created_at?: string | null
          data_agendamento?: string | null
          email?: string | null
          hora_agendamento?: string | null
          id?: number
          idade_pet?: number | null
          nome_cliente?: string | null
          nome_pet?: string | null
          peso_pet?: number | null
          porte_pet?: string | null
          raca_pet?: string | null
          servico_solicitado?: string | null
          sessionid?: string | null
          status?: string | null
          telefone?: string | null
          tipo_pet?: string | null
        }
        Update: {
          created_at?: string | null
          data_agendamento?: string | null
          email?: string | null
          hora_agendamento?: string | null
          id?: number
          idade_pet?: number | null
          nome_cliente?: string | null
          nome_pet?: string | null
          peso_pet?: number | null
          porte_pet?: string | null
          raca_pet?: string | null
          servico_solicitado?: string | null
          sessionid?: string | null
          status?: string | null
          telefone?: string | null
          tipo_pet?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          clienteData: string | null
          clienteDepartamento: string | null
          clienteNome: string | null
          clienteNumero: string | null
          id: number
          sessionid: string | null
        }
        Insert: {
          clienteData?: string | null
          clienteDepartamento?: string | null
          clienteNome?: string | null
          clienteNumero?: string | null
          id?: number
          sessionid?: string | null
        }
        Update: {
          clienteData?: string | null
          clienteDepartamento?: string | null
          clienteNome?: string | null
          clienteNumero?: string | null
          id?: number
          sessionid?: string | null
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
      documents_petshop: {
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
      documents_suporte: {
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
      mensagem_project_adv: {
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
      mensagem_suporte_tork: {
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
      mensagens: {
        Row: {
          conteudo: string
          created_at: string
          de_id: string
          id: string
          lida: boolean
          para_id: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          de_id: string
          id?: string
          lida?: boolean
          para_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          de_id?: string
          id?: string
          lida?: boolean
          para_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_de_id_fkey"
            columns: ["de_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_para_id_fkey"
            columns: ["para_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_blocos_fluxo: {
        Row: {
          bloco: string | null
          criado_em: string | null
          descricao: string | null
          id: number
          importancia: string | null
          principais_nodes: string | null
        }
        Insert: {
          bloco?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: number
          importancia?: string | null
          principais_nodes?: string | null
        }
        Update: {
          bloco?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: number
          importancia?: string | null
          principais_nodes?: string | null
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
      n8n_vectors: {
        Row: {
          embedding: string | null
          id: string
          metadata: Json | null
          text: string | null
        }
        Insert: {
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text?: string | null
        }
        Update: {
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text?: string | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          created_at: string
          dono_id: string
          id: string
          idade: number
          nome: string
          observacoes: string | null
          peso: number
          raca: string
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dono_id: string
          id?: string
          idade: number
          nome: string
          observacoes?: string | null
          peso: number
          raca: string
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dono_id?: string
          id?: string
          idade?: number
          nome?: string
          observacoes?: string | null
          peso?: number
          raca?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_dono_id_fkey"
            columns: ["dono_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pets_petshop: {
        Row: {
          data_cadastro: string | null
          id: number
          nome_pet: string
          porte: string
          raca: string
          ultima_atualizacao: string | null
          usuario_id: number | null
        }
        Insert: {
          data_cadastro?: string | null
          id?: number
          nome_pet: string
          porte: string
          raca: string
          ultima_atualizacao?: string | null
          usuario_id?: number | null
        }
        Update: {
          data_cadastro?: string | null
          id?: number
          nome_pet?: string
          porte?: string
          raca?: string
          ultima_atualizacao?: string | null
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_petshop_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_petshop"
            referencedColumns: ["id"]
          },
        ]
      }
      petshop_chat_histories: {
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
      petshop_tork: {
        Row: {
          data_atualizacao: string | null
          data_cadastro: string | null
          data_hora: string | null
          email_responsavel: string | null
          id: number
          nome_pet: string | null
          nome_responsavel: string | null
          observacao: string | null
          porte_pet: string | null
          raca_pet: string | null
          status: string | null
          telefone_responsavel: string | null
          tipo_animal: string | null
          tipo_servico: string | null
          valor_servico: number | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_cadastro?: string | null
          data_hora?: string | null
          email_responsavel?: string | null
          id?: number
          nome_pet?: string | null
          nome_responsavel?: string | null
          observacao?: string | null
          porte_pet?: string | null
          raca_pet?: string | null
          status?: string | null
          telefone_responsavel?: string | null
          tipo_animal?: string | null
          tipo_servico?: string | null
          valor_servico?: number | null
        }
        Update: {
          data_atualizacao?: string | null
          data_cadastro?: string | null
          data_hora?: string | null
          email_responsavel?: string | null
          id?: number
          nome_pet?: string | null
          nome_responsavel?: string | null
          observacao?: string | null
          porte_pet?: string | null
          raca_pet?: string | null
          status?: string | null
          telefone_responsavel?: string | null
          tipo_animal?: string | null
          tipo_servico?: string | null
          valor_servico?: number | null
        }
        Relationships: []
      }
      project_adv_busca_apreensao: {
        Row: {
          chassiveiculo: string | null
          corveiculo: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          datacumprimentomandado: string | null
          datamandado: string | null
          emailcliente: string | null
          id: number
          localizacaoveiculo: string | null
          modeloveiculo: string | null
          nomecliente: string | null
          numeroprocesso: string | null
          observacao: string | null
          pausado: boolean | null
          placaveiculo: string | null
          responsavelcumprimento: string | null
          resultadoapreensao: string | null
          statuscliente: string | null
          telefonecliente: string | null
          tipoacao: string | null
          updated_at: string | null
          varaprocesso: string | null
        }
        Insert: {
          chassiveiculo?: string | null
          corveiculo?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          datacumprimentomandado?: string | null
          datamandado?: string | null
          emailcliente?: string | null
          id?: number
          localizacaoveiculo?: string | null
          modeloveiculo?: string | null
          nomecliente?: string | null
          numeroprocesso?: string | null
          observacao?: string | null
          pausado?: boolean | null
          placaveiculo?: string | null
          responsavelcumprimento?: string | null
          resultadoapreensao?: string | null
          statuscliente?: string | null
          telefonecliente?: string | null
          tipoacao?: string | null
          updated_at?: string | null
          varaprocesso?: string | null
        }
        Update: {
          chassiveiculo?: string | null
          corveiculo?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          datacumprimentomandado?: string | null
          datamandado?: string | null
          emailcliente?: string | null
          id?: number
          localizacaoveiculo?: string | null
          modeloveiculo?: string | null
          nomecliente?: string | null
          numeroprocesso?: string | null
          observacao?: string | null
          pausado?: boolean | null
          placaveiculo?: string | null
          responsavelcumprimento?: string | null
          resultadoapreensao?: string | null
          statuscliente?: string | null
          telefonecliente?: string | null
          tipoacao?: string | null
          updated_at?: string | null
          varaprocesso?: string | null
        }
        Relationships: []
      }
      prompts_para_cliente: {
        Row: {
          criado_em: string | null
          id: string
          nome_do_agente_do_cliente: string | null
          nome_do_cliente: string
          prompt_do_cliente: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome_do_agente_do_cliente?: string | null
          nome_do_cliente: string
          prompt_do_cliente: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome_do_agente_do_cliente?: string | null
          nome_do_cliente?: string
          prompt_do_cliente?: string
        }
        Relationships: []
      }
      SIMULACAO_ANDREY: {
        Row: {
          competencia: string | null
          diferenca: number | null
          id: number
          media_retorno: number | null
          percentual_crescimento: number | null
          percentual_valor_parceiro: number | null
          retorno: number | null
          valor_parceiro: number | null
        }
        Insert: {
          competencia?: string | null
          diferenca?: number | null
          id?: number
          media_retorno?: number | null
          percentual_crescimento?: number | null
          percentual_valor_parceiro?: number | null
          retorno?: number | null
          valor_parceiro?: number | null
        }
        Update: {
          competencia?: string | null
          diferenca?: number | null
          id?: number
          media_retorno?: number | null
          percentual_crescimento?: number | null
          percentual_valor_parceiro?: number | null
          retorno?: number | null
          valor_parceiro?: number | null
        }
        Relationships: []
      }
      suporte_tork_chat: {
        Row: {
          chat_id: number | null
          cpf_do_comprador: string | null
          data_cadastro: string | null
          email: string | null
          id: number
          nome: string
          "nome do comprador": string | null
          sessionid: string | null
          telefone: string
          ultima_atualizacao: string | null
          user_id: number | null
        }
        Insert: {
          chat_id?: number | null
          cpf_do_comprador?: string | null
          data_cadastro?: string | null
          email?: string | null
          id?: number
          nome: string
          "nome do comprador"?: string | null
          sessionid?: string | null
          telefone: string
          ultima_atualizacao?: string | null
          user_id?: number | null
        }
        Update: {
          chat_id?: number | null
          cpf_do_comprador?: string | null
          data_cadastro?: string | null
          email?: string | null
          id?: number
          nome?: string
          "nome do comprador"?: string | null
          sessionid?: string | null
          telefone?: string
          ultima_atualizacao?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      support_telegram_clients: {
        Row: {
          cpf_do_comprador: string | null
          id: string
          id_Usuario: string | null
          idmensagem: string | null
          mensagem: string | null
          nome: string | null
          nome_do_comprador: string | null
          nomeempresa: string | null
          origem: string | null
          recebido_em: string | null
          sessionid: string | null
          tipo_mensagem: string | null
        }
        Insert: {
          cpf_do_comprador?: string | null
          id?: string
          id_Usuario?: string | null
          idmensagem?: string | null
          mensagem?: string | null
          nome?: string | null
          nome_do_comprador?: string | null
          nomeempresa?: string | null
          origem?: string | null
          recebido_em?: string | null
          sessionid?: string | null
          tipo_mensagem?: string | null
        }
        Update: {
          cpf_do_comprador?: string | null
          id?: string
          id_Usuario?: string | null
          idmensagem?: string | null
          mensagem?: string | null
          nome?: string | null
          nome_do_comprador?: string | null
          nomeempresa?: string | null
          origem?: string | null
          recebido_em?: string | null
          sessionid?: string | null
          tipo_mensagem?: string | null
        }
        Relationships: []
      }
      tork_chat_histories: {
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
      traqueamento_do_whatsapp: {
        Row: {
          atendentes: string
          campanhas: string | null
          canal: string | null
          data_registro: string | null
          id: number
          quantidades_leads_atendidos: number
        }
        Insert: {
          atendentes: string
          campanhas?: string | null
          canal?: string | null
          data_registro?: string | null
          id?: number
          quantidades_leads_atendidos: number
        }
        Update: {
          atendentes?: string
          campanhas?: string | null
          canal?: string | null
          data_registro?: string | null
          id?: number
          quantidades_leads_atendidos?: number
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          telefone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          nome: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
        }
        Relationships: []
      }
      usuarios_petshop: {
        Row: {
          data_cadastro: string | null
          email: string | null
          id: number
          nome: string
          sessionid: string | null
          telefone: string
          ultima_atualizacao: string | null
        }
        Insert: {
          data_cadastro?: string | null
          email?: string | null
          id?: number
          nome: string
          sessionid?: string | null
          telefone: string
          ultima_atualizacao?: string | null
        }
        Update: {
          data_cadastro?: string | null
          email?: string | null
          id?: number
          nome?: string
          sessionid?: string | null
          telefone?: string
          ultima_atualizacao?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
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
      color_source:
        | "99COLORS_NET"
        | "ART_PAINTS_YG07S"
        | "BYRNE"
        | "CRAYOLA"
        | "CMYK_COLOR_MODEL"
        | "COLORCODE_IS"
        | "COLORHEXA"
        | "COLORXS"
        | "CORNELL_UNIVERSITY"
        | "COLUMBIA_UNIVERSITY"
        | "DUKE_UNIVERSITY"
        | "ENCYCOLORPEDIA_COM"
        | "ETON_COLLEGE"
        | "FANTETTI_AND_PETRACCHI"
        | "FINDTHEDATA_COM"
        | "FERRARIO_1919"
        | "FEDERAL_STANDARD_595"
        | "FLAG_OF_INDIA"
        | "FLAG_OF_SOUTH_AFRICA"
        | "GLAZEBROOK_AND_BALDRY"
        | "GOOGLE"
        | "HEXCOLOR_CO"
        | "ISCC_NBS"
        | "KELLY_MOORE"
        | "MATTEL"
        | "MAERZ_AND_PAUL"
        | "MILK_PAINT"
        | "MUNSELL_COLOR_WHEEL"
        | "NATURAL_COLOR_SYSTEM"
        | "PANTONE"
        | "PLOCHERE"
        | "POURPRE_COM"
        | "RAL"
        | "RESENE"
        | "RGB_COLOR_MODEL"
        | "THOM_POOLE"
        | "UNIVERSITY_OF_ALABAMA"
        | "UNIVERSITY_OF_CALIFORNIA_DAVIS"
        | "UNIVERSITY_OF_CAMBRIDGE"
        | "UNIVERSITY_OF_NORTH_CAROLINA"
        | "UNIVERSITY_OF_TEXAS_AT_AUSTIN"
        | "X11_WEB"
        | "XONA_COM"
      status_agendamento:
        | "Agendado"
        | "Confirmado"
        | "Em andamento"
        | "Conclu├¡do"
        | "Cancelado"
      tipo_servico:
        | "Banho e tosa"
        | "Consulta m├®dica"
        | "Vacina├º├úo"
        | "Cirurgia"
        | "Exames"
        | "Hospedagem"
        | "Adestramento"
      user_role: "ADMIN" | "STAFF" | "CLIENT"
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
    Enums: {
      color_source: [
        "99COLORS_NET",
        "ART_PAINTS_YG07S",
        "BYRNE",
        "CRAYOLA",
        "CMYK_COLOR_MODEL",
        "COLORCODE_IS",
        "COLORHEXA",
        "COLORXS",
        "CORNELL_UNIVERSITY",
        "COLUMBIA_UNIVERSITY",
        "DUKE_UNIVERSITY",
        "ENCYCOLORPEDIA_COM",
        "ETON_COLLEGE",
        "FANTETTI_AND_PETRACCHI",
        "FINDTHEDATA_COM",
        "FERRARIO_1919",
        "FEDERAL_STANDARD_595",
        "FLAG_OF_INDIA",
        "FLAG_OF_SOUTH_AFRICA",
        "GLAZEBROOK_AND_BALDRY",
        "GOOGLE",
        "HEXCOLOR_CO",
        "ISCC_NBS",
        "KELLY_MOORE",
        "MATTEL",
        "MAERZ_AND_PAUL",
        "MILK_PAINT",
        "MUNSELL_COLOR_WHEEL",
        "NATURAL_COLOR_SYSTEM",
        "PANTONE",
        "PLOCHERE",
        "POURPRE_COM",
        "RAL",
        "RESENE",
        "RGB_COLOR_MODEL",
        "THOM_POOLE",
        "UNIVERSITY_OF_ALABAMA",
        "UNIVERSITY_OF_CALIFORNIA_DAVIS",
        "UNIVERSITY_OF_CAMBRIDGE",
        "UNIVERSITY_OF_NORTH_CAROLINA",
        "UNIVERSITY_OF_TEXAS_AT_AUSTIN",
        "X11_WEB",
        "XONA_COM",
      ],
      status_agendamento: [
        "Agendado",
        "Confirmado",
        "Em andamento",
        "Conclu├¡do",
        "Cancelado",
      ],
      tipo_servico: [
        "Banho e tosa",
        "Consulta m├®dica",
        "Vacina├º├úo",
        "Cirurgia",
        "Exames",
        "Hospedagem",
        "Adestramento",
      ],
      user_role: ["ADMIN", "STAFF", "CLIENT"],
    },
  },
} as const
