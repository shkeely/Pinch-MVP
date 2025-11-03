import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { ImportMethodSelection } from '@/components/onboarding/ImportMethodSelection';
import { Button } from '@/components/ui/button';
import { useWedding } from '@/contexts/WeddingContext';

export default function Step1A() {
  const [selectedMethod, setSelectedMethod] = useState<'website' | 'manual' | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleContinue = () => {
    if (!selectedMethod) return;
    
    updateWedding({ onboardingStep: 1 });
    
    if (selectedMethod === 'website') {
      navigate('/onboarding/step-1b');
    } else {
      navigate('/onboarding/step-1c');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <OnboardingStepper currentStep={1} />
        
        <div className="text-center mb-12">
          <h1 className="text-[2.6rem] font-serif font-bold mb-4 leading-tight">
            Welcome to Pinch
          </h1>
          <p className="text-[1.15rem] text-foreground max-w-2xl mx-auto leading-relaxed">
            Let's set up your AI wedding concierge. First, how would you like to import your wedding details?
          </p>
        </div>

        <ImportMethodSelection
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />

        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="rounded-xl h-11 px-8 font-medium [&:not(:disabled)]:hover:!bg-accent"
            style={{
              backgroundColor: '#5b6850',
              color: 'white'
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
