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

  // Spotlight positions for each step (approximate pixel positions from left)
  const spotlightConfig: Record<number, { left?: string; right?: string; width: string; top: string; height: string }> = {
    1: { left: '0', width: '100%', top: '0', height: '64px' }, // Entire nav bar
    2: { left: '120px', width: '100px', top: '0', height: '64px' }, // Homepage
    3: { left: '220px', width: '100px', top: '0', height: '64px' }, // Messages
    4: { left: '420px', width: '120px', top: '0', height: '64px' }, // Reminders
    5: { left: '320px', width: '100px', top: '0', height: '64px' }, // Chatbot
    6: { left: '520px', width: '100px', top: '0', height: '64px' }, // Guests
    7: { right: '180px', width: '40px', top: '12px', height: '40px' }, // Settings
    8: { right: '120px', width: '40px', top: '12px', height: '40px' }, // Notifications
    9: { right: '40px', width: '40px', top: '12px', height: '40px' }, // Profile
  };

  const currentSpotlight = spotlightConfig[currentTooltip];
  
  // Calculate spotlight position for clip-path
  const getSpotlightPosition = () => {
    if (!currentSpotlight) return '';
    
    const horizontalPos = currentSpotlight.left 
      ? currentSpotlight.left 
      : `calc(100% - ${currentSpotlight.right} - ${currentSpotlight.width})`;
    
    const horizontalEnd = currentSpotlight.left
      ? `calc(${currentSpotlight.left} + ${currentSpotlight.width})`
      : `calc(100% - ${currentSpotlight.right})`;
    
    return `polygon(
      0% 0%, 
      0% 100%, 
      ${horizontalPos} 100%, 
      ${horizontalPos} ${currentSpotlight.top},
      ${horizontalEnd} ${currentSpotlight.top},
      ${horizontalEnd} calc(${currentSpotlight.top} + ${currentSpotlight.height}),
      ${horizontalPos} calc(${currentSpotlight.top} + ${currentSpotlight.height}),
      ${horizontalPos} 100%,
      100% 100%, 
      100% 0%
    )`;
  };

  // Tooltip content based on current step
  const tooltipContent = {
    1: {
      title: "Navigation Bar",
      description: "Use the navigation bar at the top to move between different sections of Pinch. Let's explore the key areas you'll use most often."
    },
    2: {
      title: "Homepage",
      description: "Your main dashboard. Designed for quick updates - see what needs your attention at a glance."
    },
    3: {
      title: "Messages",
      description: "View all guest conversations. See every question asked and how Pinch responded."
    },
    4: {
      title: "Reminders",
      description: "Set up scheduled messages for your guests. RSVP reminders, day-of updates, thank you notes - all automated."
    },
    5: {
      title: "Chatbot",
      description: "Configure how Pinch responds to guests. Manage your wedding knowledge base and AI settings."
    },
    6: {
      title: "Guests",
      description: "Manage your guest list. Import contacts, organize segments, and control who receives chatbot messages."
    },
    7: {
      title: "Settings",
      description: "Access planner settings, partner accounts, and notification preferences."
    },
    8: {
      title: "Notifications",
      description: "View recent alerts and updates about guest questions and system events."
    },
    9: {
      title: "Your Profile",
      description: "Manage your account, add partner details, and view information from onboarding."
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

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
        
        {/* Dark overlay with spotlight cutout */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 pointer-events-none z-40"
          style={{
            clipPath: getSpotlightPosition()
          }}
        />
        
        {/* Blank page below nav */}
        <main className="relative min-h-[calc(100vh-64px)]">
          {/* Centered tooltip that stays in place */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <TourTooltip
              target="top"
              title={current.title}
              description={current.description}
              step={currentTooltip}
              totalSteps={totalSteps}
              onNext={handleNext}
              onPrev={currentTooltip > 1 ? handlePrevious : undefined}
              highlight={true}
            />
          </div>
        </main>
      </div>
    </TourPage>
  );
}
