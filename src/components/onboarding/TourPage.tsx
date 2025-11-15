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
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Tutorial Mode Badge */}
            <Badge 
              variant="secondary" 
              className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 px-4 py-1 text-sm font-medium animate-fade-in"
            >
              Tutorial Mode
            </Badge>

            {/* Title and Description */}
            <div className="space-y-2 max-w-3xl animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-2xl animate-fade-in">
              <OnboardingStepper 
                currentStep={stepNumber} 
                totalSteps={7}
                tourMode={true}
              />
            </div>
          </div>
        </div>
      </div>

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
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left side: Previous button */}
            <Button
              variant="outline"
              onClick={onPrevious}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {/* Center: Skip Tour button (only on first tour step) */}
            {showSkipButton && onSkipTour && (
              <Button
                variant="ghost"
                onClick={onSkipTour}
                className="w-full sm:w-auto order-3 sm:order-2 text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>
            )}

            {/* Right side: Next button */}
            <Button
              onClick={onNext}
              className="w-full sm:w-auto order-1 sm:order-3"
              style={{
                backgroundColor: '#5b6850',
                color: 'white'
              }}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content being hidden behind footer */}
      <div className="h-24" />
    </div>
  );
}
