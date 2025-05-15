export type User = {
  id: string
  email: string
  full_name: string
  phone_number?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
  is_verified: boolean
  profile_image_url?: string
  marketing_consent: boolean
  data_processing_consent: boolean
  terms_accepted_at?: string
}

export type UserProfile = {
  id: string
  user_id: string
  date_of_birth?: string
  nationality?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  occupation?: string
  income_range?: string
  risk_tolerance?: "low" | "medium" | "high"
  investment_goals?: string
  kyc_status: "pending" | "submitted" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export type Profile = {
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

export type Document = {
  id: string
  user_id: string
  product_id?: string
  type: "kyc" | "contract" | "report" | "statement"
  name: string
  file_url: string
  mime_type?: string
  size?: number
  is_verified: boolean
  verification_notes?: string
  created_at: string
  updated_at: string
}

export type KycDocument = {
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

export type InvestmentProduct = {
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

export type UserInvestment = {
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

export type Transaction = {
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

export type InvestmentPerformance = {
  id: string
  product_id: string
  date: string
  unit_price: number
  change_percentage?: number
  created_at: string
}

export type ProfitDistribution = {
  id: string
  product_id: string
  distribution_date: string
  rate: number
  description?: string
  created_at: string
}

export type UserProfitDistribution = {
  id: string
  distribution_id: string
  user_investment_id: string
  amount: number
  status: "pending" | "processed" | "reinvested"
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  is_read: boolean
  created_at: string
}

export type UserSession = {
  id: string
  user_id: string
  ip_address?: string
  user_agent?: string
  device_info?: string
  login_at: string
  logout_at?: string
  session_duration?: number
}

export type UserConsent = {
  id: string
  user_id: string
  consent_type: "marketing" | "data_processing" | "cookies" | "terms"
  granted: boolean
  granted_at: string
  revoked_at?: string
  ip_address?: string
  user_agent?: string
}

export type UserPreference = {
  user_id: string
  email_notifications: boolean
  sms_notifications: boolean
  marketing_communications: boolean
  language: string
  theme: string
  created_at: string
  updated_at: string
}

export type ConsentLog = {
  id: string
  user_id: string
  consent_type: string
  consent_given: boolean
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export type AuditLog = {
  id: string
  user_id: string | null
  action: string
  entity: string
  entity_id: string | null
  details: Record<string, any> | null
  ip_address: string | null
  created_at: string
}
