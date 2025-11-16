import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TourTooltipProps {
  target: 'top' | 'right' | 'bottom' | 'left';
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
  highlight?: boolean;
  className?: string;
  buttonText?: string;
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
}

export function TourTooltip({
  target,
  title,
  description,
  step,
  totalSteps,
  onNext,
  onPrev,
  highlight = true,
  className,
  buttonText,
  secondaryButton,
}: TourTooltipProps) {
  // Position classes based on target direction
  const positionClasses = {
    top: 'bottom-full mb-4 left-1/2 -translate-x-1/2',
    right: 'left-full ml-4 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-4 left-1/2 -translate-x-1/2',
    left: 'right-full mr-4 top-1/2 -translate-y-1/2',
  };

  // Arrow position and rotation based on target direction
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-2 rotate-180',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-2 -rotate-90',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-2',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-2 rotate-90',
  };

  return (
    <>
      {/* Tooltip Card */}
      <div
        className={cn(
          'absolute z-50',
          positionClasses[target],
          className
        )}
      >
        <Card className="w-80 sm:w-96 shadow-2xl border-[3px] border-purple-500 ring-4 ring-purple-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                {step} of {totalSteps}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {secondaryButton && (
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={onNext}
                    className="w-full"
                    style={{
                      backgroundColor: '#5b6850',
                      color: 'white',
                    }}
                  >
                    {buttonText || 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={secondaryButton.onClick}
                    className="w-full"
                  >
                    {secondaryButton.text}
                  </Button>
                </div>
              )}
              
              {!secondaryButton && (
                <div className="flex items-center justify-between gap-2">
                  {step > 1 && onPrev ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrev}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {onNext && (
                    <Button
                      size="sm"
                      onClick={onNext}
                      className="flex-1"
                      style={{
                        backgroundColor: '#5b6850',
                        color: 'white',
                      }}
                    >
                      {buttonText || (step === totalSteps ? 'Finish' : 'Next')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Arrow pointer - only show when highlighting an element */}
        {highlight && (
          <div className={cn(
            'absolute w-0 h-0', 
            arrowClasses[target],
            (target === 'top' || target === 'bottom') ? 'animate-bounce-vertical' : 'animate-bounce-horizontal'
          )}>
            <svg
              width="20"
              height="10"
              viewBox="0 0 20 10"
              className="stroke-2"
              style={{ fill: '#a855f7', stroke: '#a855f7' }}
            >
              <path d="M0 10 L10 0 L20 10 Z" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}

// Wrapper component for highlighted elements
interface TourHighlightProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function TourHighlight({ children, active = false, className }: TourHighlightProps) {
  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        active && [
          'z-50',
          'ring-4 ring-primary/50 ring-offset-4 ring-offset-background',
          'rounded-lg',
          'animate-pulse',
          'shadow-2xl shadow-primary/20',
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
