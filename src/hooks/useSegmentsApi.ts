// STUBBED - Backend moved to separate Lovable project
// These hooks return empty data instead of making API calls

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiSegment } from '@/lib/api';

// Query keys (kept for reference)
export const segmentKeys = {
  all: ['segments'] as const,
  list: (weddingId: string) => ['segments', 'list', weddingId] as const,
  detail: (id: string) => ['segments', id] as const,
};

// Hook for fetching segments - STUBBED
export function useSegments(weddingId: string | null) {
  return useQuery({
    queryKey: segmentKeys.list(weddingId || ''),
    queryFn: async () => {
      console.log('[API STUB] useSegments - returning empty array');
      return [];
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a segment - STUBBED
export function useCreateSegment() {
  return useMutation({
    mutationFn: async (_data: { wedding_id: string; name: string }) => {
      console.log('[API STUB] useCreateSegment - no-op');
      return {} as ApiSegment;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for updating a segment - STUBBED
export function useUpdateSegment() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiSegment> }) => {
      console.log('[API STUB] useUpdateSegment - no-op');
      return {} as ApiSegment;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for deleting a segment - STUBBED
export function useDeleteSegment() {
  return useMutation({
    mutationFn: async (_id: string) => {
      console.log('[API STUB] useDeleteSegment - no-op');
      return { deleted_at: new Date().toISOString() };
    },
    onSuccess: () => {
      // No-op
    },
  });
}
