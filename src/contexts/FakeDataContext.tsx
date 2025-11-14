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
      // For escalated questions
      guestName?: string;
      guestPhone?: string;
      question?: string;
      confidence?: number;
      aiAttemptedResponse?: string;
      escalationReason?: string;
      // For AI suggestions
      suggestionContext?: string;
      relatedQuestions?: string[];
      recommendedAction?: string;
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
    category: string;
    question: string;
    answer: string | null;
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
          urgent: true,
          guestName: 'Michael Rodriguez',
          guestPhone: '+1-555-0123',
          question: 'Can I change my +1 from Sarah to Alex?',
          confidence: 45,
          aiAttemptedResponse: "I don't have information about changing RSVP details. Let me connect you with Sarah & Mike to help with this.",
          escalationReason: 'Low confidence - needs human review'
        },
        {
          id: 2,
          type: 'suggestion',
          title: 'AI Suggestion',
          description: 'David K. asked about groomsman suits - consider adding suit details to Wedding Info',
          timestamp: '4 hours ago',
          urgent: false,
          suggestionContext: 'Multiple guests are asking about attire for the wedding party',
          relatedQuestions: [
            'David K.: "What should groomsmen wear?"',
            'Tom R.: "Do we need to rent suits?"'
          ],
          recommendedAction: 'Add groomsman suit details (color, style, rental info) to Wedding Info'
        }
      ],
      handledToday: [
        {
          guestName: 'Sally',
          question: 'parking',
          timestamp: '1 hour ago'
        },
        {
          guestName: 'Tom',
          question: 'kids policy',
          timestamp: '3 hours ago'
        },
        {
          guestName: 'John',
          question: 'venue location',
          timestamp: '5 hours ago'
        },
        {
          guestName: 'Robert P.',
          question: 'dress code',
          timestamp: '6 hours ago'
        },
        {
          guestName: 'Jennifer L.',
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
        guestName: 'Sally',
        guestPhone: '+1-555-0101',
        category: 'Parking',
        question: 'Where can I park?',
        answer: 'There is free parking available in the lot adjacent to the venue. Enter through the main gate on Oak Street. The lot can accommodate 150 vehicles.',
        lastMessage: 'Where can I park?',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
        unread: false,
        confidence: 95,
        status: 'auto-answered'
      },
      {
        id: 2,
        guestName: 'Tom',
        guestPhone: '+1-555-0102',
        category: 'Dress Code',
        question: 'What should I wear?',
        answer: "We're going for cocktail attire! Think dressy but not too formal. Ladies can wear cocktail dresses, and gentlemen can wear suits or dress pants with a blazer.",
        lastMessage: 'What should I wear?',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        unread: false,
        confidence: 92,
        status: 'auto-answered'
      },
      {
        id: 3,
        guestName: 'John',
        guestPhone: '+1-555-0103',
        category: 'Registry',
        question: 'Where are you registered?',
        answer: "Thank you for thinking of us! We're registered at Crate & Barrel and Amazon. Links can be found on our wedding website.",
        lastMessage: 'Where are you registered?',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        unread: false,
        confidence: 96,
        status: 'auto-answered'
      },
      {
        id: 4,
        guestName: 'Jennifer L.',
        guestPhone: '+1-555-0104',
        category: 'Venue',
        question: 'Where is the venue?',
        answer: "The ceremony and reception will be at The Grand Estate, located at 123 Celebration Lane, Downtown. It's about 15 minutes from the city center.",
        lastMessage: 'Where is the venue?',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        unread: false,
        confidence: 98,
        status: 'auto-answered'
      },
      {
        id: 5,
        guestName: 'Robert P.',
        guestPhone: '+1-555-0105',
        category: 'Timing',
        question: 'What time does it start?',
        answer: "We'd love to see you there! The ceremony starts at 4:00 PM. We recommend arriving by 3:45 PM to find your seats.",
        lastMessage: 'What time does it start?',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        unread: false,
        confidence: 99,
        status: 'auto-answered'
      },
      {
        id: 6,
        guestName: 'Michael R.',
        guestPhone: '+1-555-0123',
        category: 'RSVP Changes',
        question: 'Can I change my +1 from Sarah to Alex?',
        answer: null,
        lastMessage: 'Can I change my +1 from Sarah to Alex?',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        unread: true,
        confidence: 45,
        status: 'escalated'
      },
      {
        id: 7,
        guestName: 'David K.',
        guestPhone: '+1-555-0145',
        category: 'Attire',
        question: 'What should groomsmen wear?',
        answer: 'The dress code is cocktail attire for guests.',
        lastMessage: 'What should groomsmen wear?',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        unread: true,
        confidence: 60,
        status: 'escalated'
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
