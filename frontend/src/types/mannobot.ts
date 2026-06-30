export interface ConversationOut {
  id: string
  phone_number: string
  session_name?: string | null
  customer_name?: string | null
  is_active: boolean
  is_within_business_hours: boolean
  status: string
  message_count: number
  last_message_at?: string | null
  created_at: string
  updated_at?: string | null
}

export interface MessageOut {
  id: string
  content: string
  direction: 'inbound' | 'outbound'
  message_type: string
  ai_model_used?: string | null
  processing_time_ms?: number | null
  created_at: string
}

export interface ChatRequest {
  message: string
  system_prompt?: string | null
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export interface ChatResponse {
  response: string
  model_used: string
  success: boolean
}

export interface ModelsResponse {
  configured_models: string[]
  count: number
}

export interface DashboardStats {
  total_conversations: number
  active_conversations: number
  total_messages: number
  blocked_numbers: number
  avg_response_time_ms: number
  messages_today: number
}

export interface SettingsOut {
  business_hours_start: number
  business_hours_end: number
  business_hours_timezone: string
  business_hours_enabled: boolean
  max_conversation_history: number
  conversation_timeout_minutes: number
  openrouter_models: string[]
  ai_system_prompt: string
  rate_limit_per_minute: number
  env: string
}

export interface BlockRequest {
  phone_number: string
  reason?: string | null
}
