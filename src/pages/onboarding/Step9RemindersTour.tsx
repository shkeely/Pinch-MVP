import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MessageSquare, ChevronDown, ChevronUp, Feather, CheckCircle, Stars } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TopNav from '@/components/navigation/TopNav';
import { useWedding } from '@/contexts/WeddingContext';

type PackageType = 'light' | 'standard' | 'full';

type ReminderPackage = {
  id: PackageType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  reminders: string[];
  bestFor: string;
  estimatedMessages: string;
  recommended?: boolean;
};

type ReminderDetail = {
  title: string;
  timing: string;
  recipientCount: number;
  message: string;
};

const packages: ReminderPackage[] = [
  {
    id: 'light',
    title: 'Light Touch',
    subtitle: '2 essential reminders',
    icon: Feather,
    description: 'Minimal automated messaging - just the essentials',
    reminders: [
      'RSVP Deadline (7 days before)',
      'Day-Of Details (1 day before)',
    ],
    bestFor: 'Small weddings or couples preferring personal communication',
    estimatedMessages: '~300 SMS total (2 per guest)',
  },
  {
    id: 'standard',
    title: 'Standard',
    subtitle: '4 key reminders',
    icon: CheckCircle,
    description: 'The sweet spot - covers all essential touchpoints',
    reminders: [
      'RSVP Deadline (7 days before)',
      'Day-Before Details (1 day before wedding)',
      'Morning Reminder (wedding day, 10 AM)',
      'Thank You (3 days after)',
    ],
    bestFor: 'Most couples - balanced communication',
    estimatedMessages: '~600 SMS total (4 per guest)',
    recommended: true,
  },
  {
    id: 'full',
    title: 'Full Service',
    subtitle: '7 comprehensive reminders',
    icon: Stars,
    description: 'Maximum guest support throughout your wedding journey',
    reminders: [
      'Save the Date Confirmation',
      'RSVP Opening Notice',
      'RSVP Deadline (7 days before)',
      'Venue & Accommodations (2 weeks before)',
      'Day-Before Details',
      'Morning Reminder',
      'Thank You',
    ],
    bestFor: 'Destination weddings or complex logistics',
    estimatedMessages: '~1,050 SMS total (7 per guest)',
  },
];

const packageReminders: Record<PackageType, ReminderDetail[]> = {
  light: [
    {
      title: 'RSVP Deadline Reminder',
      timing: '7 days before RSVP deadline',
      recipientCount: 150,
      message: 'Hi [Guest Name]! Just a friendly reminder that RSVPs are due by May 1, 2026. Let us know if you can make it to our big day on June 15, 2026! Reply YES or NO. - Rachel & Michael',
    },
    {
      title: 'Day-Of Details & Parking',
      timing: '1 day before wedding',
      recipientCount: 45,
      message: 'Hey [Guest Name]! Tomorrow\'s the big day! 🎉 Ceremony starts at 4:00 PM at The Grand Estate, 123 Venue Lane. Free parking available in the north lot. Can\'t wait to celebrate with you! - Rachel & Michael',
    },
  ],
  standard: [
    {
      title: 'RSVP Deadline Reminder',
      timing: '7 days before RSVP deadline',
      recipientCount: 150,
      message: 'Hi [Guest Name]! Just a friendly reminder that RSVPs are due by May 1, 2026. Let us know if you can make it to our big day on June 15, 2026! Reply YES or NO. - Rachel & Michael',
    },
    {
      title: 'Day-Before Details',
      timing: '1 day before wedding',
      recipientCount: 45,
      message: 'Hey [Guest Name]! Tomorrow\'s the big day! 🎉 Ceremony starts at 4:00 PM at The Grand Estate, 123 Venue Lane. Free parking in the north lot. See you soon! - Rachel & Michael',
    },
    {
      title: 'Wedding Day Morning Reminder',
      timing: 'Wedding day at 10:00 AM',
      recipientCount: 45,
      message: 'Good morning [Guest Name]! Today\'s the day! 🎊 Ceremony at 4:00 PM at The Grand Estate. Can\'t wait to see you! - Rachel & Michael',
    },
    {
      title: 'Post-Wedding Thank You',
      timing: '3 days after wedding',
      recipientCount: 45,
      message: 'Dear [Guest Name], thank you so much for celebrating our special day with us! Your presence meant the world to us. With love, Rachel & Michael ❤️',
    },
  ],
  full: [
    {
      title: 'Save the Date Confirmation',
      timing: '6 months before wedding',
      recipientCount: 150,
      message: 'Hi [Guest Name]! Save the date for our wedding on June 15, 2026 at The Grand Estate! Formal invitation to follow. - Rachel & Michael',
    },
    {
      title: 'RSVP Opening Notice',
      timing: '3 months before wedding',
      recipientCount: 150,
      message: 'Hey [Guest Name]! Our wedding RSVPs are now open! Please respond by May 1, 2026. Reply YES or NO to this message. - Rachel & Michael',
    },
    {
      title: 'RSVP Deadline Reminder',
      timing: '7 days before RSVP deadline',
      recipientCount: 150,
      message: 'Hi [Guest Name]! Just a friendly reminder that RSVPs are due by May 1, 2026. Let us know if you can make it! Reply YES or NO. - Rachel & Michael',
    },
    {
      title: 'Venue & Accommodations Info',
      timing: '2 weeks before wedding',
      recipientCount: 45,
      message: 'Hi [Guest Name]! Wedding details: The Grand Estate, 123 Venue Lane. Recommended hotels: Grand Hotel (555-0100) & Comfort Inn (555-0200). See you soon! - Rachel & Michael',
    },
    {
      title: 'Day-Before Details',
      timing: '1 day before wedding',
      recipientCount: 45,
      message: 'Hey [Guest Name]! Tomorrow\'s the big day! 🎉 Ceremony starts at 4:00 PM. Free parking in the north lot. Can\'t wait! - Rachel & Michael',
    },
    {
      title: 'Morning Reminder',
      timing: 'Wedding day at 10:00 AM',
      recipientCount: 45,
      message: 'Good morning [Guest Name]! Today\'s the day! 🎊 Ceremony at 4:00 PM at The Grand Estate. See you this afternoon! - Rachel & Michael',
    },
    {
      title: 'Thank You Message',
      timing: '3 days after wedding',
      recipientCount: 45,
      message: 'Dear [Guest Name], thank you so much for celebrating our special day with us! Your presence meant the world to us. With love, Rachel & Michael ❤️',
    },
  ],
};

