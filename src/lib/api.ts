// API Client for backend communication
// All requests go to the external API with JWT authentication

const API_BASE_URL = 'https://project-handoff--skhhackett.replit.app';

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
  private baseUrl: string;
  private getToken: (() => Promise<string | null>) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setTokenProvider(provider: () => Promise<string | null>) {
    this.getToken = provider;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const json = await response.json();

    if (!response.ok) {
      // Handle error responses
      const error: ApiError = {
        status: 'error',
        code: json.code || `HTTP_${response.status}`,
        message: json.message || response.statusText,
        details: json.details,
      };
      throw error;
    }

    // Return the full response object (includes status, data, pagination)
    return json as ApiResponse<T>;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Type exports for API entities
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
