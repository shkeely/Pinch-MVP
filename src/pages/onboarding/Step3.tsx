import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Shirt, Car, Baby } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWedding } from '@/contexts/WeddingContext';
import { mockAIResponse } from '@/lib/mockAI';
import { cn } from '@/lib/utils';

const sampleQuestions = [
  { text: "What time is the ceremony?", icon: Clock },
  { text: "Where is the venue?", icon: MapPin },
  { text: "What should I wear?", icon: Shirt },
  { text: "Where do I park?", icon: Car },
  { text: "Are kids invited?", icon: Baby },
];

export default function Step3() {
  const navigate = useNavigate();
  const { wedding } = useWedding();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showIntroPopup, setShowIntroPopup] = useState(true);

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const selectedResponse = selectedQuestion ? mockAIResponse(selectedQuestion, wedding) : null;

  const handleContinue = () => {
    navigate('/onboarding/step-4');
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-mint/20 text-mint-foreground border-mint/30',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-destructive/20 text-destructive border-destructive/30',
    };
    return colors[confidence as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Intro Pop-up */}
      <Dialog open={showIntroPopup} onOpenChange={setShowIntroPopup}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif mb-2">Just so you know...</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground leading-relaxed">
            These are your current AI responses based on the tone you selected. Don't worry — you can easily adjust your tone and responses anytime after setup!
          </p>
          <Button 
            onClick={() => setShowIntroPopup(false)}
            className="mt-4 rounded-xl"
            style={{ backgroundColor: '#5b6850', color: 'white' }}
          >
            Got it!
          </Button>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        <OnboardingStepper currentStep={3} />

        <div className="text-center mb-12">
          <h1 className="text-[2.6rem] font-serif font-bold mb-4 leading-tight">
            Preview AI Responses
          </h1>
          <p className="text-[1.15rem] text-foreground leading-relaxed">
            Click any question to see how your AI concierge will respond
          </p>
        </div>

        <Card className="p-8 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {sampleQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <Button
                  key={q.text}
                  variant="outline"
                  onClick={() => handleQuestionClick(q.text)}
                  className="h-auto py-3 px-5 text-left hover:bg-accent/10 hover:border-accent transition-all"
                >
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{q.text}</span>
                </Button>
              );
            })}
          </div>

          <div className="text-center py-6 border-t">
            <p className="text-muted-foreground mb-1">
              These responses are generated using your wedding details and selected tone
            </p>
            <p className="text-sm text-muted-foreground">
              Click any question above to see the full AI response with confidence level
            </p>
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
            Next: Test with SMS Simulator
          </Button>
        </div>

        {/* Response Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">AI Response</DialogTitle>
            </DialogHeader>
            
            {selectedResponse && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border-subtle">
                  <p className="text-sm text-muted-foreground mb-2">Guest Question:</p>
                  <p className="font-medium text-lg">{selectedQuestion}</p>
                </div>

                <div className="bg-muted/30 p-4 rounded-2xl border border-border-subtle">
                  <p className="text-sm text-muted-foreground mb-2">Pinch Response:</p>
                  <p className="text-base leading-relaxed">{selectedResponse.text}</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    {selectedResponse.text.length} characters
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border-subtle">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                    <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium capitalize" style={{
                      backgroundColor: selectedResponse.confidence === 'high' ? '#c8deb9' : selectedResponse.confidence === 'medium' ? '#b7c4f1' : '#F7F5F3',
                      color: '#2E2B27'
                    }}>
                      {selectedResponse.confidence}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Source</p>
                    <p className="text-sm font-medium">
                      {selectedResponse.source || 'Generic Response'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowModal(false);
                    const nextIndex = sampleQuestions.findIndex(q => q.text === selectedQuestion);
                    if (nextIndex < sampleQuestions.length - 1) {
                      setTimeout(() => {
                        handleQuestionClick(sampleQuestions[nextIndex + 1].text);
                      }, 100);
                    }
                  }}
                >
                  Try Another
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
