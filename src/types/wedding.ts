export type Tone = 'warm' | 'formal' | 'fun';

export type UnknownAnswerBehavior = 'escalate' | 'generic' | 'website';

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly';

export type Confidence = 'high' | 'medium' | 'low';

export interface FAQ {
  question: string;
  answer: string;
}

export interface ChatbotSettings {
  name: string;
  tone: Tone;
  unknownAnswer: UnknownAnswerBehavior;
  notifications: NotificationFrequency;
}

export interface Wedding {
  id: string;
  couple1: string;
  couple2: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  dressCode: string;
  parking: string;
  hotels: string;
  registry: string;
  kidsPolicy: string;
  customFAQs: FAQ[];
  websiteUrl: string;
  
  chatbotSettings: ChatbotSettings;
  
  onboardingStep: 1 | 2 | 3 | 4;
  onboardingComplete: boolean;
}

export interface SimulatedMessage {
  id: string;
  timestamp: string;
  guestMessage: string;
  botResponse: string;
  confidence: Confidence;
  source: string | null;
  isGuest: boolean;
}

export interface AIResponse {
  text: string;
  confidence: Confidence;
  source: string | null;
}
