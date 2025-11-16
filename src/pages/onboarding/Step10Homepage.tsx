import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import { cn } from '@/lib/utils';
import Homepage from '@/pages/Homepage';

export default function Step10Homepage() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [tooltipTop, setTooltipTop] = useState<number | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  // Set preferred preview route for "Open in new tab"
  useEffect(() => {
    const targetHash = '#onboarding-step-10';
    const current = window.location?.hash?.toLowerCase?.() || '';
    if (current !== targetHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
      console.log('[routing] set hash to', targetHash);
    }
    return () => {
      if ((window.location?.hash?.toLowerCase?.() || '') === targetHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        console.log('[routing] cleared onboarding hash');
      }
    };
  }, []);

  // Compute and set tooltip position dynamically
  useLayoutEffect(() => {
    const computePosition = () => {
      // Step 4 is centered, no anchor needed
      if (currentTooltip === 4) {
        setTooltipTop(window.innerHeight / 2 - 150); // Centered vertically
        return;
      }

      requestAnimationFrame(() => {
        setTimeout(() => {
          let anchorEl: HTMLElement | null = null;

          if (currentTooltip === 1) {
            // Find the "Skip intro →" button
            const buttons = Array.from(document.querySelectorAll('button'));
            anchorEl = buttons.find(btn => btn.textContent?.includes('Skip intro')) as HTMLElement;
          } else if (currentTooltip === 2) {
            anchorEl = document.getElementById('tour-btn-1');
          } else if (currentTooltip === 3) {
            anchorEl = document.getElementById('tour-btn-2');
          }

          if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            setTooltipTop(rect.bottom);
          } else {
            // Retry after a short delay if element not found
            setTimeout(computePosition, 100);
          }
        }, 50);
      });
    };

    setTooltipTop(null); // Reset while computing
    computePosition();

    // Recompute on window resize
    window.addEventListener('resize', computePosition);
    return () => window.removeEventListener('resize', computePosition);
  }, [currentTooltip]);

  const handleNext = () => {
    if (currentTooltip === 1) {
      // Trigger skip intro when moving from Step 1 to Step 2
      let attempts = 0;
      const maxAttempts = 8; // 800ms total
      const intervalId = setInterval(() => {
        attempts++;
        const buttons = Array.from(document.querySelectorAll('button'));
        const skipButton = buttons.find(btn => btn.textContent?.includes('Skip intro'));
        const btn1 = document.getElementById('tour-btn-1');
        
        if (skipButton) {
          skipButton.click();
        }
        
        // Stop when btn-1 appears or max attempts reached
        if (btn1 || attempts >= maxAttempts) {
          clearInterval(intervalId);
        }
      }, 100);
    }
    
    if (currentTooltip < 4) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      // Last tooltip - advance to Step 11
      updateWedding({ 
        onboardingStep: 11,
        tourProgress: { 
          homepage: true,
          conversations: false,
          guestPage: false,
          weddingInfo: false,
          chatbotSettings: false,
          reminders: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-11');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      // Go back to Step 9
      updateWedding({ onboardingStep: 9 });
      navigate('/onboarding/step-9');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 11,
      onboardingComplete: true,
      tourMode: false,
    });
    navigate('/');
  };

  const handlePageNext = () => {
    // Handled by tooltip navigation
  };

  const handlePagePrevious = () => {
    // Go back to Step 9
    updateWedding({ onboardingStep: 9 });
    navigate('/onboarding/step-9');
  };

  return (
    <TourPage
      stepNumber={10}
      title="Welcome to Your Homepage"
      description="Let's explore your homepage and see how Pinch keeps you organized"
      onNext={handlePageNext}
      onPrevious={handlePagePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      {/* Render actual Homepage with tooltips */}
      <div className="relative">
        <Homepage />

        {/* Tooltip 1: AnimatedGreeting */}
        {currentTooltip === 1 && (
          <div 
            className={cn(
              "fixed left-1/2 -translate-x-1/2 z-50",
              tooltipTop === null ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ top: tooltipTop ?? 0 }}
          >
            <TourTooltip
              target="bottom"
              title="Your Personal Homepage"
              description="Pinch greets you and shows your wedding's status at a glance. You'll see how many questions were auto-answered and what needs your attention."
              step={1}
              totalSteps={4}
              onNext={handleNext}
              highlight={true}
            />
          </div>
        )}

        {/* Tooltip 2: Auto-Answered Questions */}
        {currentTooltip === 2 && (
          <div 
            className={cn(
              "fixed left-1/2 -translate-x-1/2 z-50",
              tooltipTop === null ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ top: tooltipTop ?? 0 }}
          >
            <TourTooltip
              target="bottom"
              title="Auto-Answered Questions"
              description="See all the questions Pinch handled automatically today. No action needed! Review these to see how Pinch is helping your guests."
              step={2}
              totalSteps={4}
              onNext={handleNext}
              onPrev={handlePrevious}
              highlight={true}
            />
          </div>
        )}

        {/* Tooltip 3: Needs Attention Items */}
        {currentTooltip === 3 && (
          <div 
            className={cn(
              "fixed left-1/2 -translate-x-1/2 z-50",
              tooltipTop === null ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ top: tooltipTop ?? 0 }}
          >
            <TourTooltip
              target="bottom"
              title="Needs Your Attention Items"
              description="When guests ask questions Pinch can't answer, or when there are important updates, they'll appear here. Click to review and respond."
              step={3}
              totalSteps={4}
              onNext={handleNext}
              onPrev={handlePrevious}
              highlight={true}
            />
          </div>
        )}

        {/* Tooltip 4: Wrap-up - Centered */}
        {currentTooltip === 4 && (
          <div 
            className={cn(
              "fixed left-1/2 -translate-x-1/2 z-50",
              tooltipTop === null ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{ top: tooltipTop ?? 0 }}
          >
            <TourTooltip
              target="bottom"
              title="That's the Homepage!"
              description="You've learned about your homepage. Pinch greets you, shows what's handled automatically, and alerts you to items needing attention."
              step={4}
              totalSteps={4}
              onNext={handleNext}
              onPrev={handlePrevious}
              highlight={false}
              buttonText="Continue Tour →"
            />
          </div>
        )}
      </div>
    </TourPage>
  );
}
