import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart, Clock, Users, MessageSquare, X } from 'lucide-react';

const templates = [
  {
    id: 1,
    icon: Calendar,
    title: "RSVP Deadline Reminder",
    description: "Gentle nudge before RSVPs are due",
    preview: "Hi [Guest Name]! Just a friendly reminder that RSVPs are due by [RSVP Date]. Let us know if you can make it to our big day on [Wedding Date]! Reply YES or NO. - [Couple Names]",
    category: "Pre-Wedding",
    timing: "7 days before RSVP deadline",
    segment: "All Guests",
    tone: "Warm",
    charCount: 158
  },
  {
    id: 2,
    icon: MapPin,
    title: "Day-Of Details & Parking",
    description: "Essential info for the big day",
    preview: "Hey [Guest Name]! Tomorrow's the big day! 🎉 Ceremony starts at [Ceremony Time] at [Venue Name], [Venue Address]. Free parking available in the north lot. Can't wait to celebrate with you! - [Couple Names]",
    category: "Day-Of",
    timing: "1 day before wedding",
    segment: "All Guests (Accepted RSVPs)",
    tone: "Fun",
    charCount: 195
  },
  {
    id: 3,
    icon: Heart,
    title: "Post-Wedding Thank You",
    description: "Heartfelt gratitude after your celebration",
    preview: "Dear [Guest Name], thank you so much for celebrating our special day with us! Your presence meant the world to us. With love, [Couple Names] ❤️",
    category: "Post-Wedding",
    timing: "3 days after wedding",
    segment: "All Guests (Attended)",
    tone: "Warm",
    charCount: 147
  }
];

