import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { useFakeData } from '@/contexts/FakeDataContext';
import { Brain, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';

export default function Step11Finish() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const fakeData = useFakeData();

  useEffect(() => {
    // Set URL hash
    window.location.hash = 'step-11-finish';

    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#9333EA', '#A855F7', '#C084FC', '#E9D5FF'],
      });
    }, 250);

    return () => {
      clearInterval(interval);
      window.location.hash = '';
    };
  }, []);

  const handleCloseRecommendations = () => {
    // Clear fake data
    if (fakeData.completeTour) {
      fakeData.completeTour();
    }

    // Mark onboarding as complete
    updateWedding({
      onboardingComplete: true,
      tourMode: false,
      onboardingStep: 11,
    });

    // Clear tour progress from localStorage
    localStorage.removeItem('tourProgress');

    // Navigate to homepage
    navigate('/');
  };

  const handlePrevious = () => {
    updateWedding({ onboardingStep: 10 });
    navigate('/onboarding/step-10');
  };

  const nextSteps = [
    {
      icon: Brain,
      title: 'Complete Your Knowledge Base',
      description: 'Add more wedding details so Pinch can answer more questions automatically',
      buttonText: 'Go to Knowledge Base',
      onClick: () => {
        handleCloseRecommendations();
        navigate('/wedding-details');
      },
    },
    {
      icon: Users,
      title: 'Import Your Guest List',
      description: 'Upload your real guest list so they can start chatting with Pinch',
      buttonText: 'Import Guests',
      onClick: () => {
        handleCloseRecommendations();
        navigate('/guests');
      },
    },
    {
      icon: Settings,
      title: 'Complete Your Profile',
      description: 'Add partner names, notification preferences, and other account settings',
      buttonText: 'Update Profile',
      onClick: () => {
        handleCloseRecommendations();
        navigate('/profile');
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        {/* Progress indicator */}
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">Tour: Step 7 of 7</p>
        </div>

        <Card className="p-8 md:p-12 shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
          {/* Celebration Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              You've Finished Your Tutorial! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              All fake data has been removed.
            </p>
          </div>

          {/* Next Steps Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Recommended Tasks You Didn't Finish
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <Button
                        onClick={step.onClick}
                        variant="outline"
                        className="w-full"
                      >
                        {step.buttonText}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Main Actions */}
          <div className="flex flex-col items-center space-y-4 pt-8 border-t">
            <Button
              onClick={handleCloseRecommendations}
              size="lg"
              className="px-8"
            >
              Close Recommendations
            </Button>
            <p className="text-sm text-muted-foreground">
              You can access these from the navigation bar anytime
            </p>
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button onClick={handlePrevious} variant="ghost">
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              End of tutorial
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
