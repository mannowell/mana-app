export interface UserCreate {
  email: string;
  password: string;
  business_name?: string | null;
}

export interface UserOut {
  id: number;
  email: string;
  business_name?: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AppointmentCreate {
  title: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  appointment_time: string;
  duration_minutes?: number;
  notes?: string | null;
}

export interface AppointmentOut {
  id: number;
  title: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  appointment_time: string;
  duration_minutes: number;
  status: string;
  notes?: string | null;
  created_at: string;
}

export interface WahaWebhook {
  event: string;
  payload: Record<string, unknown>;
}
