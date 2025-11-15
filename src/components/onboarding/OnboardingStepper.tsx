import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
  tourMode?: boolean;
}

export function OnboardingStepper({ currentStep, totalSteps = 4, tourMode = false }: OnboardingStepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const displayStep = tourMode ? currentStep - 4 : currentStep;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                  step < displayStep && "bg-primary border-primary",
                  step === displayStep && "border-accent bg-accent",
                  step > displayStep && "border-border bg-background"
                )}
              >
                {step < displayStep ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    step === displayStep && "text-accent-foreground",
                    step > displayStep && "text-muted-foreground"
                  )}>
                    {step}
                  </span>
                )}
              </div>
              <p className={cn(
                "mt-2 text-xs font-medium text-center",
                step === displayStep && "text-foreground",
                step !== displayStep && "text-muted-foreground"
              )}>
                {tourMode ? `Tour ${step}` : `Step ${step}`}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all",
                  step < displayStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
