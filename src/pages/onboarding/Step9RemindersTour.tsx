import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TopNav from '@/components/navigation/TopNav';
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
  const [highlightRect, setHighlightRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
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

  // Update highlight rect when tooltip changes
  useEffect(() => {
    const updateRect = () => {
      const stepTargets: Record<number, string> = {
        1: 'reminders-overview',
        2: 'template-cards',
        3: 'expanded-card',
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
  }, [currentTooltip, selectedTemplate]);

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
      setCurrentTooltip(currentTooltip - 1);
      if (currentTooltip === 3) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleSkipTour = () => {
    updateWedding({ onboardingStep: 10 });
    navigate('/onboarding/step-10');
  };

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    setCurrentTooltip(3);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tooltipContent: Record<number, { title: string; description: string; position: string }> = {
    1: {
      title: 'Reminders Overview',
      description: 'Automate your wedding communications! Send timely reminders for RSVPs, event details, and thank you messages.',
      position: 'below',
    },
    2: {
      title: 'Select a Template',
      description: 'Choose a reminder template to customize. Each template is pre-filled with your wedding details and best practices.',
      position: 'below',
    },
    3: {
      title: 'Review Message Details',
      description: 'See how your message will appear with auto-populated guest names and wedding details. All fields are automatically filled from your wedding information.',
      position: 'below',
    },
    4: {
      title: 'Customize & Schedule',
      description: 'Edit the message, adjust the schedule, or send immediately. You can also duplicate this template for other guest segments.',
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

        {/* Templates Grid or Expanded View */}
        {selectedTemplate === null ? (
          <div className="grid gap-4" data-tour-id="template-cards">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`border-l-4 ${categoryColors[template.category]} hover:shadow-md transition-all cursor-pointer`}
                onClick={() => currentTooltip === 2 && handleSelectTemplate(template.id)}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
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
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Expanded Single Template View
          <div data-tour-id="expanded-card">
            {templates
              .filter((template) => template.id === selectedTemplate)
              .map((template) => (
                <Card
                  key={template.id}
                  className={`border-l-4 ${categoryColors[template.category]} hover:shadow-md transition-all`}
                >
                  <div className="p-6">
                    {/* Header with collapse button */}
                    <div className="flex items-center justify-between gap-4 mb-6">
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
                        onClick={() => {
                          setSelectedTemplate(null);
                          if (currentTooltip >= 3) {
                            setCurrentTooltip(2);
                          }
                        }}
                      >
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Expanded View */}
                    <div className="animate-accordion-down">
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
                        <div className="lg:w-80">
                          <div className="space-y-4">
                            <div className="bg-muted/30 rounded-lg p-4">
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Date:</span>
                                  <span className="font-medium">{formatDateDisplay(template.scheduledDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Time:</span>
                                  <span className="font-medium">{template.scheduledTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted/30 rounded-lg p-4">
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Recipients
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Segment:</span>
                                  <span className="font-medium">{template.recipientSegment}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total:</span>
                                  <span className="font-medium">{template.recipientCount} guests</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t" data-tour-id="action-buttons">
                        <Button variant="default">Schedule Reminder</Button>
                        <Button variant="outline">Edit Message</Button>
                        <Button variant="outline">Duplicate Template</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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
                    disabled={currentTooltip === 2 && selectedTemplate === null}
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
            <Button onClick={handleNext} disabled={currentTooltip === 2 && selectedTemplate === null}>
              {currentTooltip === 4 ? 'Continue to Homepage' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
