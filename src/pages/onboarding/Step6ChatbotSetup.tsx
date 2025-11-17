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
import { KnowledgeBaseDialog } from '@/components/chatbot/KnowledgeBaseDialog';

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
  const [currentTooltip, setCurrentTooltip] = useState<number | string>(1);
  const [highlightRect, setHighlightRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();
  const totalSteps = 9;
  const [categoryExpanded, setCategoryExpanded] = useState(false);

  // State for chatbot page
  const [selectedTone, setSelectedTone] = useState('warm');
  const [chatbotName, setChatbotName] = useState('Concierge');
  const [replyMode, setReplyMode] = useState<'auto' | 'approval'>('auto');
  const [chatbotActive, setChatbotActive] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [restrictedQuestionsOpen, setRestrictedQuestionsOpen] = useState(false);
  const [escalationCategoriesOpen, setEscalationCategoriesOpen] = useState(false);
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
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
      const stepTargets: Record<number | string, string> = {
        1: 'response-tone',
        2: 'chatbot-name',
        3: 'message-handling',
        4: 'restricted-questions',
        5: 'escalation-categories',
        6: 'chatbot-brain',
        '7a': 'update-brain-button',
        '7b': 'edit-category-button',
        '7c': 'web-scraper',
        '7d': 'knowledge-items',
        '7e': 'add-category-button',
        8: 'chat-simulation',
        9: 'chatbot-status',
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

    // Initial update with delay to allow for dialog rendering
    const timeoutId = setTimeout(updateRect, 400);
    updateRect();
    
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentTooltip, knowledgeBaseOpen]);

  // Watch for dialog opening to advance from 7a to 7b
  useEffect(() => {
    if (knowledgeBaseOpen && currentTooltip === '7a') {
      setTimeout(() => setCurrentTooltip('7b'), 500);
    }
  }, [knowledgeBaseOpen, currentTooltip]);

  // Watch for category edit to advance from 7b to 7c
  useEffect(() => {
    if (categoryExpanded && currentTooltip === '7b') {
      setTimeout(() => setCurrentTooltip('7c'), 300);
    }
  }, [categoryExpanded, currentTooltip]);

  const handleNext = () => {
    // Define step sequence including sub-steps
    const stepSequence: (number | string)[] = [1, 2, 3, 4, 5, 6, '7a', '7d', '7b', '7c', '7e', 8, 9];
    const currentIndex = stepSequence.indexOf(currentTooltip);
    
    // Prevent auto-advance for steps that require user interaction
    if (currentTooltip === '7a') {
      // User must click "Update Chatbot Brain" button
      return;
    }
    if (currentTooltip === '7b') {
      // User must click "Edit" on a category
      return;
    }
    
    // Close dialog before advancing to step 8
    if (currentTooltip === '7e') {
      setKnowledgeBaseOpen(false);
      setTimeout(() => {
        setCurrentTooltip(8);
      }, 300);
      return;
    }
    
    // Explicit handling for step 8 → 9
    if (currentTooltip === 8) {
      setCurrentTooltip(9);
      return;
    }
    
    // Explicit handling for step 9 → navigate to next page
    if (currentTooltip === 9) {
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
      return;
    }
    
    // Default handling for other steps
    if (currentIndex >= 0 && currentIndex < stepSequence.length - 1) {
      setCurrentTooltip(stepSequence[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    // Define step sequence including sub-steps
    const stepSequence: (number | string)[] = [1, 2, 3, 4, 5, 6, '7a', '7d', '7b', '7c', '7e', 8, 9];
    const currentIndex = stepSequence.indexOf(currentTooltip);
    
    if (currentIndex > 0) {
      setCurrentTooltip(stepSequence[currentIndex - 1]);
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

  const tooltipContent: Record<number | string, { title: string; description: string; position: 'below' | 'right' | 'left' | 'top' | 'bottom' }> = {
    1: {
      title: "You Already Chose Your Tone!",
      description: "You selected your tone earlier in setup. Want to change it? Select a different option and see how it affects responses!",
      position: 'below' as const
    },
    2: {
      title: "Name Your Assistant",
      description: "Give your chatbot a name! Guests see this when they text. 'Wedding Assistant' works great, or get creative!",
      position: 'right' as const
    },
    3: {
      title: "Auto-Reply or Approve First?",
      description: "Auto-Reply sends responses instantly. Choose 'Notify Me' if you want to review messages before they go to guests.",
      position: 'right' as const
    },
    4: {
      title: "Set Question Boundaries",
      description: "Tell Pinch what questions to avoid answering. Add topics like budget questions or anything you'd rather handle personally.",
      position: 'right' as const
    },
    5: {
      title: "Auto-Escalate Topics",
      description: "These question types will automatically be sent to you instead of auto-answered. Toggle categories on/off as needed.",
      position: 'right' as const
    },
    6: {
      title: "Your Concierge Brain",
      description: "This is Pinch's brain! Let's explore how to add and organize your wedding information.",
      position: 'right' as const
    },
    '7a': {
      title: "Open Concierge Brain",
      description: "Click 'Update Concierge Brain' to open the editor where you can manage all your wedding information.",
      position: 'right' as const
    },
    '7b': {
      title: "Edit a Category",
      description: "Each category (like Venue, Timing, Dress Code) holds related information. Click 'Edit' on any category to view and modify the knowledge items inside.",
      position: 'top' as const
    },
    '7c': {
      title: "Web Scraper",
      description: "Already have a wedding website? Use the web scraper to automatically pull information and populate your concierge brain. Just paste your URL!",
      position: 'top' as const
    },
    '7d': {
      title: "Knowledge Items",
      description: "These are the individual facts Pinch uses to answer questions. You can add, edit, or delete items to keep information accurate and up-to-date.",
      position: 'right' as const
    },
    '7e': {
      title: "Add Custom Categories",
      description: "Need a category we don't have? Click 'Add Category' to create custom ones like 'Hotel Blocks', 'Gift Registry', or 'Wedding Party Bios'.",
      position: 'bottom' as const
    },
    8: {
      title: "Test Your Concierge!",
      description: "Click quick question buttons or type your own. See how Pinch responds based on your settings and info!",
      position: 'left' as const
    },
    9: {
      title: "Activate When Ready",
      description: "When you're happy with responses, toggle this to Active and your concierge will start answering real guest texts!",
      position: 'left' as const
    }
  };

  const current = tooltipContent[currentTooltip];
  
  // Helper function to get display step number
  const getDisplayStep = (step: number | string): number => {
    if (typeof step === 'string' && step.startsWith('7')) return 7;
    return typeof step === 'number' ? step : parseInt(step);
  };

  return (
    <div className="min-h-screen bg-background">
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
            <div data-tour-id="response-tone">
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

            {/* Topics to Avoid */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="restricted-questions">
              <Collapsible open={restrictedQuestionsOpen} onOpenChange={setRestrictedQuestionsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full cursor-pointer">
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Topics to Avoid</h3>
                    <p className="text-sm text-muted-foreground">Set boundaries for what Pinch shouldn't answer</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${restrictedQuestionsOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="space-y-2 mb-4">
                    {restrictedQuestions.map((question, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted">
                        <p className="text-sm">{question}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" disabled>+ Add Don't</Button>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Escalation Categories */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="escalation-categories">
              <Collapsible open={escalationCategoriesOpen} onOpenChange={setEscalationCategoriesOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full cursor-pointer">
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">Auto-Escalate</h3>
                    <p className="text-sm text-muted-foreground">Questions in these categories will automatically be sent to you for review</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${escalationCategoriesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="space-y-3">
                    {escalationCategories.map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <p className="text-sm flex-1">{category.name}</p>
                        <Switch checked={category.enabled} disabled />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" disabled>
                    + Add Category
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Concierge Brain Card */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="chatbot-brain">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Concierge Brain</h2>
              </div>

              <div className="space-y-4" data-tour-id="chatbot-brain-categories">
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
                data-tour-id="update-brain-button"
                onClick={() => setKnowledgeBaseOpen(true)}
              >
                Update Concierge Brain
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
      {highlightRect && (() => {
        const isInDialog = ['7b', '7c', '7d', '7e'].includes(String(currentTooltip));
        const highlightZIndex = isInDialog ? 'z-[90]' : 'z-50';
        
        return (
          <div
            className={`fixed pointer-events-none transition-all duration-500 rounded-lg animate-pulse ${highlightZIndex}`}
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
        );
      })()}

      {/* Centered tooltip */}
      {(() => {
        const isInDialog = ['7b', '7c', '7d', '7e'].includes(String(currentTooltip));
        const tooltipZIndex = isInDialog ? 'z-[100]' : 'z-50';
        
        return (
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${tooltipZIndex} pointer-events-none`}>
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
                Step {getDisplayStep(currentTooltip)} of {totalSteps}
              </div>
              <div className="flex gap-2">
                {(() => {
                  const stepSequence: (number | string)[] = [1, 2, 3, 4, 5, 6, '7a', '7b', '7c', '7d', '7e', 8, 9];
                  const currentIndex = stepSequence.indexOf(currentTooltip);
                  return currentIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Previous
                    </button>
                  );
                })()}
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {(() => {
                    const stepSequence: (number | string)[] = [1, 2, 3, 4, 5, 6, '7a', '7b', '7c', '7d', '7e', 8, 9];
                    const currentIndex = stepSequence.indexOf(currentTooltip);
                    return currentIndex < stepSequence.length - 1 ? 'Next' : 'Continue';
                  })()}
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
        );
      })()}

      {/* Knowledge Source Dialog */}
      <KnowledgeBaseDialog
        open={knowledgeBaseOpen} 
        onOpenChange={(open) => {
          // Keep dialog open during tour steps 7b-7e
          const isInDialogTour = ['7b', '7c', '7d', '7e'].includes(String(currentTooltip));
          if (!isInDialogTour || open) {
            setKnowledgeBaseOpen(open);
          }
        }}
        inTourMode={['7b', '7c', '7d', '7e'].includes(String(currentTooltip))}
        onCategoryEdit={() => setCategoryExpanded(true)}
      />

      {/* Tour Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4 px-6 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentTooltip === 1}
            className="min-w-[140px]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </Button>

          {/* Center: Tour Progress */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Tour 2 of 7</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === 2 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/onboarding/step-10-homepage')}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tour
            </Button>
          </div>

          {/* Next Button */}
          <Button
            size="lg"
            onClick={handleNext}
            className="min-w-[140px]"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
