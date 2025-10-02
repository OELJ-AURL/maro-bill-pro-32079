export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficial_owners: {
        Row: {
          address: string | null
          aml_notes: string | null
          aml_screened_at: string | null
          aml_status: Database["public"]["Enums"]["verification_status"] | null
          cin_number: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          is_pep: boolean | null
          nationality: string | null
          organization_id: string
          ownership_percentage: number | null
          passport_number: string | null
          position_title: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          aml_notes?: string | null
          aml_screened_at?: string | null
          aml_status?: Database["public"]["Enums"]["verification_status"] | null
          cin_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id?: string
          is_pep?: boolean | null
          nationality?: string | null
          organization_id: string
          ownership_percentage?: number | null
          passport_number?: string | null
          position_title?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          aml_notes?: string | null
          aml_screened_at?: string | null
          aml_status?: Database["public"]["Enums"]["verification_status"] | null
          cin_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          is_pep?: boolean | null
          nationality?: string | null
          organization_id?: string
          ownership_percentage?: number | null
          passport_number?: string | null
          position_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficial_owners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          audit_data: Json | null
          consent_text: string
          consent_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          is_signed: boolean | null
          legal_basis: string | null
          organization_id: string | null
          signature_hash: string | null
          signed_at: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          audit_data?: Json | null
          consent_text: string
          consent_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_signed?: boolean | null
          legal_basis?: string | null
          organization_id?: string | null
          signature_hash?: string | null
          signed_at?: string | null
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          audit_data?: Json | null
          consent_text?: string
          consent_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          is_signed?: boolean | null
          legal_basis?: string | null
          organization_id?: string | null
          signature_hash?: string | null
          signed_at?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string
          city: string
          cnss: string | null
          company_name: string
          contact_name: string | null
          created_at: string
          email: string | null
          ice: string | null
          id: string
          if_number: string | null
          is_ice_verified: boolean | null
          is_professional: boolean | null
          payment_terms: number | null
          phone: string | null
          postal_code: string | null
          rc: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          city: string
          cnss?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          is_ice_verified?: boolean | null
          is_professional?: boolean | null
          payment_terms?: number | null
          phone?: string | null
          postal_code?: string | null
          rc?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          cnss?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          is_ice_verified?: boolean | null
          is_professional?: boolean | null
          payment_terms?: number | null
          phone?: string | null
          postal_code?: string | null
          rc?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_consents: {
        Row: {
          created_at: string
          granted: boolean
          granted_at: string | null
          id: string
          purpose: string
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          created_at?: string
          granted: boolean
          granted_at?: string | null
          id?: string
          purpose: string
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          purpose?: string
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_lines: {
        Row: {
          created_at: string
          description_ar: string | null
          description_fr: string
          document_id: string
          id: string
          line_order: number
          line_total: number
          line_total_with_tax: number
          product_id: string | null
          quantity: number
          tax_amount: number
          tax_rate: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_fr: string
          document_id: string
          id?: string
          line_order: number
          line_total: number
          line_total_with_tax: number
          product_id?: string | null
          quantity: number
          tax_amount: number
          tax_rate: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_fr?: string
          document_id?: string
          id?: string
          line_order?: number
          line_total?: number
          line_total_with_tax?: number
          product_id?: string | null
          quantity?: number
          tax_amount?: number
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_lines_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "sales_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      document_sequences: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          id: string
          next_number: number
          prefix: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          id?: string
          next_number?: number
          prefix: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          next_number?: number
          prefix?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_sequences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_uploads: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_verified: boolean | null
          metadata: Json | null
          mime_type: string | null
          organization_id: string
          uploaded_by_user_id: string
          verification_notes: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id: string
          uploaded_by_user_id: string
          verification_notes?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          organization_id?: string
          uploaded_by_user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_uploads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: Json | null
          created_at: string
          current_step: number | null
          id: string
          organization_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["onboarding_status"] | null
          step_data: Json | null
          total_steps: number
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role_enum"]
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          id?: string
          organization_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          step_data?: Json | null
          total_steps: number
          updated_at?: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role_enum"]
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          id?: string
          organization_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          step_data?: Json | null
          total_steps?: number
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          activity_code: string | null
          address_line1: string | null
          address_line2: string | null
          bank_name: string | null
          city: string | null
          cnss_number: string | null
          compliance_notes: string | null
          country: string | null
          created_at: string
          email: string | null
          iban: string | null
          ice: string | null
          id: string
          if_number: string | null
          is_aml_cleared: boolean | null
          is_banking_verified: boolean | null
          is_cnss_verified: boolean | null
          is_ice_verified: boolean | null
          is_rc_verified: boolean | null
          latitude: number | null
          legal_name: string
          longitude: number | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_type: Database["public"]["Enums"]["user_role_enum"]
          phone: string | null
          postal_code: string | null
          rc_number: string | null
          rejected_reason: string | null
          rib: string | null
          trade_name: string | null
          updated_at: string
          verification_data: Json | null
          verification_notes: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verification_tier: string | null
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          activity_code?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name?: string | null
          city?: string | null
          cnss_number?: string | null
          compliance_notes?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          iban?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          is_aml_cleared?: boolean | null
          is_banking_verified?: boolean | null
          is_cnss_verified?: boolean | null
          is_ice_verified?: boolean | null
          is_rc_verified?: boolean | null
          latitude?: number | null
          legal_name: string
          longitude?: number | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_type: Database["public"]["Enums"]["user_role_enum"]
          phone?: string | null
          postal_code?: string | null
          rc_number?: string | null
          rejected_reason?: string | null
          rib?: string | null
          trade_name?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verification_tier?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          activity_code?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name?: string | null
          city?: string | null
          cnss_number?: string | null
          compliance_notes?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          iban?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          is_aml_cleared?: boolean | null
          is_banking_verified?: boolean | null
          is_cnss_verified?: boolean | null
          is_ice_verified?: boolean | null
          is_rc_verified?: boolean | null
          latitude?: number | null
          legal_name?: string
          longitude?: number | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_type?: Database["public"]["Enums"]["user_role_enum"]
          phone?: string | null
          postal_code?: string | null
          rc_number?: string | null
          rejected_reason?: string | null
          rib?: string | null
          trade_name?: string | null
          updated_at?: string
          verification_data?: Json | null
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verification_tier?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          contact_id: string
          created_at: string
          document_id: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          receipt_path: string | null
          reference: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contact_id: string
          created_at?: string
          document_id?: string | null
          id?: string
          notes?: string | null
          payment_date: string
          payment_method: string
          receipt_path?: string | null
          reference?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contact_id?: string
          created_at?: string
          document_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          receipt_path?: string | null
          reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "sales_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          code: string
          created_at: string
          description_ar: string | null
          description_fr: string | null
          id: string
          is_active: boolean | null
          is_service: boolean | null
          min_stock_level: number | null
          name_ar: string | null
          name_fr: string
          stock_quantity: number | null
          tax_rate_id: string | null
          unit_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_active?: boolean | null
          is_service?: boolean | null
          min_stock_level?: number | null
          name_ar?: string | null
          name_fr: string
          stock_quantity?: number | null
          tax_rate_id?: string | null
          unit_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          is_active?: boolean | null
          is_service?: boolean | null
          min_stock_level?: number | null
          name_ar?: string | null
          name_fr?: string
          stock_quantity?: number | null
          tax_rate_id?: string | null
          unit_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tax_rate_id_fkey"
            columns: ["tax_rate_id"]
            isOneToOne: false
            referencedRelation: "tax_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          cnss: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          ice: string | null
          id: string
          if_number: string | null
          phone: string | null
          primary_organization_id: string | null
          rc: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnss?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          ice?: string | null
          id: string
          if_number?: string | null
          phone?: string | null
          primary_organization_id?: string | null
          rc?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          cnss?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          ice?: string | null
          id?: string
          if_number?: string | null
          phone?: string | null
          primary_organization_id?: string | null
          rc?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_organization_id_fkey"
            columns: ["primary_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          contact_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_documents: {
        Row: {
          created_at: string
          document_number: string
          document_type: string
          due_date: string | null
          id: string
          issue_date: string
          notes: string | null
          paid_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          pdf_path: string | null
          subtotal: number
          supplier_id: string
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_number: string
          document_type: string
          due_date?: string | null
          id?: string
          issue_date: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pdf_path?: string | null
          subtotal?: number
          supplier_id: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_number?: string
          document_type?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pdf_path?: string | null
          subtotal?: number
          supplier_id?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_documents: {
        Row: {
          contact_id: string
          created_at: string
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          due_date: string | null
          id: string
          is_locked: boolean | null
          issue_date: string
          notes: string | null
          paid_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          pdf_path: string | null
          reference_document_id: string | null
          signature_certificate: string | null
          signature_hash: string | null
          signature_status:
            | Database["public"]["Enums"]["signature_status"]
            | null
          signature_timestamp: string | null
          structured_data: Json | null
          subtotal: number
          tax_amount: number
          terms_conditions_ar: string | null
          terms_conditions_fr: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          due_date?: string | null
          id?: string
          is_locked?: boolean | null
          issue_date: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pdf_path?: string | null
          reference_document_id?: string | null
          signature_certificate?: string | null
          signature_hash?: string | null
          signature_status?:
            | Database["public"]["Enums"]["signature_status"]
            | null
          signature_timestamp?: string | null
          structured_data?: Json | null
          subtotal?: number
          tax_amount?: number
          terms_conditions_ar?: string | null
          terms_conditions_fr?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          document_number?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          due_date?: string | null
          id?: string
          is_locked?: boolean | null
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pdf_path?: string | null
          reference_document_id?: string | null
          signature_certificate?: string | null
          signature_hash?: string | null
          signature_status?:
            | Database["public"]["Enums"]["signature_status"]
            | null
          signature_timestamp?: string | null
          structured_data?: Json | null
          subtotal?: number
          tax_amount?: number
          terms_conditions_ar?: string | null
          terms_conditions_fr?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_documents_reference_document_id_fkey"
            columns: ["reference_document_id"]
            isOneToOne: false
            referencedRelation: "sales_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          document_id: string | null
          id: string
          movement_type: string
          notes: string | null
          product_id: string
          quantity: number
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          product_id: string
          quantity: number
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rates: {
        Row: {
          created_at: string
          effective_date: string
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          rate: number
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_date: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate: number
          user_id: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          organization_id: string
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          organization_id: string
          permissions?: Json | null
          role: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          organization_id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_onboarding_records: {
        Args: { p_legal_name?: string; p_role: string }
        Returns: {
          onboarding_id: string
          organization_id: string
        }[]
      }
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      audit_action: "create" | "update" | "delete" | "view" | "export" | "sign"
      document_type:
        | "devis"
        | "facture"
        | "avoir"
        | "bon_commande"
        | "facture_fournisseur"
      onboarding_status: "pending" | "in_progress" | "completed" | "suspended"
      payment_status: "pending" | "partial" | "paid" | "overdue" | "cancelled"
      signature_status: "pending" | "signed" | "rejected" | "expired"
      user_role: "admin" | "manager" | "user" | "accountant"
      user_role_enum: "wholesaler" | "buyer" | "admin"
      verification_status: "pending" | "in_progress" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      audit_action: ["create", "update", "delete", "view", "export", "sign"],
      document_type: [
        "devis",
        "facture",
        "avoir",
        "bon_commande",
        "facture_fournisseur",
      ],
      onboarding_status: ["pending", "in_progress", "completed", "suspended"],
      payment_status: ["pending", "partial", "paid", "overdue", "cancelled"],
      signature_status: ["pending", "signed", "rejected", "expired"],
      user_role: ["admin", "manager", "user", "accountant"],
      user_role_enum: ["wholesaler", "buyer", "admin"],
      verification_status: ["pending", "in_progress", "verified", "rejected"],
    },
  },
} as const
