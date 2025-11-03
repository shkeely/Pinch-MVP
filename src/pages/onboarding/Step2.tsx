import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Briefcase, Sparkles } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWedding } from '@/contexts/WeddingContext';
import { Tone } from '@/types/wedding';
import { cn } from '@/lib/utils';
import { mockAIResponse } from '@/lib/mockAI';

const toneOptions = [
  {
    value: 'warm' as Tone,
    icon: Heart,
    title: 'Warm',
    description: 'Friendly, personal, and conversational',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
  },
  {
    value: 'formal' as Tone,
    icon: Briefcase,
    title: 'Formal',
    description: 'Professional, elegant, and traditional',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    value: 'fun' as Tone,
    icon: Sparkles,
    title: 'Fun',
    description: 'Playful, casual, and upbeat',
    color: 'text-mint-foreground',
    bgColor: 'bg-mint/20',
  },
];

export default function Step2() {
  const navigate = useNavigate();
  const { wedding, updateWedding } = useWedding();
  const [selectedTone, setSelectedTone] = useState<Tone>(wedding.chatbotSettings.tone);

  const exampleQuestion = "What time does the ceremony start?";
  const exampleResponse = mockAIResponse(exampleQuestion, {
    ...wedding,
    chatbotSettings: { ...wedding.chatbotSettings, tone: selectedTone }
  });

  const handleContinue = () => {
    updateWedding({
      chatbotSettings: { ...wedding.chatbotSettings, tone: selectedTone },
      onboardingStep: 2,
    });
    navigate('/onboarding/step-3');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <OnboardingStepper currentStep={2} />

        <div className="text-center mb-12">
          <h1 className="text-[2.6rem] font-serif font-bold mb-4 leading-tight">
            Choose Your Tone
          </h1>
          <p className="text-[1.15rem] text-foreground leading-relaxed">
            How should your AI concierge communicate with guests?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {toneOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedTone === option.value;

            return (
              <Card
                key={option.value}
                className={cn(
                  "p-6 cursor-pointer transition-all border-2 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]",
                  isSelected ? "border-accent" : "hover:border-foreground/10"
                )}
                onClick={() => setSelectedTone(option.value)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all text-foreground"
                    style={{ backgroundColor: '#F7F5F3' }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live Preview */}
        <Card className="p-6 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
          <h3 className="text-2xl font-serif mb-4">Preview Response</h3>
          <div className="space-y-3">
            <div className="bg-muted/30 p-4 rounded-2xl border border-border-subtle">
              <p className="text-sm text-muted-foreground mb-1">Guest asks:</p>
              <p className="font-medium">{exampleQuestion}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-2xl border border-border-subtle">
              <p className="text-sm text-muted-foreground mb-1">Pinch responds:</p>
              <p>{exampleResponse.text}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={handleContinue}
            className="rounded-xl h-11 px-8 font-medium [&:not(:disabled)]:hover:!bg-accent"
            style={{
              backgroundColor: '#5b6850',
              color: 'white'
            }}
          >
            Next: Preview Answers
          </Button>
        </div>
      </div>
    </div>
  );
}
