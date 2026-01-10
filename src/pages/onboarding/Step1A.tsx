import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { ImportMethodSelection } from '@/components/onboarding/ImportMethodSelection';
import { Button } from '@/components/ui/button';
import { useWedding } from '@/contexts/WeddingContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Step1A() {
  const [selectedMethod, setSelectedMethod] = useState<'website' | 'manual' | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { createWedding, weddingId, updateWedding } = useWedding();

  const handleContinue = async () => {
    if (!selectedMethod) return;
    
    setIsCreating(true);
    
    try {
      // If no wedding exists yet, create one
      if (!weddingId) {
        const wedding = await createWedding({
          couple1: '',
          couple2: '',
          onboardingStep: 1,
          onboardingComplete: false,
        });
        
        if (!wedding) {
          toast.error('Failed to create wedding. Please try again.');
          setIsCreating(false);
          return;
        }
      } else {
        // Update existing wedding
        await updateWedding({ onboardingStep: 1 });
      }
      
      if (selectedMethod === 'website') {
        navigate('/onboarding/step-1b');
      } else {
        navigate('/onboarding/step-1c');
      }
    } catch (error) {
      console.error('Error creating wedding:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
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
            disabled={!selectedMethod || isCreating}
            className="rounded-xl h-11 px-8 font-medium [&:not(:disabled)]:hover:!bg-accent"
            style={{
              backgroundColor: '#5b6850',
              color: 'white'
            }}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
