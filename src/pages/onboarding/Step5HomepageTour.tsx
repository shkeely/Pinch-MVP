import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip, TourHighlight } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import Homepage from '@/pages/Homepage';

export default function Step5HomepageTour() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleNext = () => {
    if (currentTooltip === 1) {
      // Trigger skip intro when moving from Step 1 to Step 2
      const skipButton = document.querySelector('button') as HTMLButtonElement | null;
      if (skipButton && skipButton.textContent?.includes('Skip intro')) {
        skipButton.click();
      }
    }
    
    if (currentTooltip < 3) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      // Last tooltip - advance to Step 6
      updateWedding({ 
        onboardingStep: 6,
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
      navigate('/onboarding/step-6');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      // Go back to Step 4
      updateWedding({ onboardingStep: 4 });
      navigate('/onboarding/step-4');
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
    // Go back to Step 4
    updateWedding({ onboardingStep: 4 });
    navigate('/onboarding/step-4');
  };

  return (
    <TourPage
      stepNumber={5}
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
          <div className="absolute top-80 left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              target="bottom"
              title="Your Personal Homepage"
              description="Pinch greets you and shows your wedding's status at a glance. You'll see how many questions were auto-answered and what needs your attention."
              step={1}
              totalSteps={3}
              onNext={handleNext}
              highlight={true}
            />
          </div>
        )}

        {/* Tooltip 2: Auto-Answered Questions */}
        {currentTooltip === 2 && (
          <div className="absolute top-[380px] left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              target="bottom"
              title="Auto-Answered Questions"
              description="See all the questions Pinch handled automatically today. No action needed! Review these to see how Pinch is helping your guests."
              step={2}
              totalSteps={3}
              onNext={handleNext}
              onPrev={handlePrevious}
              highlight={true}
            />
          </div>
        )}

        {/* Tooltip 3: Needs Attention Items */}
        {currentTooltip === 3 && (
          <div className="absolute top-[460px] left-1/2 -translate-x-1/2 z-50">
            <TourTooltip
              target="bottom"
              title="Needs Your Attention Items"
              description="When guests ask questions Pinch can't answer, or when there are important updates, they'll appear here. Click to review and respond."
              step={3}
              totalSteps={3}
              onNext={handleNext}
              onPrev={handlePrevious}
              highlight={true}
              buttonText="Continue Tour"
            />
          </div>
        )}
      </div>
    </TourPage>
  );
}
