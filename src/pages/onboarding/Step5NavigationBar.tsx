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

  // Step target mapping and dynamic highlight rect
  const stepTargets: Record<number, string> = {
    1: 'navbar',
    2: 'homepage',
    3: 'messages',
    4: 'reminders',
    5: 'chatbot',
    6: 'guests',
    7: 'settings',
    8: 'notifications',
    9: 'profile',
  };

  const [highlightRect, setHighlightRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const targetId = stepTargets[currentTooltip];
      const el = targetId ? document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`) : null;
      if (el) {
        const rect = el.getBoundingClientRect();
        
        // Icon buttons need fixed-size centered circles
        const isIcon = ['settings', 'notifications', 'profile'].includes(targetId);
        
        if (isIcon) {
          // Fixed 56px circle, perfectly centered on icon
          const circleSize = 56;
          setHighlightRect({
            left: rect.left + (rect.width / 2) - (circleSize / 2),
            top: rect.top + (rect.height / 2) - (circleSize / 2),
            width: circleSize,
            height: circleSize,
          });
        } else {
          // Text tabs get snug padding: 16px horizontal, 8px vertical
          const horizontalPadding = 16;
          const verticalPadding = 8;
          setHighlightRect({
            left: rect.left - horizontalPadding,
            top: rect.top - verticalPadding,
            width: rect.width + horizontalPadding * 2,
            height: rect.height + verticalPadding * 2,
          });
        }
      } else {
        setHighlightRect(null);
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentTooltip]);
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
      title: "Announcements",
      description: "Set up scheduled messages for your guests. RSVP reminders, day-of updates, thank you notes - all automated."
    },
    5: {
      title: "Chatbot",
      description: "Manage what your chatbot knows about your wedding, notification settings, etc."
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
        
        {/* Purple circle highlight around nav item */}
        {highlightRect && (
          <div 
            className="fixed pointer-events-none z-50 transition-all duration-500 rounded-full animate-pulse"
            style={{
              left: `${highlightRect.left}px`,
              top: `${highlightRect.top}px`,
              width: `${highlightRect.width}px`,
              height: `${highlightRect.height}px`,
              border: '4px solid #9333EA',
              background: 'transparent',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)',
            }}
          />
        )}
        
        {/* Blank page below nav */}
        <main className="relative min-h-[calc(100vh-64px)]">
          {/* Centered tooltip that stays in place */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="relative max-w-md p-6 bg-white rounded-xl shadow-2xl" style={{ border: '4px solid #9333EA' }}>
              {/* Arrow pointing up */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 -top-3"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid #9333EA',
                }}
              />
              
              {/* Tooltip content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{current.title}</h3>
                <p className="text-muted-foreground">{current.description}</p>
                
                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Step {currentTooltip} of {totalSteps}
                  </div>
                  <div className="flex gap-2">
                    {currentTooltip > 1 && (
                      <button
                        onClick={handlePrevious}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {currentTooltip < totalSteps ? 'Next' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TourPage>
  );
}
