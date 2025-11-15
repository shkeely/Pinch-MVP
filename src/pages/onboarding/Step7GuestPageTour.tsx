import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Phone, Mail, User, Users, Utensils } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';

export default function Step7GuestPageTour() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleNext = () => {
    if (currentTooltip < 3) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ onboardingStep: 8 });
      navigate('/onboarding/step-8');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      updateWedding({ onboardingStep: 6 });
      navigate('/onboarding/step-6#step-6');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ onboardingStep: 8 });
    navigate('/onboarding/step-8');
  };

  const conversationMessages = [
    {
      id: 1,
      from: 'guest',
      content: "Hi! What time should we arrive at the venue?",
      timestamp: "2024-01-15 10:30 AM",
      confidence: 95
    },
    {
      id: 2,
      from: 'ai',
      content: "The ceremony begins at 4:00 PM. We recommend arriving 15-20 minutes early.",
      timestamp: "2024-01-15 10:31 AM",
      confidence: 95
    },
    {
      id: 3,
      from: 'guest',
      content: "Is there parking available at the venue?",
      timestamp: "2024-01-16 2:15 PM",
      confidence: 88
    },
    {
      id: 4,
      from: 'ai',
      content: "Yes! There's complimentary valet parking at the main entrance.",
      timestamp: "2024-01-16 2:16 PM",
      confidence: 88
    },
    {
      id: 5,
      from: 'guest',
      content: "Can I bring my fiancée Sarah as my plus one?",
      timestamp: "2024-01-18 9:00 AM",
      confidence: 72
    },
    {
      id: 6,
      from: 'ai',
      content: "Absolutely! I've updated your RSVP to include Sarah Rodriguez as your plus one. We're excited to have both of you!",
      timestamp: "2024-01-18 9:01 AM",
      confidence: 72
    }
  ];

  return (
    <TourPage
      stepNumber={7}
      title="Individual Guest Page"
      description="Let's explore how you can view detailed information and conversation history for each guest."
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        {/* Guest Profile Card */}
        <div className="relative">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Michael Rodriguez</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                        Accepted
                      </Badge>
                      <Badge variant="outline">Plus One</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>+1-555-0123</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>michael.r@email.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Sarah Rodriguez</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="h-5 w-5 text-muted-foreground" />
                  <span>Vegetarian</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentTooltip === 1 && (
            <div className="fixed top-4 left-4 right-4 max-w-[calc(100vw-32px)] md:top-auto md:bottom-32 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:right-auto lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
              <TourTooltip
                target="bottom"
                title="Guest Profile"
                description="See guest details, RSVP status, and contact info all in one place."
                step={1}
                totalSteps={3}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}
        </div>

        {/* Conversation History */}
        <div className="relative">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.from === 'guest' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.from === 'ai' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={message.from === 'guest' ? 'bg-primary/10 text-primary' : 'bg-purple-500/10 text-purple-700'}>
                          {message.from === 'guest' ? 'MR' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 ${message.from === 'ai' ? 'items-end' : ''}`}>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.from === 'guest' 
                            ? 'bg-muted' 
                            : 'bg-primary/10 border border-primary/20'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          {message.from === 'ai' && (
                            <Badge variant="outline" className="text-xs">
                              {message.confidence}% confidence
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentTooltip === 2 && (
            <div className="fixed top-4 left-4 right-4 max-w-[calc(100vw-32px)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:right-auto lg:absolute lg:top-1/2 lg:left-full lg:-translate-y-1/2 lg:translate-x-0 lg:ml-4 z-50">
              <TourTooltip
                target="right"
                title="Complete Conversation History"
                description="Every question this guest has asked and Pinch's responses. You can jump in anytime to respond manually."
                step={2}
                totalSteps={3}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}
        </div>

        {/* Send Message Button */}
        <div className="relative">
          <Button size="lg" className="w-full">
            <MessageSquare className="mr-2 h-5 w-5" />
            Send Message to Michael
          </Button>

          {currentTooltip === 3 && (
            <div className="fixed top-4 left-4 right-4 max-w-[calc(100vw-32px)] md:top-32 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:right-auto lg:absolute lg:bottom-full lg:left-1/2 lg:-translate-x-1/2 lg:mb-4 z-50">
              <TourTooltip
                target="top"
                title="Manual Messaging"
                description="Want to send a personal message to this guest? Use this to send SMS directly through Pinch."
                step={3}
                totalSteps={3}
                onNext={handleNext}
                onPrev={handlePrevious}
                buttonText="Next"
              />
            </div>
          )}
        </div>
      </div>
    </TourPage>
  );
}
