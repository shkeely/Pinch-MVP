import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, MessageSquare, Settings } from 'lucide-react';

export default function Step6ChatbotSetup() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  useEffect(() => {
    const targetHash = '#onboarding-step-6';
    const current = window.location?.hash?.toLowerCase?.() || '';
    if (current !== targetHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
    }
    return () => {
      if ((window.location?.hash?.toLowerCase?.() || '') === targetHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentTooltip < 5) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ 
        onboardingStep: 7,
        tourProgress: { 
          homepage: false,
          conversations: false,
          guestPage: false,
          weddingInfo: false,
          chatbotSettings: true,
          reminders: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-7');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      updateWedding({ onboardingStep: 5 });
      navigate('/onboarding/step-5');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 11,
      tourProgress: { 
        homepage: true,
        conversations: true,
        guestPage: true,
        weddingInfo: true,
        chatbotSettings: true,
        reminders: true,
        analytics: true,
      }
    });
    navigate('/homepage');
  };

  return (
    <TourPage
      stepNumber={6}
      title="Chatbot Setup Tour"
      description="Configure your AI wedding assistant"
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative min-h-screen bg-background">
        <TopNav />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8" id="tour-header">
              <h1 className="text-3xl font-bold mb-2">Chatbot Configuration</h1>
              <p className="text-muted-foreground">
                Customize how your AI assistant responds to guest questions
              </p>
            </div>

            {/* Tooltip 1: Overview */}
            {currentTooltip === 1 && (
              <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                <TourTooltip
                  target="bottom"
                  title="Chatbot Overview"
                  description="This is where you configure your AI assistant. Add wedding details, FAQs, and customize how it responds to your guests via SMS."
                  step={1}
                  totalSteps={5}
                  onNext={handleNext}
                />
              </div>
            )}

            <div className="space-y-6">
              {/* Knowledge Base Card */}
              <Card className="p-6" id="tour-knowledge-base">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
                    <p className="text-muted-foreground mb-4">
                      Add information about your wedding so the AI can answer guest questions accurately.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label>Wedding Details</Label>
                        <Textarea 
                          placeholder="Venue address, ceremony time, dress code, parking info..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage FAQs
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tooltip 2: Knowledge Base */}
                {currentTooltip === 2 && (
                  <div className="fixed top-1/2 -translate-y-1/2 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                    <TourTooltip
                      target="bottom"
                      title="Add Wedding Information"
                      description="Fill in details about your wedding so the AI can answer questions about venue, timing, dress code, and more. The more details you add, the better the responses!"
                      step={2}
                      totalSteps={5}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </Card>

              {/* Response Settings Card */}
              <Card className="p-6" id="tour-response-settings">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Response Settings</h3>
                    <p className="text-muted-foreground mb-4">
                      Control how the AI responds to different types of questions.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Auto-respond to FAQs</p>
                          <p className="text-sm text-muted-foreground">Answer common questions automatically</p>
                        </div>
                        <div className="text-sm font-medium text-primary">Enabled</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Escalate complex questions</p>
                          <p className="text-sm text-muted-foreground">Flag questions that need your review</p>
                        </div>
                        <div className="text-sm font-medium text-primary">Enabled</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooltip 3: Response Settings */}
                {currentTooltip === 3 && (
                  <div className="fixed top-1/2 -translate-y-1/2 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                    <TourTooltip
                      target="bottom"
                      title="Response Settings"
                      description="Choose how the AI handles different types of questions. You can enable auto-responses for common questions and escalate complex ones for your review."
                      step={3}
                      totalSteps={5}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </Card>

              {/* Test Chatbot Card */}
              <Card className="p-6" id="tour-test-chatbot">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Test Your Chatbot</h3>
                    <p className="text-muted-foreground mb-4">
                      Try out your chatbot to see how it responds to guest questions.
                    </p>
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open Test Chat
                    </Button>
                  </div>
                </div>

                {/* Tooltip 4: Test Chatbot */}
                {currentTooltip === 4 && (
                  <div className="fixed top-1/2 -translate-y-1/2 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                    <TourTooltip
                      target="bottom"
                      title="Test Your Configuration"
                      description="Before going live, test your chatbot to make sure it responds correctly to common guest questions."
                      step={4}
                      totalSteps={5}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </Card>

              {/* Share Chatbot Card */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-xl font-semibold mb-2">Share Your Chatbot</h3>
                <p className="text-muted-foreground mb-4">
                  Once configured, share your chatbot link with guests or add them to your guest list to enable SMS conversations.
                </p>
                <div className="flex gap-2">
                  <Button>Copy Chatbot Link</Button>
                  <Button variant="outline">Go to Guest List</Button>
                </div>

                {/* Tooltip 5: Share */}
                {currentTooltip === 5 && (
                  <div className="fixed bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                    <TourTooltip
                      target="top"
                      title="Share with Guests"
                      description="You can share a web link to your chatbot or add guests to your list to enable SMS conversations. Let's explore the guest management page next!"
                      step={5}
                      totalSteps={5}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </TourPage>
  );
}
