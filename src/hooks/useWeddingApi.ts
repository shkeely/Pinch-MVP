// STUBBED - Backend moved to separate Lovable project
// These hooks return empty/null data instead of making API calls

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiWedding } from '@/lib/api';

// Query keys (kept for reference)
export const weddingKeys = {
  all: ['weddings'] as const,
  detail: (id: string) => ['weddings', id] as const,
};

// Hook for fetching a wedding by ID - STUBBED
export function useWedding(weddingId: string | null) {
  return useQuery({
    queryKey: weddingKeys.detail(weddingId || ''),
    queryFn: async () => {
      console.log('[API STUB] useWedding - returning null');
      return null;
    },
    enabled: !!weddingId,
  });
}

// Hook for creating a wedding - STUBBED
export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_data: Partial<ApiWedding>) => {
      console.log('[API STUB] useCreateWedding - no-op');
      return {} as ApiWedding;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Hook for updating a wedding - STUBBED
export function useUpdateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ApiWedding> }) => {
      console.log('[API STUB] useUpdateWedding - no-op');
      return {} as ApiWedding;
    },
    onSuccess: () => {
      // No-op
    },
  });
}

// Convert API wedding to local Wedding type (kept for reference)
export function apiToLocalWedding(api: ApiWedding): LocalWedding {
  return {
    id: api.id,
    couple1: api.couple1,
    couple2: api.couple2,
    partners: [],
    date: api.date || '',
    time: api.time || '',
    venue: api.venue || '',
    venueAddress: api.venue_address || '',
    dressCode: api.dress_code || '',
    parking: api.parking || '',
    hotels: api.hotels || '',
    registry: api.registry || '',
    kidsPolicy: api.kids_policy || '',
    customFAQs: [],
    websiteUrl: api.website_url || '',
    chatbotSettings: {
      name: 'Concierge',
      tone: 'warm',
      unknownAnswer: 'escalate',
      notifications: 'daily',
    },
    onboardingStep: api.onboarding_step as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    onboardingComplete: api.onboarding_complete,
    tourMode: false,
    canGoBack: false,
    tourProgress: {
      homepage: false,
      conversations: false,
      guestPage: false,
      weddingInfo: false,
      chatbotSettings: false,
      analytics: false,
    },
  };
}

// Convert local Wedding to API format (kept for reference)
export function localToApiWedding(local: Partial<LocalWedding>): Partial<ApiWedding> {
  const api: Partial<ApiWedding> = {};

  if (local.couple1 !== undefined) api.couple1 = local.couple1;
  if (local.couple2 !== undefined) api.couple2 = local.couple2;
  if (local.date !== undefined) api.date = local.date || null;
  if (local.time !== undefined) api.time = local.time || null;
  if (local.venue !== undefined) api.venue = local.venue || null;
  if (local.venueAddress !== undefined) api.venue_address = local.venueAddress || null;
  if (local.dressCode !== undefined) api.dress_code = local.dressCode || null;
  if (local.parking !== undefined) api.parking = local.parking || null;
  if (local.hotels !== undefined) api.hotels = local.hotels || null;
  if (local.registry !== undefined) api.registry = local.registry || null;
  if (local.kidsPolicy !== undefined) api.kids_policy = local.kidsPolicy || null;
  if (local.websiteUrl !== undefined) api.website_url = local.websiteUrl || null;
  if (local.onboardingStep !== undefined) api.onboarding_step = local.onboardingStep;
  if (local.onboardingComplete !== undefined) api.onboarding_complete = local.onboardingComplete;

  return api;
}

// Type that matches the existing Wedding type structure (kept for reference)
interface LocalWedding {
  id: string;
  couple1: string;
  couple2: string;
  partners: Array<{ id: string; name: string; email: string; phone: string }>;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  dressCode: string;
  parking: string;
  hotels: string;
  registry: string;
  kidsPolicy: string;
  customFAQs: Array<{ question: string; answer: string }>;
  websiteUrl: string;
  chatbotSettings: {
    name: string;
    tone: 'warm' | 'formal' | 'fun';
    unknownAnswer: 'escalate' | 'generic' | 'website';
    notifications: 'realtime' | 'daily' | 'weekly';
  };
  onboardingStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  onboardingComplete: boolean;
  tourMode: boolean;
  canGoBack: boolean;
  tourProgress: {
    homepage: boolean;
    conversations: boolean;
    guestPage: boolean;
    weddingInfo: boolean;
    chatbotSettings: boolean;
    analytics: boolean;
  };
}
