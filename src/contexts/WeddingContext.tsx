import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Wedding, SimulatedMessage, Partner } from '@/types/wedding';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WeddingContextType {
  wedding: Wedding | null;
  weddingId: string | null;
  loading: boolean;
  error: string | null;
  updateWedding: (updates: Partial<Wedding>) => Promise<void>;
  createWedding: (data: Partial<Wedding>) => Promise<Wedding | null>;
  loadWedding: () => Promise<void>;
  conversations: SimulatedMessage[];
  addConversation: (message: SimulatedMessage) => void;
  clearConversations: () => void;
}

const defaultWedding: Wedding = {
  id: '',
  couple1: '',
  couple2: '',
  partners: [],
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
    name: 'Concierge',
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

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

// Local storage key for wedding data
const WEDDING_STORAGE_KEY = 'local_wedding_data';

// Generate a simple local ID
function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<SimulatedMessage[]>([]);

  // Load wedding from localStorage
  const loadWedding = async () => {
    console.log('[WeddingContext] loadWedding called (local state mode)');
    
    if (!session) {
      console.log('[WeddingContext] No session, clearing wedding');
      setWedding(null);
      setWeddingId(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedData = localStorage.getItem(WEDDING_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        console.log('[WeddingContext] Loaded wedding from localStorage:', parsed.id);
        setWedding(parsed);
        setWeddingId(parsed.id);
      } else {
        console.log('[WeddingContext] No stored wedding, user needs to create one');
      }
    } catch (err: any) {
      console.error('[WeddingContext] Error loading wedding from localStorage:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load wedding when session changes
  useEffect(() => {
    if (session) {
      loadWedding();
    } else {
      setWedding(null);
      setWeddingId(null);
    }
  }, [session]);

  const createWedding = async (data: Partial<Wedding>): Promise<Wedding | null> => {
    console.log('[WeddingContext] createWedding called (local state mode)');
    
    if (!session) {
      console.error('[WeddingContext] No session available for createWedding');
      toast.error('Please sign in to create a wedding');
      return null;
    }

    setLoading(true);
    try {
      const newId = generateLocalId();
      const newWedding: Wedding = {
        ...defaultWedding,
        ...data,
        id: newId,
      };

      // Save to localStorage
      localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(newWedding));
      localStorage.setItem('current_wedding_id', newId);
      
      setWedding(newWedding);
      setWeddingId(newId);
      console.log('[WeddingContext] Wedding created locally:', newId);
      return newWedding;
    } catch (err: any) {
      console.error('[WeddingContext] Error creating wedding:', err);
      toast.error('Failed to create wedding');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateWedding = async (updates: Partial<Wedding>) => {
    if (!weddingId || !wedding) {
      // If no wedding exists, create one
      await createWedding(updates);
      return;
    }

    // Update local state
    const updatedWedding = { ...wedding, ...updates };
    setWedding(updatedWedding);
    
    // Save to localStorage
    localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(updatedWedding));
    console.log('[WeddingContext] Wedding updated locally');
  };

  const addConversation = (message: SimulatedMessage) => {
    setConversations(prev => [...prev, message]);
  };

  const clearConversations = () => {
    setConversations([]);
  };

  return (
    <WeddingContext.Provider 
      value={{ 
        wedding, 
        weddingId,
        loading, 
        error, 
        updateWedding, 
        createWedding,
        loadWedding,
        conversations, 
        addConversation, 
        clearConversations 
      }}
    >
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
