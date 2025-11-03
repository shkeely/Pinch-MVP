import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingStepper({ currentStep, totalSteps = 4 }: OnboardingStepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                  step < currentStep && "bg-primary border-primary",
                  step === currentStep && "border-accent bg-accent",
                  step > currentStep && "border-border bg-background"
                )}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    step === currentStep && "text-accent-foreground",
                    step > currentStep && "text-muted-foreground"
                  )}>
                    {step}
                  </span>
                )}
              </div>
              <p className={cn(
                "mt-2 text-xs font-medium text-center",
                step === currentStep && "text-foreground",
                step !== currentStep && "text-muted-foreground"
              )}>
                Step {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all",
                  step < currentStep ? "bg-primary" : "bg-border"
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