export default function Step9RemindersTour() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [highlightRect, setHighlightRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();


  useEffect(() => {
    window.location.hash = '#step-9';
  }, []);

  // Update highlight rect when tooltip changes
  useEffect(() => {
    const updateRect = () => {
      const stepTargets: Record<number, string> = {
        1: 'reminders-overview',
        2: 'template-packages',
        3: 'expanded-package',
        4: 'action-buttons',
      };

      const targetId = stepTargets[currentTooltip];
      const el = targetId ? document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`) : null;
      
      if (el) {
        const rect = el.getBoundingClientRect();
        const padding = 12;
        setHighlightRect({
          left: rect.left - padding,
          top: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
      } else {
        setHighlightRect(null);
      }
    };

    // Initial update with delay to allow for rendering
    const timeoutId = setTimeout(updateRect, 400);
    
    // Update on window events
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [currentTooltip, selectedPackage]);

  const handleNext = () => {
    if (currentTooltip === 1) {
      setCurrentTooltip(2);
    } else if (currentTooltip === 2 && selectedPackage === null) {
      // User must select a package
      return;
    } else if (currentTooltip === 2 && selectedPackage !== null) {
      setCurrentTooltip(3);
    } else if (currentTooltip === 3) {
      setCurrentTooltip(4);
    } else {
      updateWedding({ onboardingStep: 10 });
      navigate('/onboarding/step-10');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
      if (currentTooltip === 3) {
        setSelectedPackage(null);
      }
    }
  };

  const handleSkipTour = () => {
    updateWedding({ onboardingStep: 10 });
    navigate('/onboarding/step-10');
  };

  const handleSelectPackage = (packageId: PackageType) => {
    setSelectedPackage(packageId);
    // Auto-advance to Step 3 after 1 second
    setTimeout(() => {
      setCurrentTooltip(3);
    }, 1000);
  };

  const tooltipContent: Record<number, { title: string; description: string; position: string }> = {
    1: {
      title: 'Reminders Overview',
      description: 'Automate your wedding communications! Send timely reminders for RSVPs, event details, and thank you messages.',
      position: 'below',
    },
    2: {
      title: 'Choose Your Communication Style',
      description: 'Select a package that matches your needs. Standard works great for most couples, but you can customize individual reminders later!',
      position: 'below',
    },
    3: {
      title: 'Review Package Details',
      description: 'See all the reminders included in your selected package. Each message is pre-filled with your wedding details and can be customized.',
      position: 'below',
    },
    4: {
      title: 'Customize & Schedule',
      description: 'Edit messages, adjust schedules, or activate the package. You can also customize individual reminders or add more as needed.',
      position: 'below',
    },
  };

  const current = tooltipContent[currentTooltip];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl pb-24">
        {/* Header */}
        <div className="mb-8" data-tour-id="reminders-overview">
          <h1 className="text-3xl font-bold mb-2">Automated Reminders</h1>
          <p className="text-muted-foreground">
            Keep your guests informed with personalized, automated messages
          </p>
        </div>

        {/* Package Selection or Expanded View */}
        {selectedPackage === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center" data-tour-id="template-packages">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card
                  key={pkg.id}
                  className={`relative w-full max-w-[320px] border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary cursor-pointer ${
                    selectedPackage === pkg.id ? 'border-[3px] border-primary shadow-[0_0_30px_rgba(147,51,234,0.4)]' : 'border-border'
                  }`}
                  onClick={() => currentTooltip === 2 && handleSelectPackage(pkg.id)}
                >
                  {pkg.recommended && (
                    <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">
                      ⭐ RECOMMENDED
                    </Badge>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                      <div>
                        <h3 className="text-xl font-bold">{pkg.title}</h3>
                        <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Included reminders:</h4>
                      <ul className="space-y-1">
                        {pkg.reminders.map((reminder, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{reminder}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 mb-4 pt-4 border-t">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Best for: </span>
                        <span className="font-medium">{pkg.bestFor}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Est. messages: </span>
                        <span className="font-medium">{pkg.estimatedMessages}</span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${pkg.recommended ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={pkg.recommended ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTooltip === 2) handleSelectPackage(pkg.id);
                      }}
                    >
                      Select {pkg.title}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          // Expanded Package View
          <div data-tour-id="expanded-package">
            <Card className="border-l-4 border-l-primary">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {packages.find((p) => p.id === selectedPackage)?.title} Package
                    </h3>
                    <p className="text-muted-foreground">
                      {packageReminders[selectedPackage].length} automated reminders
                    </p>
                  </div>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    onClick={() => {
                      setSelectedPackage(null);
                      if (currentTooltip >= 3) {
                        setCurrentTooltip(2);
                      }
                    }}
                  >
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Reminders List */}
                <div className="space-y-4 mb-6">
                  {packageReminders[selectedPackage].map((reminder, idx) => (
                    <Card key={idx} className="border-l-4 border-l-purple-500">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{reminder.title}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {reminder.timing}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {reminder.recipientCount} recipients
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-xs font-medium text-muted-foreground uppercase">Message Preview</span>
                          </div>
                          <p className="text-sm leading-relaxed">{reminder.message}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t" data-tour-id="action-buttons">
                  <Button variant="default">Activate Package</Button>
                  <Button variant="outline">Customize Messages</Button>
                  <Button variant="outline">Adjust Schedule</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Purple highlight box */}
      {highlightRect && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-500 rounded-lg animate-pulse"
          style={{
            left: `${highlightRect.left}px`,
            top: `${highlightRect.top}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
            border: '3px solid #9333EA',
            background: 'transparent',
            boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.1)',
          }}
        />
      )}

      {/* Centered tooltip */}
      {current && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="relative max-w-md p-6 bg-white rounded-xl shadow-2xl pointer-events-auto" style={{ border: '3px solid #9333EA' }}>
            {/* Arrow pointing to highlighted element */}
            {current.position === 'below' && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-3"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderBottom: '12px solid #9333EA',
                }}
              />
            )}

            {/* Tooltip content */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">{current.title}</h3>
              <p className="text-muted-foreground">{current.description}</p>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Step {currentTooltip} of 4
                </div>
                <div className="flex gap-2">
                  {currentTooltip > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    disabled={currentTooltip === 2 && selectedPackage === null}
                  >
                    {currentTooltip === 4 ? 'Continue' : 'Next'}
                  </button>
                </div>
              </div>
            </div>

            {/* Skip tour button */}
            <button
              onClick={handleSkipTour}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Skip tour"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4 px-6 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentTooltip === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentTooltip} of 4
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkipTour}>
              Skip Tour
            </Button>
            <Button onClick={handleNext} disabled={currentTooltip === 2 && selectedPackage === null}>
              {currentTooltip === 4 ? 'Continue to Homepage' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
