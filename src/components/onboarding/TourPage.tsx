import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnboardingStepper } from './OnboardingStepper';

interface TourPageProps {
  stepNumber: 5 | 6 | 7 | 8 | 9 | 10 | 11;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  onSkipTour?: () => void;
  showSkipButton?: boolean;
}

export function TourPage({
  stepNumber,
  title,
  description,
  children,
  onNext,
  onPrevious,
  onSkipTour,
  showSkipButton = false,
}: TourPageProps) {
  const tourStep = stepNumber - 4; // Convert to 1-7 range

  return (
    <div className="min-h-screen bg-background">
      {/* Content Area */}
      <div className="relative">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none z-10" />
        
        {/* Actual content with tooltips */}
        <div className="relative z-20">
          {children}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* Left: Previous button */}
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex-shrink-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {/* Center: Progress indicator */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium whitespace-nowrap">
                Tour {tourStep} of 7
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step < tourStep
                        ? 'bg-primary'
                        : step === tourStep
                        ? 'bg-primary ring-2 ring-primary/30'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Center-right: Skip Tour button */}
            {showSkipButton && onSkipTour && (
              <Button
                variant="ghost"
                onClick={onSkipTour}
                className="text-sm text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                Skip Tour
              </Button>
            )}

            {/* Right: Next button */}
            <Button
              onClick={onNext}
              className="flex-shrink-0"
              style={{
                backgroundColor: '#5b6850',
                color: 'white'
              }}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col gap-3">
            {/* Row 1: Progress */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">
                Tour {tourStep} of 7
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step < tourStep
                        ? 'bg-primary'
                        : step === tourStep
                        ? 'bg-primary ring-2 ring-primary/30'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Row 2: Navigation */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={onPrevious}
                size="sm"
                className="flex-1"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              {showSkipButton && onSkipTour && (
                <Button
                  variant="ghost"
                  onClick={onSkipTour}
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip
                </Button>
              )}

              <Button
                onClick={onNext}
                size="sm"
                className="flex-1"
                style={{
                  backgroundColor: '#5b6850',
                  color: 'white'
                }}
              >
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content being hidden behind footer */}
      <div className="h-24" />
    </div>
  );
}