export default function Step9RemindersTour() {
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [templateExpanded, setTemplateExpanded] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const totalSteps = 4;

  const weddingData = {
    coupleNames: "Rachel & Michael",
    weddingDate: "June 15, 2026",
    venueName: "The Grand Estate",
    venueAddress: "123 Garden Lane, Napa Valley, CA",
    rsvpDeadline: "May 1, 2026",
    guestCount: "150 invited, 45 RSVP'd",
    ceremonyTime: "4:00 PM"
  };

  useEffect(() => {
    if (currentTooltip === 3 && selectedTemplate) {
      const timer = setTimeout(() => {
        setCurrentTooltip(4);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentTooltip, selectedTemplate]);

  const handlePrevious = () => {
    if (currentTooltip === 1) {
      navigate('/onboarding/step-8');
    } else {
      setCurrentTooltip(prev => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    if (currentTooltip === 4) {
      updateWedding({ 
        onboardingStep: 10,
        tourProgress: { 
          ...{
            homepage: false,
            conversations: false,
            guestPage: false,
            weddingInfo: false,
            chatbotSettings: false,
            reminders: true,
            analytics: false
          }
        }
      });
      navigate('/onboarding/step-10');
    } else {
      setCurrentTooltip(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const handleSkipTour = () => {
    updateWedding({ onboardingComplete: true, tourMode: false });
    navigate('/homepage');
  };

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    setTemplateExpanded(true);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessageContent(template.preview);
      setCurrentTooltip(3);
    }
  };

  const replaceVariables = (text: string) => {
    return text
      .replace('[Guest Name]', weddingData.coupleNames.split(' & ')[0])
      .replace('[Wedding Date]', weddingData.weddingDate)
      .replace('[RSVP Date]', weddingData.rsvpDeadline)
      .replace('[Ceremony Time]', weddingData.ceremonyTime)
      .replace('[Venue Name]', weddingData.venueName)
      .replace('[Venue Address]', weddingData.venueAddress)
      .replace('[Couple Names]', weddingData.coupleNames);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <button
        onClick={handleSkipTour}
        className="fixed top-20 right-4 z-50 p-2 rounded-full hover:bg-muted"
      >
        <X className="h-5 w-5" />
      </button>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div data-tour-id="reminders-overview" className={currentTooltip === 1 ? 'ring-4 ring-primary ring-offset-4 rounded-xl' : ''}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Automated Guest Reminders</h1>
            <p className="text-muted-foreground text-lg">
              Schedule SMS messages to keep your guests informed and excited
            </p>
          </div>
        </div>

        <div data-tour-id="template-cards" className={currentTooltip === 2 ? 'ring-4 ring-primary ring-offset-4 rounded-xl p-4' : ''}>
          <h2 className="text-2xl font-semibold mb-6">Choose a Template</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              const isExpanded = isSelected && templateExpanded;

              return (
                <Card 
                  key={template.id}
                  className={`p-6 transition-all hover:scale-102 hover:shadow-lg cursor-pointer ${
                    isSelected ? 'border-primary border-2 shadow-xl' : ''
                  } ${isExpanded ? 'md:col-span-3' : ''}`}
                  onClick={() => !isExpanded && handleSelectTemplate(template.id)}
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="mb-4 p-4 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Badge variant="outline">{template.segment}</Badge>
                  </div>

                  {!isExpanded && (
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                    >
                      Use This Template
                    </Button>
                  )}

                  {isExpanded && (
                    <div data-tour-id="auto-populate" className={currentTooltip === 3 ? 'ring-4 ring-primary ring-offset-4 rounded-xl p-4 mt-4' : 'mt-4'}>
                      <div className="bg-muted/50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Preview Message
                        </h4>
                        <p className="text-sm whitespace-pre-wrap mb-2">
                          {replaceVariables(template.preview)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {template.charCount} characters (1 SMS)
                        </p>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Auto-populated fields:</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• <span className="text-primary">[Guest Name]</span> - Pulled from guest list</li>
                          <li>• <span className="text-primary">[Wedding Date]</span> - {weddingData.weddingDate}</li>
                          <li>• <span className="text-primary">[Venue Name]</span> - {weddingData.venueName}</li>
                          <li>• <span className="text-primary">[Couple Names]</span> - {weddingData.coupleNames}</li>
                          <li>• <span className="text-primary">[RSVP Date]</span> - {weddingData.rsvpDeadline}</li>
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setCurrentTooltip(4)}>
                          Customize This Reminder
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setSelectedTemplate(null);
                          setTemplateExpanded(false);
                        }}>
                          Choose Different Template
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {selectedTemplate && currentTooltip === 4 && (
          <div data-tour-id="customize-options" className="ring-4 ring-primary ring-offset-4 rounded-xl p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-6">Customize Your Reminder</h2>
            
            <div className="space-y-6">
              <div data-tour-id="edit-message">
                <label className="block text-sm font-medium mb-2">Message Content</label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Edit your message..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {messageContent.length} characters
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div data-tour-id="change-category">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Pre-Wedding</option>
                    <option>Day-Of</option>
                    <option>Post-Wedding</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div data-tour-id="change-tone">
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Warm</Button>
                    <Button variant="outline" size="sm">Formal</Button>
                    <Button variant="outline" size="sm">Fun</Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div data-tour-id="adjust-timing">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Send Timing
                  </label>
                  <select className="w-full p-2 border rounded-md bg-background mb-2">
                    <option>7 days before RSVP deadline</option>
                    <option>1 day before wedding</option>
                    <option>3 days after wedding</option>
                    <option>Custom date...</option>
                  </select>
                  <input 
                    type="time" 
                    defaultValue="10:00"
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>

                <div data-tour-id="select-segment">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Guest Segment
                  </label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>All Guests</option>
                    <option>Wedding Party</option>
                    <option>Out-of-Towners</option>
                    <option>Parents</option>
                    <option>Vendors</option>
                    <option>Custom...</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sending to 45 guests
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Save Reminder</Button>
                <Button variant="outline">Preview SMS</Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tour Tooltips */}
      {currentTooltip === 1 && (
        <TourTooltip
          target="top"
          title="Automated Guest Reminders"
          description="Set up automated SMS reminders that go out to your guests at the right time. RSVP deadlines, day-of details, thank you messages - all hands-free!"
          step={currentTooltip}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrevious}
          className="top-32 left-1/2 -translate-x-1/2"
        />
      )}

      {currentTooltip === 2 && (
        <TourTooltip
          target="bottom"
          title="Choose a Template"
          description="We've created 3 pre-made templates designed by Pinch, tailored to your wedding info. Pick one and it auto-populates with your details!"
          step={currentTooltip}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrevious}
          className="top-1/2 left-1/2 -translate-x-1/2"
        />
      )}

      {currentTooltip === 3 && (
        <TourTooltip
          target="right"
          title="Smart Auto-Population"
          description="Your selected template automatically fills in with your wedding date, venue info, and other details from your Chatbot settings. No manual typing needed!"
          step={currentTooltip}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrevious}
          className="top-1/2 right-8"
        />
      )}

      {currentTooltip === 4 && (
        <TourTooltip
          target="left"
          title="Customize Everything"
          description="Fine-tune your reminder: choose which guest segment receives it, adjust the send date/time, edit the message content, or change the tone to match your vibe."
          step={currentTooltip}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrevious}
          className="top-1/3 left-8"
        />
      )}

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4 px-6 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tour: Step 5 of 7</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full ${
                    step === 5 ? 'bg-primary' : step < 5 ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
