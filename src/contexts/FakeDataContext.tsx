import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FakeDataContextType {
  // Homepage data
  homepage: {
    userName: string;
    needsAttention: Array<{
      id: number;
      type: 'escalated' | 'suggestion';
      title: string;
      description: string;
      timestamp: string;
      urgent: boolean;
    }>;
    handledToday: Array<{
      guestName: string;
      question: string;
      timestamp: string;
    }>;
    metrics: {
      questionsToday: number;
      questionsAnswered: number;
      questionsEscalated: number;
      autoAnsweredPercent: number;
    };
  };
  
  // Conversations data
  conversations: Array<{
    id: number;
    guestName: string;
    guestPhone: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    confidence: number;
    status: 'auto-answered' | 'escalated' | 'resolved';
  }>;
  
  // Tour progress
  tourProgress: {
    currentStep: number;
    completed: boolean;
    skipped: boolean;
  };
  
  // Methods to update data
  updateTourProgress: (step: number) => void;
  completeTour: () => void;
  skipTour: () => void;
}

const FakeDataContext = createContext<FakeDataContextType | undefined>(undefined);

export function FakeDataProvider({ children }: { children: ReactNode }) {
  const [tourProgress, setTourProgress] = useState({
    currentStep: 5,
    completed: false,
    skipped: false
  });

  // Initialize with fake data
  const contextValue: FakeDataContextType = {
    homepage: {
      userName: "Rachel",
      needsAttention: [
        {
          id: 1,
          type: 'escalated',
          title: 'Guest Question Escalated',
          description: 'Michael R. asked about changing his +1 status',
          timestamp: '2 hours ago',
          urgent: true
        },
        {
          id: 2,
          type: 'suggestion',
          title: 'AI Suggestion',
          description: 'David K. asked about groomsman suits - consider adding suit details to Wedding Info',
          timestamp: '4 hours ago',
          urgent: false
        }
      ],
      handledToday: [
        {
          guestName: 'Susan M.',
          question: 'parking',
          timestamp: '1 hour ago'
        },
        {
          guestName: 'Tom C.',
          question: 'kids policy',
          timestamp: '3 hours ago'
        },
        {
          guestName: 'Jennifer L.',
          question: 'venue location',
          timestamp: '5 hours ago'
        },
        {
          guestName: 'Robert P.',
          question: 'dress code',
          timestamp: '6 hours ago'
        },
        {
          guestName: 'Lisa W.',
          question: 'ceremony time',
          timestamp: '7 hours ago'
        }
      ],
      metrics: {
        questionsToday: 12,
        questionsAnswered: 10,
        questionsEscalated: 2,
        autoAnsweredPercent: 83
      }
    },
    
    conversations: [
      {
        id: 1,
        guestName: 'Michael Rodriguez',
        guestPhone: '+1-555-0123',
        lastMessage: 'Can I change my +1 from Sarah to Alex?',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        unread: true,
        confidence: 45,
        status: 'escalated'
      },
      {
        id: 2,
        guestName: 'Susan Martinez',
        guestPhone: '+1-555-0101',
        lastMessage: 'Where can I park?',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        unread: false,
        confidence: 95,
        status: 'auto-answered'
      },
      {
        id: 3,
        guestName: 'David Kim',
        guestPhone: '+1-555-0145',
        lastMessage: 'What should groomsmen wear?',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        unread: true,
        confidence: 60,
        status: 'escalated'
      },
      {
        id: 4,
        guestName: 'Tom Chen',
        guestPhone: '+1-555-0102',
        lastMessage: 'Can I bring my kids?',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        unread: false,
        confidence: 88,
        status: 'auto-answered'
      }
    ],
    
    tourProgress,
    
    updateTourProgress: (step: number) => {
      setTourProgress(prev => ({ ...prev, currentStep: step }));
    },
    
    completeTour: () => {
      setTourProgress({ currentStep: 11, completed: true, skipped: false });
    },
    
    skipTour: () => {
      setTourProgress(prev => ({ ...prev, completed: false, skipped: true }));
    }
  };

  return (
    <FakeDataContext.Provider value={contextValue}>
      {children}
    </FakeDataContext.Provider>
  );
}

export function useFakeData() {
  const context = useContext(FakeDataContext);
  if (context === undefined) {
    throw new Error('useFakeData must be used within a FakeDataProvider');
  }
  return context;
}
