import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import { cn } from '@/lib/utils';
import Homepage from '@/pages/Homepage';
import { GripVertical } from 'lucide-react';

export default function Step9Homepage() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [tooltipTop, setTooltipTop] = useState<number | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  // Draggable tooltip state
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
            anchorEl = document.getElementById('tour-btn-1'); // Needs Attention (now first)
          } else if (currentTooltip === 3) {
            anchorEl = document.getElementById('tour-btn-2'); // Handled Today (now second)
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

  // Drag handlers for tooltip
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const tooltipWidth = 400;
    const tooltipHeight = 300;
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - tooltipWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - tooltipHeight));
    
    setTooltipPosition({ x: constrainedX, y: constrainedY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    setTooltipPosition(null);
  }, [currentTooltip]);

  const getTooltipPosition = () => {
    if (tooltipPosition) {
      return {
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform: 'none'
      };
    }
    // Use computed position from layout effect
    return {
      left: '50%',
      top: `${tooltipTop ?? window.innerHeight / 2}px`,
      transform: 'translateX(-50%)'
    };
  };

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

  // Footer navigation - goes to next/previous step page directly
  const handleFooterNext = () => navigate('/onboarding/step-10');
  const handleFooterPrevious = () => navigate('/onboarding/step-8');

  const tooltipContent = {
    1: {
      title: "Your Personal Homepage",
      description: "Pinch greets you and shows your wedding's status at a glance. You'll see how many questions were auto-answered and what needs your attention."
    },
    2: {
      title: "Needs Your Attention Items",
      description: "When guests ask questions Pinch can't answer, or when there are important updates, they'll appear here. Click to review and respond."
    },
    3: {
      title: "Auto-Answered Questions",
      description: "See all the questions Pinch handled automatically today. No action needed! Review these to see how Pinch is helping your guests."
    },
    4: {
      title: "That's the Homepage!",
      description: "You've learned about your homepage. Pinch greets you, shows what's handled automatically, and alerts you to items needing attention."
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

  return (
    <TourPage
      stepNumber={9}
      title="Welcome to Your Homepage"
      description="Let's explore your homepage and see how Pinch keeps you organized"
      onNext={handleFooterNext}
      onPrevious={handleFooterPrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      {/* Render actual Homepage with tooltips */}
      <div className="relative">
        <Homepage />

        {/* Centered Draggable Tooltip */}
        <div 
          className={cn(
            "fixed z-50 pointer-events-none",
            tooltipTop === null && !tooltipPosition ? "opacity-0" : "opacity-100"
          )}
          style={{
            ...getTooltipPosition(),
            transition: isDragging ? 'none' : 'all 0.3s ease-out'
          }}
        >
          <div className="relative max-w-md p-6 bg-white rounded-xl shadow-2xl pointer-events-auto" style={{ border: '4px solid #9333EA' }}>
            {/* Arrow - only show when not dragged */}
            {!tooltipPosition && (
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
            )}
            
            {/* Tooltip content */}
            <div className="space-y-4">
                <div 
                  className="flex items-center justify-between gap-3 -mx-2 -mt-2 px-2 pt-2"
                >
                  <h3 className="text-xl font-semibold text-foreground flex-1">{current.title}</h3>
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-purple-50 transition-colors"
                    onMouseDown={handleDragStart}
                  >
                    <GripVertical className="w-4 h-6 text-purple-600 flex-shrink-0" />
                  </div>
                </div>
              <p className="text-muted-foreground">{current.description}</p>
              
              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Step {currentTooltip} of 4
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
                    {currentTooltip < 4 ? 'Next' : 'Continue Tour →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TourPage>
  );
}
