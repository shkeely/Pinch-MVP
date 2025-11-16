import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';

interface SpotlightStyle {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: string;
}

export default function Step5NavigationBar() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [spotlightStyle, setSpotlightStyle] = useState<SpotlightStyle | null>(null);
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

  // Helper functions for dynamic positioning
  const getRect = (el: Element | null): DOMRect | null => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      ...rect,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    } as DOMRect;
  };

  const padRect = (rect: DOMRect, padding: number): DOMRect => {
    return {
      ...rect,
      left: rect.left - padding,
      top: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    } as DOMRect;
  };

  const circleFromRect = (rect: DOMRect, padding: number): DOMRect => {
    const size = Math.max(rect.width, rect.height) + padding * 2;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return {
      ...rect,
      left: centerX - size / 2,
      top: centerY - size / 2,
      width: size,
      height: size,
    } as DOMRect;
  };

  const isVisible = (rect: DOMRect | null): boolean => {
    return rect ? rect.width > 0 && rect.height > 0 : false;
  };

  // Calculate spotlight position dynamically
  const calculateSpotlight = () => {
    const header = document.querySelector('header');
    if (!header) return;

    const navLabels = ['Homepage', 'Messages', 'Chatbot', 'Reminders', 'Guests'];
    let targetEl: Element | null = null;
    let rect: DOMRect | null = null;
    let borderRadius = '12px';
    let padding = 10;

    // Step 1: Entire header
    if (currentTooltip === 1) {
      rect = getRect(header);
      if (rect) rect = padRect(rect, 8);
      borderRadius = '12px';
    }
    // Steps 2-6: Nav pills
    else if (currentTooltip >= 2 && currentTooltip <= 6) {
      const label = navLabels[currentTooltip - 2];
      const navButtons = Array.from(header.querySelectorAll('nav button'));
      targetEl = navButtons.find(btn => btn.textContent?.trim() === label) || null;
      
      rect = getRect(targetEl);
      
      // Mobile fallback: try hamburger button
      if (!isVisible(rect)) {
        const hamburger = header.querySelector('.md\\:hidden button');
        rect = getRect(hamburger);
      }
      
      // Final fallback: header
      if (!isVisible(rect)) {
        rect = getRect(header);
        if (rect) rect = padRect(rect, 8);
      } else {
        rect = padRect(rect, 8);
        borderRadius = `${(rect.height / 2)}px`;
      }
    }
    // Steps 7-9: Right action buttons
    else if (currentTooltip >= 7 && currentTooltip <= 9) {
      const rightButtons = Array.from(header.querySelectorAll('header > div:last-child button'));
      const index = currentTooltip === 7 ? 0 : currentTooltip === 8 ? 1 : 2;
      targetEl = rightButtons[index] || null;
      
      rect = getRect(targetEl);
      
      // Fallback to header if not visible
      if (!isVisible(rect)) {
        rect = getRect(header);
        if (rect) rect = padRect(rect, 8);
      } else {
        rect = circleFromRect(rect, 8);
        borderRadius = '9999px';
      }
      
      padding = 8;
    }

    if (rect && isVisible(rect)) {
      setSpotlightStyle({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius,
      });
    }
  };

  // Recalculate on tooltip change or resize
  useLayoutEffect(() => {
    calculateSpotlight();
    
    const handleResize = () => calculateSpotlight();
    window.addEventListener('resize', handleResize);
    
    const header = document.querySelector('header');
    const resizeObserver = new ResizeObserver(calculateSpotlight);
    if (header) resizeObserver.observe(header);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
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
        
        {/* Spotlight element with purple stroke and shadow */}
        {spotlightStyle && (
          <div 
            className="fixed pointer-events-none z-40 transition-all duration-300 will-change-[left,top,width,height]"
            style={{
              left: `${spotlightStyle.left}px`,
              top: `${spotlightStyle.top}px`,
              width: `${spotlightStyle.width}px`,
              height: `${spotlightStyle.height}px`,
              borderRadius: spotlightStyle.borderRadius,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 3px #a855f7, 0 10px 30px rgba(0, 0, 0, 0.35)',
            }}
          />
        )}
        
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
