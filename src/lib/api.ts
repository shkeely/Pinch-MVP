// API Client - STUBBED
// Backend moved to separate Lovable project
// Original URL: https://project-handoff--skhhackett.replit.app

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

class ApiClient {
  // STUBBED - No actual API calls
  
  setTokenProvider(_provider: () => Promise<string | null>) {
    console.log('[API STUB] Token provider set (no-op)');
  }

  async get<T>(path: string, _params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
    console.log('[API STUB] GET request to:', path, '- returning empty response');
    return { status: 'success', data: undefined as T };
  }

  async post<T>(path: string, _body?: unknown): Promise<ApiResponse<T>> {
    console.log('[API STUB] POST request to:', path, '- returning empty response');
    return { status: 'success', data: undefined as T };
  }

  async patch<T>(path: string, _body?: unknown): Promise<ApiResponse<T>> {
    console.log('[API STUB] PATCH request to:', path, '- returning empty response');
    return { status: 'success', data: undefined as T };
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    console.log('[API STUB] DELETE request to:', path, '- returning empty response');
    return { status: 'success', data: undefined as T };
  }
}

export const apiClient = new ApiClient();

// Type exports for API entities (kept for reference)
export interface ApiWedding {
  id: string;
  user_id: string;
  couple1: string;
  couple2: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  venue_address: string | null;
  dress_code: string | null;
  parking: string | null;
  hotels: string | null;
  registry: string | null;
  kids_policy: string | null;
  website_url: string | null;
  onboarding_step: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiGuest {
  id: string;
  wedding_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  segments: string[];
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiSegment {
  id: string;
  wedding_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiChatbotSettings {
  id: string;
  wedding_id: string;
  name: string;
  tone: 'warm' | 'formal' | 'fun';
  reply_mode: 'auto' | 'approval';
  active: boolean;
  unknown_answer: 'escalate' | 'generic' | 'website';
  notifications: 'realtime' | 'daily' | 'weekly';
  created_at: string;
  updated_at: string;
}

export interface ApiBrainEntry {
  id: string;
  wedding_id: string;
  type: 'faq' | 'instruction' | 'topic_to_avoid' | 'escalation_category';
  question: string | null;
  answer: string | null;
  content: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiPartner {
  id: string;
  wedding_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notify_email: boolean;
  notify_sms: boolean;
  created_at: string;
  updated_at: string;
}
