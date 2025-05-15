export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          postal_code: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          postal_code?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          postal_code?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_number: string
          issue_date: string
          expiry_date: string
          document_url: string | null
          verification_status: string
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_number: string
          issue_date: string
          expiry_date: string
          document_url?: string | null
          verification_status?: string
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_number?: string
          issue_date?: string
          expiry_date?: string
          document_url?: string | null
          verification_status?: string
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      investment_products: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          risk_level: string
          min_investment: number
          expected_return: number
          duration_months: number
          is_shariah_compliant: boolean
          available_units: number
          total_units: number
          image_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          risk_level: string
          min_investment: number
          expected_return: number
          duration_months: number
          is_shariah_compliant?: boolean
          available_units: number
          total_units: number
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          risk_level?: string
          min_investment?: number
          expected_return?: number
          duration_months?: number
          is_shariah_compliant?: boolean
          available_units?: number
          total_units?: number
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_investments: {
        Row: {
          id: string
          user_id: string
          product_id: string
          amount: number
          units: number
          status: string
          purchase_date: string
          maturity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          amount: number
          units: number
          status?: string
          purchase_date?: string
          maturity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          amount?: number
          units?: number
          status?: string
          purchase_date?: string
          maturity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          investment_id: string | null
          transaction_type: string
          amount: number
          status: string
          reference_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          investment_id?: string | null
          transaction_type: string
          amount: number
          status?: string
          reference_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          investment_id?: string | null
          transaction_type?: string
          amount?: number
          status?: string
          reference_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          email_notifications: boolean
          sms_notifications: boolean
          marketing_communications: boolean
          language: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email_notifications?: boolean
          sms_notifications?: boolean
          marketing_communications?: boolean
          language?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          marketing_communications?: boolean
          language?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      consent_logs: {
        Row: {
          id: string
          user_id: string
          consent_type: string
          consent_given: boolean
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          consent_type: string
          consent_given: boolean
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          consent_type?: string
          consent_given?: boolean
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity: string
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
