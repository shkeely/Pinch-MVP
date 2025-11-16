import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';

export default function Step5NavigationBar() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  useEffect(() => {
    const targetHash = '#onboarding-step-5';
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
    if (currentTooltip < 4) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ 
        onboardingStep: 6,
        tourProgress: { 
          homepage: false,
          conversations: false,
          guestPage: false,
          weddingInfo: false,
          chatbotSettings: false,
          reminders: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-6');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      updateWedding({ onboardingStep: 4 });
      navigate('/onboarding/step-4');
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
      stepNumber={5}
      title="Navigation Bar Tour"
      description="Learn how to navigate around Pinch"
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative min-h-screen bg-background">
        <TopNav />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Navigation Overview</h1>
            
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Main Navigation</h2>
                <p className="text-muted-foreground">
                  The navigation bar at the top of the screen provides quick access to all major sections of Pinch.
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Key Sections</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>Homepage</strong> - Your main dashboard</li>
                  <li>• <strong>Messages</strong> - Guest conversations</li>
                  <li>• <strong>Guests</strong> - Manage your guest list</li>
                  <li>• <strong>Chatbot</strong> - Configure AI responses</li>
                  <li>• <strong>Reminders</strong> - Scheduled messages</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tooltip 1: Navigation Overview */}
          {currentTooltip === 1 && (
            <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
              <TourTooltip
                target="bottom"
                title="Navigation Bar"
                description="Use the navigation bar at the top to move between different sections of Pinch. Let's explore the key areas you'll use most often."
                step={1}
                totalSteps={4}
                onNext={handleNext}
              />
            </div>
          )}

          {/* Tooltip 2: Messages */}
          {currentTooltip === 2 && (
            <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
              <TourTooltip
                target="bottom"
                title="Messages"
                description="View and manage all conversations with your guests. The AI handles responses automatically, but you can jump in anytime."
                step={2}
                totalSteps={4}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 3: Guests */}
          {currentTooltip === 3 && (
            <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
              <TourTooltip
                target="bottom"
                title="Guest Management"
                description="Add guests, organize them into segments, and send targeted messages. This is where you'll import your guest list."
                step={3}
                totalSteps={4}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 4: Chatbot */}
          {currentTooltip === 4 && (
            <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
              <TourTooltip
                target="bottom"
                title="Chatbot Configuration"
                description="Customize how your AI assistant responds to guests. Add your wedding details, FAQs, and set response preferences."
                step={4}
                totalSteps={4}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}
        </main>
      </div>
    </TourPage>
  );
}
