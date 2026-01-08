import { createContext, useContext, useState, type ReactNode } from 'react';
import { Wedding, SimulatedMessage } from '@/types/wedding';

interface WeddingContextType {
  wedding: Wedding;
  updateWedding: (updates: Partial<Wedding>) => void;
  conversations: SimulatedMessage[];
  addConversation: (message: SimulatedMessage) => void;
  clearConversations: () => void;
}

const defaultWedding: Wedding = {
  id: '1',
  couple1: '',
  couple2: '',
  date: '',
  time: '',
  venue: '',
  venueAddress: '',
  dressCode: '',
  parking: '',
  hotels: '',
  registry: '',
  kidsPolicy: '',
  customFAQs: [],
  websiteUrl: '',
  chatbotSettings: {
    name: 'Pinch Concierge',
    tone: 'warm',
    unknownAnswer: 'escalate',
    notifications: 'daily',
  },
  onboardingStep: 1,
  onboardingComplete: false,
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

const getInitialWedding = (): Wedding => {
  const saved = localStorage.getItem('wedding');
  if (saved) {
    try {
      return { ...defaultWedding, ...JSON.parse(saved) };
    } catch {
      return defaultWedding;
    }
  }
  return defaultWedding;
};

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [wedding, setWedding] = useState<Wedding>(getInitialWedding);
  const [conversations, setConversations] = useState<SimulatedMessage[]>([]);

  const updateWedding = (updates: Partial<Wedding>) => {
    setWedding(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('wedding', JSON.stringify(updated));
      return updated;
    });
  };

  const addConversation = (message: SimulatedMessage) => {
    setConversations(prev => [...prev, message]);
  };

  const clearConversations = () => {
    setConversations([]);
  };

  return (
    <WeddingContext.Provider value={{ wedding, updateWedding, conversations, addConversation, clearConversations }}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within WeddingProvider');
  }
  return context;
}
