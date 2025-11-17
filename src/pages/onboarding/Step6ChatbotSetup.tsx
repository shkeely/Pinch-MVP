import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Zap, Sparkles, Heart, Briefcase, Smile, Send, Share2, Settings2, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const tones = [
  {
    id: 'warm',
    name: 'Warm',
    description: 'Friendly and welcoming',
    icon: Heart,
    example: "We'd love to see you there! The ceremony starts at 4 PM."
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Polite and elegant',
    icon: Briefcase,
    example: "The ceremony will commence at 4:00 PM. We look forward to your presence."
  },
  {
    id: 'fun',
    name: 'Fun',
    description: 'Playful and casual',
    icon: Smile,
    example: "Party starts at 4! Can't wait to celebrate with you! 🎉"
  }
];

const restrictedQuestions = ["How much did the wedding cost?", "Can I bring extra guests not on my RSVP?", "What are you serving for dinner?"];
const escalationCategories = [
  { name: "Personal requests (gift questions, seating changes)", enabled: true },
  { name: "Vendor information", enabled: true },
  { name: "Plus-one modifications", enabled: true },
  { name: "Dietary restrictions", enabled: false },
  { name: "Budget or cost questions", enabled: true }
];
const quickTestQuestions = ["Where can I park?", "What time is the ceremony?", "Can I bring my kids?", "What's the dress code?", "Where should I stay?"];

