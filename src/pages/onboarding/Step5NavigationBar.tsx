import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';

export default function Step5NavigationBar() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const totalSteps = 9;

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
    if (currentTooltip < totalSteps) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      navigate('/onboarding/step-6');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
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
        
        {/* Blank page - only tooltips below */}
        <main className="relative min-h-[calc(100vh-64px)]">
          
          {/* Tooltip 1: Navigation Bar Introduction */}
          {currentTooltip === 1 && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Navigation Bar"
                description="Use the navigation bar at the top to move between different sections of Pinch. Let's explore the key areas you'll use most often."
                step={1}
                totalSteps={totalSteps}
                onNext={handleNext}
                highlight={false}
              />
            </div>
          )}

          {/* Tooltip 2: Homepage Nav Item */}
          {currentTooltip === 2 && (
            <div className="fixed top-20 left-[15%] -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Homepage"
                description="Your main dashboard. Designed for quick updates - see what needs your attention at a glance."
                step={2}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 3: Messages Nav Item */}
          {currentTooltip === 3 && (
            <div className="fixed top-20 left-[27%] -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Messages"
                description="View all guest conversations. See every question asked and how Pinch responded."
                step={3}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 4: Reminders Nav Item */}
          {currentTooltip === 4 && (
            <div className="fixed top-20 left-[50%] -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Reminders"
                description="Set up scheduled messages for your guests. RSVP reminders, day-of updates, thank you notes - all automated."
                step={4}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 5: Chatbot Nav Item */}
          {currentTooltip === 5 && (
            <div className="fixed top-20 left-[39%] -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Chatbot"
                description="Configure how Pinch responds to guests. Manage your wedding knowledge base and AI settings."
                step={5}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 6: Guests Nav Item */}
          {currentTooltip === 6 && (
            <div className="fixed top-20 left-[62%] -translate-x-1/2 z-50">
              <TourTooltip
                target="bottom"
                title="Guests"
                description="Manage your guest list. Import contacts, organize segments, and control who receives chatbot messages."
                step={6}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 7: Settings Icon */}
          {currentTooltip === 7 && (
            <div className="fixed top-20 right-[180px] z-50">
              <TourTooltip
                target="bottom"
                title="Settings"
                description="Access planner settings, partner accounts, and notification preferences."
                step={7}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 8: Notifications Icon */}
          {currentTooltip === 8 && (
            <div className="fixed top-20 right-[120px] z-50">
              <TourTooltip
                target="bottom"
                title="Notifications"
                description="View recent alerts and updates about guest questions and system events."
                step={8}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrevious}
              />
            </div>
          )}

          {/* Tooltip 9: Profile Icon */}
          {currentTooltip === 9 && (
            <div className="fixed top-20 right-[40px] z-50">
              <TourTooltip
                target="bottom"
                title="Your Profile"
                description="Manage your account, add partner details, and view information from onboarding."
                step={9}
                totalSteps={totalSteps}
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
