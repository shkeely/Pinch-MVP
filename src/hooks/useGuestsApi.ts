// STUBBED - Backend moved to separate Lovable project
// These hooks return empty data instead of making API calls

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiGuest } from '@/lib/api';

// Query keys (kept for reference)
export const guestKeys = {
  all: ['guests'] as const,
  list: (weddingId: string, page?: number, segment?: string) => 
    ['guests', 'list', weddingId, { page, segment }] as const,
  detail: (id: string) => ['guests', id] as const,
};

interface GuestListParams {
  weddingId: string;
  page?: number;
  pageSize?: number;
  segment?: string;
}

interface GuestListResponse {
  guests: ApiGuest[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Hook for fetching guests with pagination - STUBBED
export function useGuests({ weddingId, page = 1, pageSize = 50, segment }: GuestListParams) {
  return useQuery({
    queryKey: guestKeys.list(weddingId, page, segment),
    queryFn: async (): Promise<GuestListResponse> => {
      console.log('[API STUB] useGuests - returning empty array');
      return {
        guests: [],
        pagination: { page: 1, pageSize, total: 0, totalPages: 0 },
      };
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a guest - STUBBED
export function useCreateGuest() {
  return useMutation({
    mutationFn: async (_data: Omit<ApiGuest, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      console.log('[API STUB] useCreateGuest - no-op');
      return {} as ApiGuest;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for updating a guest - STUBBED
export function useUpdateGuest() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiGuest> }) => {
      console.log('[API STUB] useUpdateGuest - no-op');
      return {} as ApiGuest;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for deleting a guest - STUBBED
export function useDeleteGuest() {
  return useMutation({
    mutationFn: async (_id: string) => {
      console.log('[API STUB] useDeleteGuest - no-op');
      return { deleted_at: new Date().toISOString() };
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Convert API guest to local format (kept for reference)
export function apiToLocalGuest(api: ApiGuest) {
  return {
    id: api.id,
    name: api.name,
    phone: api.phone || '',
    segments: api.segments || [],
    status: api.status,
    email: api.email,
    notes: api.notes,
  };
}

// Convert local guest to API format (kept for reference)
export function localToApiGuest(local: { 
  name: string; 
  phone?: string; 
  segments?: string[]; 
  status?: string;
  email?: string;
  notes?: string;
}, weddingId: string): Omit<ApiGuest, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
  return {
    wedding_id: weddingId,
    name: local.name,
    phone: local.phone || null,
    email: local.email || null,
    segments: local.segments || [],
    status: local.status || 'Active',
    notes: local.notes || null,
  };
}