export default function Step6ChatbotSetup() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [highlightRect, setHighlightRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const totalSteps = 7;

  // State for chatbot page
  const [selectedTone, setSelectedTone] = useState('warm');
  const [chatbotName, setChatbotName] = useState('Wedding Assistant');
  const [replyMode, setReplyMode] = useState<'auto' | 'approval'>('auto');
  const [chatbotActive, setChatbotActive] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [restrictedQuestionsOpen, setRestrictedQuestionsOpen] = useState(false);
  const [escalationCategoriesOpen, setEscalationCategoriesOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'user',
      content: 'What time is the wedding?',
      timestamp: '01:17 PM'
    },
    {
      role: 'assistant',
      content: "We'd love to see you there! The ceremony starts at the scheduled time.",
      timestamp: '01:17 PM'
    }
  ]);

  useEffect(() => {
    const targetHash = '#onboarding-step-6';
    const current = window.location?.hash?.toLowerCase?.() || '';
    if (current !== targetHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
    }
    return () => {
      if ((window.location?.hash?.toLowerCase?.() || '') === targetHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    };
  }, []);

  // Update highlight rect when tooltip changes
  useEffect(() => {
    const updateRect = () => {
      const stepTargets: Record<number, string> = {
        1: 'chatbot-overview',
        2: 'wedding-details',
        3: 'manage-faqs',
        4: 'message-handling',
        5: 'chat-simulation',
        6: 'chatbot-name',
        7: 'chatbot-status',
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

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentTooltip]);

  const handleNext = () => {
    if (currentTooltip < totalSteps) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ 
        onboardingStep: 7,
        tourProgress: { 
          homepage: false,
          conversations: false,
          guestPage: false,
          weddingInfo: false,
          chatbotSettings: true,
          reminders: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-7');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      navigate('/onboarding/step-5');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 11,
      tourProgress: { 
        homepage: true,
        conversations: true,
        guestPage: true,
        weddingInfo: true,
        chatbotSettings: true,
        reminders: true,
        analytics: true,
      }
    });
    navigate('/homepage');
  };

  const handleSendTest = () => {
    if (!testMessage.trim()) return;
    const newUserMsg = {
      role: 'user',
      content: testMessage,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages(prev => [...prev, newUserMsg]);
    setTestMessage('');

    setTimeout(() => {
      const response = tones.find(t => t.id === selectedTone)?.example || "Thank you for your message!";
      const aiMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const handleQuickQuestion = (question: string) => {
    const newUserMsg = {
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newUserMsg]);
    
    setTimeout(() => {
      const response = tones.find(t => t.id === selectedTone)?.example || "Thank you for your message!";
      const aiMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const tooltipContent = {
    1: {
      title: "Meet Your AI Wedding Assistant",
      description: "Pinch is your AI chatbot that answers guest questions via SMS. Let's configure how it works for your wedding!",
      position: 'below' as const
    },
    2: {
      title: "Add Your Wedding Information",
      description: "Fill in details about your venue, timing, dress code, parking, etc. This is what Pinch uses to answer guest questions.",
      position: 'right' as const
    },
    3: {
      title: "Organize Into Categories",
      description: "Click 'Update Chatbot Brain' to see different categories like Venue, Timing, Accommodations. You can edit items or scrape information again if needed.",
      position: 'right' as const
    },
    4: {
      title: "Auto-Reply vs Manual Approval",
      description: "Auto-Reply lets Pinch answer automatically. If you prefer to review messages before they're sent, switch to 'Notify Me for Message Approval' instead.",
      position: 'right' as const
    },
    5: {
      title: "Try It Out!",
      description: "Use the simulation on the right to test how Pinch responds. Ask it questions about your wedding to see if it has the right information.",
      position: 'left' as const
    },
    6: {
      title: "Name Your Assistant",
      description: "Give your chatbot a name! It'll use this name when texting with guests. 'Wedding Assistant' works great, or get creative!",
      position: 'right' as const
    },
    7: {
      title: "Activate & Test with Real Questions",
      description: "Toggle the chatbot status to 'Active' when you're ready. After testing in simulation, click 'Give Feedback' to help Pinch improve its responses.",
      position: 'left' as const
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

  return (
    <div className="min-h-screen bg-background">
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" />

      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl relative z-30">
        <div className="mb-8 flex items-center justify-between" data-tour-id="chatbot-overview">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">AI Chatbot</h1>
            <p className="text-muted-foreground">
              Configure your AI wedding concierge
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Chatbot
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr,450px] gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Tone Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Response Tone</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {tones.map(tone => {
                  const Icon = tone.icon;
                  const isSelected = selectedTone === tone.id;
                  return (
                    <Card
                      key={tone.id}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-accent border-2 bg-accent/5' : 'hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedTone(tone.id)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-accent/20' : 'bg-muted'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-accent' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{tone.name}</h3>
                          <p className="text-sm text-muted-foreground">{tone.description}</p>
                        </div>
                      </div>
                      <p className="text-sm italic text-muted-foreground pl-13">
                        "{tone.example}"
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Chatbot Name */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="chatbot-name">
              <h3 className="font-semibold mb-3">Chatbot Name</h3>
              <Input
                value={chatbotName}
                onChange={e => setChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
              />
            </Card>

            {/* Reply Mode */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="message-handling">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Message Handling</h4>
                <Button variant="ghost" size="sm" disabled>
                  <Settings2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <RadioGroup
                value={replyMode}
                onValueChange={(value) => setReplyMode(value as 'auto' | 'approval')}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <RadioGroupItem value="auto" id="auto" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="auto" className="font-medium cursor-pointer">Auto-Reply</Label>
                    <p className="text-sm text-muted-foreground">Respond to messages automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="approval" id="approval" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="approval" className="font-medium cursor-pointer">
                      Notify Me for Message Approval
                    </Label>
                    <p className="text-sm text-muted-foreground">Review and approve messages before sending</p>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Chatbot Brain Card */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="knowledge-base">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Chatbot Brain</h2>
              </div>

              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 rounded-lg bg-[#fcfbf8]"
                  data-tour-id="wedding-details"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Wedding Details</p>
                      <p className="text-sm text-muted-foreground">Location, timing, dress code</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-[#fcfbf8]">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Custom FAQs</p>
                      <p className="text-sm text-muted-foreground">Your specific Q&A pairs</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                data-tour-id="manage-faqs"
                disabled
              >
                Update Chatbot Brain
              </Button>
            </Card>

            <Button className="w-full" size="lg" disabled>
              Save Changes
            </Button>
          </div>

          {/* Right Column - Chat Simulation */}
          <div className="lg:sticky lg:top-8 h-fit space-y-4">
            {/* Status Card */}
            <Card className="p-4" data-tour-id="chatbot-status">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chatbot Status</h3>
                    <p className="text-xs text-muted-foreground">AI is {chatbotActive ? 'active' : 'inactive'}</p>
                  </div>
                </div>
                <Switch checked={chatbotActive} onCheckedChange={setChatbotActive} />
              </div>
            </Card>

            <Card className="overflow-hidden bg-white dark:bg-card border-2 shadow-lg" data-tour-id="chat-simulation">
              <div className="p-4 border-b bg-white dark:bg-muted/30 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{chatbotName}</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold px-4 py-1.5 text-sm">
                  Simulation Mode
                </Badge>
              </div>

              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-background">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                      <div className={`rounded-2xl p-4 ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center justify-between px-2">
                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        {msg.role === 'assistant' && (
                          <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" disabled>
                            Give Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t bg-white dark:bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={testMessage}
                    onChange={e => setTestMessage(e.target.value)}
                    placeholder="Test a question..."
                    onKeyPress={e => e.key === 'Enter' && handleSendTest()}
                  />
                  <Button onClick={handleSendTest} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Purple highlight circle */}
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
          {current.position === 'right' && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -left-3"
              style={{
                width: 0,
                height: 0,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderRight: '12px solid #9333EA',
              }}
            />
          )}
          {current.position === 'left' && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -right-3"
              style={{
                width: 0,
                height: 0,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderLeft: '12px solid #9333EA',
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
                Step {currentTooltip} of {totalSteps}
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
                >
                  {currentTooltip < totalSteps ? 'Next' : 'Continue'}
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
    </div>
  );
}
