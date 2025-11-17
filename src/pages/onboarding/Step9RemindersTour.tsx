import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MessageSquare, ChevronDown, ChevronUp, Plus, Pencil, Send, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TopNav from '@/components/navigation/TopNav';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { TourPage } from '@/components/onboarding/TourPage';
import { useWedding } from '@/contexts/WeddingContext';

type ReminderCategory = 'RSVP' | 'Attendance' | 'Thank You';
type ReminderStatus = 'Scheduled' | 'Draft';

type TemplateReminder = {
  id: number;
  title: string;
  category: ReminderCategory;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  recipientSegment: string;
  recipientCount: number;
  status: ReminderStatus;
  icon: React.ComponentType<{ className?: string }>;
};

const categoryColors: Record<ReminderCategory, string> = {
  'RSVP': 'border-l-purple-500',
  'Attendance': 'border-l-blue-500',
  'Thank You': 'border-l-orange-500',
};

const categoryBadgeColors: Record<ReminderCategory, string> = {
  'RSVP': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Attendance': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Thank You': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const statusColors: Record<ReminderStatus, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Draft': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function Step9RemindersTour() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const templates: TemplateReminder[] = [
    {
      id: 1,
      title: 'RSVP Deadline Reminder',
      category: 'RSVP',
      message: 'Hi [Guest Name]! Just a friendly reminder that RSVPs are due by May 1, 2026. Let us know if you can make it to our big day on June 15, 2026! Reply YES or NO. - Rachel & Michael',
      scheduledDate: '2026-04-24',
      scheduledTime: '10:00 AM',
      recipientSegment: 'All Guests',
      recipientCount: 150,
      status: 'Draft',
      icon: Calendar,
    },
    {
      id: 2,
      title: 'Day-Of Details & Parking',
      category: 'Attendance',
      message: 'Hey [Guest Name]! Tomorrow\'s the big day! 🎉 Ceremony starts at 4:00 PM at The Grand Estate, 123 Venue Lane. Free parking available in the north lot. Can\'t wait to celebrate with you! - Rachel & Michael',
      scheduledDate: '2026-06-14',
      scheduledTime: '9:00 AM',
      recipientSegment: 'All Guests (Accepted RSVPs)',
      recipientCount: 45,
      status: 'Scheduled',
      icon: MessageSquare,
    },
    {
      id: 3,
      title: 'Post-Wedding Thank You',
      category: 'Thank You',
      message: 'Dear [Guest Name], thank you so much for celebrating our special day with us! Your presence meant the world to us. With love, Rachel & Michael ❤️',
      scheduledDate: '2026-06-18',
      scheduledTime: '12:00 PM',
      recipientSegment: 'All Guests (Attended)',
      recipientCount: 45,
      status: 'Draft',
      icon: MessageSquare,
    },
  ];

  useEffect(() => {
    window.location.hash = '#step-9';
  }, []);

  const handleNext = () => {
    if (currentTooltip === 1) {
      setCurrentTooltip(2);
    } else if (currentTooltip === 2 && selectedTemplate === null) {
      // User must select a template
      return;
    } else if (currentTooltip === 2 && selectedTemplate !== null) {
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
      if (currentTooltip === 3 && selectedTemplate !== null) {
        setSelectedTemplate(null);
        setCurrentTooltip(2);
      } else {
        setCurrentTooltip(currentTooltip - 1);
      }
    } else {
      updateWedding({ onboardingStep: 8 });
      navigate('/onboarding/step-8');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 11,
      onboardingComplete: true,
      tourMode: false 
    });
    navigate('/homepage');
  };

  const handleSelectTemplate = (id: number) => {
    setSelectedTemplate(id);
    setTimeout(() => {
      setCurrentTooltip(3);
    }, 500);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <TourPage
      stepNumber={9}
      title="Automated Reminders"
      description="Set up SMS reminders for your guests"
      onNext={currentTooltip === 4 ? handleNext : undefined}
      onPrevious={handlePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative w-full h-full">
        {/* Reminders Page Content */}
        <div className="min-h-screen bg-background">
          <TopNav />
          
          <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
            <div 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
              data-tour-id="reminders-overview"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Guest Reminders</h1>
                <p className="text-muted-foreground">
                  Schedule and manage automated text reminders for your guests
                </p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Reminder
              </Button>
            </div>

            <div className="grid gap-4" data-tour-id="template-cards">
              {templates.map((template) => {
                const isExpanded = selectedTemplate === template.id;
                
                return (
                  <Card 
                    key={template.id} 
                    className={`border-l-4 ${categoryColors[template.category]} hover:shadow-md transition-all ${
                      currentTooltip === 3 && isExpanded ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    data-tour-id={isExpanded ? 'auto-populate' : undefined}
                  >
                    <div className="p-5">
                      {/* Collapsed View */}
                      <div 
                        className="flex items-center justify-between gap-4 cursor-pointer"
                        onClick={() => !isExpanded && currentTooltip === 2 && handleSelectTemplate(template.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold truncate">{template.title}</h3>
                            <Badge className={categoryBadgeColors[template.category]}>
                              {template.category}
                            </Badge>
                            <Badge className={statusColors[template.status]}>
                              {template.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDateDisplay(template.scheduledDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {template.scheduledTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {template.recipientCount} recipients
                            </span>
                          </div>
                        </div>
                        <button 
                          className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isExpanded) {
                              setSelectedTemplate(null);
                              if (currentTooltip >= 3) {
                                setCurrentTooltip(2);
                              }
                            } else if (currentTooltip === 2) {
                              handleSelectTemplate(template.id);
                            }
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-6 animate-accordion-down">
                          <div className="flex flex-col lg:flex-row gap-6 mb-6">
                            {/* Left Side: Message Content */}
                            <div className="flex-1">
                              <div className="bg-muted/50 rounded-lg p-4 max-w-[85%]">
                                <div className="flex items-start gap-2 mb-2">
                                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <span className="text-xs font-medium text-muted-foreground uppercase">Message Preview</span>
                                </div>
                                <p className="text-sm leading-relaxed">{template.message}</p>
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <p className="text-xs text-muted-foreground font-medium mb-2">Auto-populated fields:</p>
                                  <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• <span className="text-primary font-medium">[Guest Name]</span> - From guest list</li>
                                    <li>• <span className="text-primary font-medium">[Wedding Date]</span> - June 15, 2026</li>
                                    <li>• <span className="text-primary font-medium">[Venue Name]</span> - The Grand Estate</li>
                                    <li>• <span className="text-primary font-medium">[Couple Names]</span> - Rachel & Michael</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Schedule & Target Settings */}
                            <div className="lg:w-64 space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  <div>
                                    <span className="text-muted-foreground">Scheduled: </span>
                                    <span className="font-medium">{formatDateDisplay(template.scheduledDate)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  <div>
                                    <span className="text-muted-foreground">Time: </span>
                                    <span className="font-medium">{template.scheduledTime}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  <div>
                                    <span className="text-muted-foreground">Recipients: </span>
                                    <span className="font-medium">{template.recipientCount}</span>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Target:</span> {template.recipientSegment}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div 
                            className="flex flex-wrap gap-2 pt-4 border-t"
                            data-tour-id="customize-options"
                          >
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Test
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>

        {/* Tour Tooltips */}
        {currentTooltip === 1 && (
          <TourTooltip
            title="Automated Guest Reminders"
            description="Set up automated SMS reminders that go out to your guests at the right time. RSVP deadlines, day-of details, thank you messages - all hands-free!"
            target="bottom"
            onNext={handleNext}
            step={currentTooltip}
            totalSteps={4}
          />
        )}

        {currentTooltip === 2 && (
          <TourTooltip
            title="Choose a Template"
            description="We've created 3 pre-made templates designed by Pinch, tailored to your wedding info. Pick one and it auto-populates with your details!"
            target="bottom"
            onNext={selectedTemplate !== null ? handleNext : undefined}
            step={currentTooltip}
            totalSteps={4}
          />
        )}

        {currentTooltip === 3 && selectedTemplate !== null && (
          <TourTooltip
            title="Smart Auto-Population"
            description="Your selected template automatically fills in with your wedding date, venue info, and other details from your Chatbot settings. No manual typing needed!"
            target="right"
            onNext={handleNext}
            step={currentTooltip}
            totalSteps={4}
          />
        )}

        {currentTooltip === 4 && selectedTemplate !== null && (
          <TourTooltip
            title="Customize Everything"
            description="Fine-tune your reminder: choose which guest segment receives it, adjust the send date/time, edit the message content, or change the tone to match your vibe."
            target="left"
            onNext={handleNext}
            step={currentTooltip}
            totalSteps={4}
          />
        )}
      </div>
    </TourPage>
  );
}
