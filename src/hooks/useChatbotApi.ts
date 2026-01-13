// STUBBED - Backend moved to separate Lovable project
// These hooks return empty/null data instead of making API calls

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiChatbotSettings, ApiBrainEntry } from '@/lib/api';

// Query keys (kept for reference)
export const chatbotKeys = {
  settings: (weddingId: string) => ['chatbot-settings', weddingId] as const,
  brain: (weddingId: string) => ['concierge-brain', weddingId] as const,
};

// Hook for fetching chatbot settings - STUBBED
export function useChatbotSettings(weddingId: string | null) {
  return useQuery({
    queryKey: chatbotKeys.settings(weddingId || ''),
    queryFn: async () => {
      console.log('[API STUB] useChatbotSettings - returning null');
      return null;
    },
    enabled: !!weddingId,
  });
}

// Hook for updating chatbot settings - STUBBED
export function useUpdateChatbotSettings() {
  return useMutation({
    mutationFn: async ({ weddingId, data }: { weddingId: string; data: Partial<ApiChatbotSettings> }) => {
      console.log('[API STUB] useUpdateChatbotSettings - no-op');
      return {} as ApiChatbotSettings;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for fetching brain entries - STUBBED
export function useBrainEntries(weddingId: string | null, type?: string) {
  return useQuery({
    queryKey: [...chatbotKeys.brain(weddingId || ''), type],
    queryFn: async () => {
      console.log('[API STUB] useBrainEntries - returning empty array');
      return [];
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a brain entry - STUBBED
export function useCreateBrainEntry() {
  return useMutation({
    mutationFn: async (_data: Omit<ApiBrainEntry, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      console.log('[API STUB] useCreateBrainEntry - no-op');
      return {} as ApiBrainEntry;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for updating a brain entry - STUBBED
export function useUpdateBrainEntry() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiBrainEntry> }) => {
      console.log('[API STUB] useUpdateBrainEntry - no-op');
      return {} as ApiBrainEntry;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for deleting a brain entry - STUBBED
export function useDeleteBrainEntry() {
  return useMutation({
    mutationFn: async (_id: string) => {
      console.log('[API STUB] useDeleteBrainEntry - no-op');
      return { deleted_at: new Date().toISOString() };
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Convert API chatbot settings to local format (kept for reference)
export function apiToLocalChatbotSettings(api: ApiChatbotSettings) {
  return {
    name: api.name,
    tone: api.tone,
    replyMode: api.reply_mode,
    active: api.active,
    unknownAnswer: api.unknown_answer,
    notifications: api.notifications,
  };
}
