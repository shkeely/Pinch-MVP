import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { DraggableTourTooltip } from '@/components/onboarding/DraggableTourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import { cn } from '@/lib/utils';
import Homepage from '@/pages/Homepage';

export default function Step9Homepage() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [tooltipTop, setTooltipTop] = useState<number | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  // Set preferred preview route for "Open in new tab"
  useEffect(() => {
    const targetHash = '#onboarding-step-9';
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
      // Last tooltip - advance to Step 10
      updateWedding({ 
        onboardingStep: 10,
        tourProgress: { 
          homepage: true,
          conversations: false,
          guestPage: false,
          weddingInfo: false,
          chatbotSettings: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-10');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      // Go back to Step 8
      updateWedding({ onboardingStep: 8 });
      navigate('/onboarding/step-8');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 10,
      onboardingComplete: true,
      tourMode: false,
    });
    navigate('/');
  };

  const handlePageNext = () => {
    // Handled by tooltip navigation
  };

  const handlePagePrevious = () => {
    // Go back to Step 8
    updateWedding({ onboardingStep: 8 });
    navigate('/onboarding/step-8');
  };

  return (
    <TourPage
      stepNumber={9}
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
          <DraggableTourTooltip isFirstStep={true}>
            <div className="relative max-w-md p-6 bg-white dark:bg-card rounded-xl shadow-2xl" style={{ border: '4px solid #9333EA' }}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Your Personal Homepage</h3>
                <p className="text-muted-foreground">Pinch greets you and shows your wedding's status at a glance. You'll see how many questions were auto-answered and what needs your attention.</p>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">Step 1 of 4</div>
                  <button onClick={handleNext} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Next</button>
                </div>
              </div>
            </div>
          </DraggableTourTooltip>
        )}

        {/* Tooltip 2: Auto-Answered Questions */}
        {currentTooltip === 2 && (
          <DraggableTourTooltip>
            <div className="relative max-w-md p-6 bg-white dark:bg-card rounded-xl shadow-2xl" style={{ border: '4px solid #9333EA' }}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Auto-Answered Questions</h3>
                <p className="text-muted-foreground">See all the questions Pinch handled automatically today. No action needed! Review these to see how Pinch is helping your guests.</p>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">Step 2 of 4</div>
                  <div className="flex gap-2">
                    <button onClick={handlePrevious} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Previous</button>
                    <button onClick={handleNext} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </DraggableTourTooltip>
        )}

        {/* Tooltip 3: Needs Attention Items */}
        {currentTooltip === 3 && (
          <DraggableTourTooltip>
            <div className="relative max-w-md p-6 bg-white dark:bg-card rounded-xl shadow-2xl" style={{ border: '4px solid #9333EA' }}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Needs Your Attention Items</h3>
                <p className="text-muted-foreground">When guests ask questions Pinch can't answer, or when there are important updates, they'll appear here. Click to review and respond.</p>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">Step 3 of 4</div>
                  <div className="flex gap-2">
                    <button onClick={handlePrevious} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Previous</button>
                    <button onClick={handleNext} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </DraggableTourTooltip>
        )}

        {/* Tooltip 4: Wrap-up */}
        {currentTooltip === 4 && (
          <DraggableTourTooltip>
            <div className="relative max-w-md p-6 bg-white dark:bg-card rounded-xl shadow-2xl" style={{ border: '4px solid #9333EA' }}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">That's the Homepage!</h3>
                <p className="text-muted-foreground">You've learned about your homepage. Pinch greets you, shows what's handled automatically, and alerts you to items needing attention.</p>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">Step 4 of 4</div>
                  <div className="flex gap-2">
                    <button onClick={handlePrevious} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Previous</button>
                    <button onClick={handleNext} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Continue Tour →</button>
                  </div>
                </div>
              </div>
            </div>
          </DraggableTourTooltip>
        )}
      </div>
    </TourPage>
  );
}
