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
  couple1: 'Sarah',
  couple2: 'Michael',
  partners: [
    { id: '1', name: 'Sarah', email: '', phone: '' },
    { id: '2', name: 'Michael', email: '', phone: '' },
  ],
  date: '2025-09-15',
  time: '4:00 PM',
  venue: 'The Grand Estate',
  venueAddress: '123 Wedding Lane, Beverly Hills, CA 90210',
  dressCode: 'Black Tie Optional',
  parking: 'Complimentary valet parking will be available at the venue entrance',
  hotels: 'We have room blocks at The Beverly Wilshire and Four Seasons',
  registry: 'Crate & Barrel, Williams Sonoma',
  kidsPolicy: 'We love your little ones, but this is an adults-only celebration',
  customFAQs: [],
  websiteUrl: 'www.sarahandmichael2025.com',
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
      const parsed = { ...defaultWedding, ...JSON.parse(saved) };
      // Migration: if partners array is empty but couple1/couple2 exist
      if ((!parsed.partners || parsed.partners.length === 0) && (parsed.couple1 || parsed.couple2)) {
        parsed.partners = [
          { id: '1', name: parsed.couple1 || '', email: '', phone: '' },
          { id: '2', name: parsed.couple2 || '', email: '', phone: '' },
        ].filter(p => p.name);
      }
      return parsed;
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
