import { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MessageSquare, Zap, Sparkles, Heart, Briefcase, Smile, Send, Share2, Settings2, ChevronDown } from 'lucide-react';
import { KnowledgeBaseDialog } from '@/components/chatbot/KnowledgeBaseDialog';
import { ShareChatbotDialog } from '@/components/chatbot/ShareChatbotDialog';
import { MessageHandlingDialog } from '@/components/chatbot/MessageHandlingDialog';
import { FeedbackDialog } from '@/components/chatbot/FeedbackDialog';
const tones = [{
  id: 'warm',
  name: 'Warm',
  description: 'Friendly and welcoming',
  icon: Heart,
  example: "We'd love to see you there! The ceremony starts at 4 PM."
}, {
  id: 'formal',
  name: 'Formal',
  description: 'Polite and elegant',
  icon: Briefcase,
  example: "The ceremony will commence at 4:00 PM. We look forward to your presence."
}, {
  id: 'fun',
  name: 'Fun',
  description: 'Playful and casual',
  icon: Smile,
  example: "Party starts at 4! Can't wait to celebrate with you! 🎉"
}];
export default function Chatbot() {
  const [selectedTone, setSelectedTone] = useState('warm');
  const [chatbotName, setChatbotName] = useState('Concierge');
  const [replyMode, setReplyMode] = useState<'auto' | 'approval'>('auto');
  const [chatbotActive, setChatbotActive] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  const [shareChatbotOpen, setShareChatbotOpen] = useState(false);
  const [messageHandlingOpen, setMessageHandlingOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedMessageForFeedback, setSelectedMessageForFeedback] = useState('');
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [restrictedQuestionsOpen, setRestrictedQuestionsOpen] = useState(false);
  const [escalationCategoriesOpen, setEscalationCategoriesOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{
    role: 'user',
    content: 'What time is the wedding?',
    timestamp: '01:17 PM'
  }, {
    role: 'assistant',
    content: "We'd love to see you there! The ceremony starts at the scheduled time.",
    timestamp: '01:17 PM'
  }]);
  const [restrictedQuestions, setRestrictedQuestions] = useState(["How much did the wedding cost?", "Can I bring extra guests not on my RSVP?", "What are you serving for dinner?"]);
  const [escalationCategories, setEscalationCategories] = useState([{
    name: "Personal requests (gift questions, seating changes)",
    enabled: true
  }, {
    name: "Vendor information",
    enabled: true
  }, {
    name: "Plus-one modifications",
    enabled: true
  }, {
    name: "Dietary restrictions",
    enabled: false
  }, {
    name: "Budget or cost questions",
    enabled: true
  }]);
  const toneExamples = {
    warm: [{
      q: "Where can I park?",
      a: "We're so glad you're coming! There's free parking available at the venue. Just look for the lot on the north side - we'll have signs to guide you. Can't wait to see you there! 💕"
    }, {
      q: "What time is the ceremony?",
      a: "We'd love to see you there! The ceremony starts at 4 PM. We recommend arriving 15-20 minutes early to get settled in."
    }, {
      q: "Can I bring my kids?",
      a: "We totally understand! This is an adults-only celebration, so we ask that you arrange childcare for the little ones. We know it can be tricky, but we really appreciate your understanding!"
    }],
    formal: [{
      q: "Where can I park?",
      a: "Complimentary parking is available on the premises. Please utilize the designated parking area located on the north side of the venue. Attendants will be available to assist you upon arrival."
    }, {
      q: "What time is the ceremony?",
      a: "The ceremony will commence at 4:00 PM sharp. We kindly request that guests arrive by 3:45 PM to allow time for seating."
    }, {
      q: "Can I bring my kids?",
      a: "We respectfully request that this celebration be adults-only. We appreciate your understanding and hope you'll be able to arrange appropriate care for your children."
    }],
    fun: [{
      q: "Where can I park?",
      a: "Park your ride at the venue lot on the north side! It's free and easy. Just follow the signs and you'll be partying in no time! 🎉"
    }, {
      q: "What time is the ceremony?",
      a: "Party starts at 4! Grab your dancing shoes and show up around 3:45 so you don't miss the magic! ✨"
    }, {
      q: "Can I bring my kids?",
      a: "This one's for the grown-ups! Time to get a babysitter and let loose on the dance floor! We promise it'll be worth it! 🕺💃"
    }]
  };
  const quickTestQuestions = ["Where can I park?", "What time is the ceremony?", "Can I bring my kids?", "What's the dress code?", "Where should I stay?"];
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

    // Simulate AI response
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
    setTestMessage(question);
    const newUserMsg = {
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages(prev => [...prev, newUserMsg]);
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
  const handleShowExamples = (toneId: string) => {
    const examples = toneExamples[toneId as keyof typeof toneExamples];
    const newMessages: any[] = [];
    examples.forEach((ex, idx) => {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (examples.length - idx) * 2);
      const timestamp = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      newMessages.push({
        role: 'user',
        content: ex.q,
        timestamp
      });
      newMessages.push({
        role: 'assistant',
        content: ex.a,
        timestamp
      });
    });
    setChatMessages(newMessages);
  };
  return <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between" data-tour-id="chatbot-overview">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">AI Concierge Configuration</h1>
            <p className="text-muted-foreground">
              Customize how your AI concierge responds to guest questions
            </p>
          </div>
          <Button onClick={() => setShareChatbotOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Share2 className="w-4 h-4 mr-2" />
            Share Concierge
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Tone Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Response Tone</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {tones.map(tone => {
                const Icon = tone.icon;
                const isSelected = selectedTone === tone.id;
                return <Card key={tone.id} className={`p-4 cursor-pointer transition-all ${isSelected ? 'border-accent border-2 bg-accent/5' : 'hover:border-accent/50'}`} onClick={() => setSelectedTone(tone.id)}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent/20' : 'bg-muted'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{tone.name}</h3>
                          <p className="text-sm text-muted-foreground">{tone.description}</p>
                        </div>
                      </div>
                      <p className="text-sm italic text-muted-foreground pl-13 mb-3">
                        "{tone.example}"
                      </p>
                      <Button variant="outline" size="sm" className="w-full border-accent text-foreground hover:bg-accent/10" onClick={() => handleShowExamples(tone.id)}>
                        See Examples
                      </Button>
                    </Card>;
              })}
              </div>
            </div>

            {/* Concierge Name */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="chatbot-name">
              <h3 className="font-semibold mb-3">Concierge Name</h3>
              <Input value={chatbotName} onChange={e => setChatbotName(e.target.value)} placeholder="Enter concierge name" />
            </Card>

            {/* Reply Mode */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="message-handling">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Message Handling</h4>
                <Button variant="ghost" size="sm" onClick={() => setMessageHandlingOpen(true)}>
                  <Settings2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <RadioGroup value={replyMode} onValueChange={value => setReplyMode(value as 'auto' | 'approval')}>
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
                    <Label htmlFor="approval" className="font-medium cursor-pointer">Notify Me for Message Approval</Label>
                    <p className="text-sm text-muted-foreground">Review and approve messages before sending</p>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Do's & Don'ts */}
            <Card className="p-6 bg-white dark:bg-card">
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
                    {restrictedQuestions.map((question, idx) => <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <p className="text-sm">{question}</p>
                        <Button variant="ghost" size="sm" onClick={() => setRestrictedQuestions(prev => prev.filter((_, i) => i !== idx))}>
                          Remove
                        </Button>
                      </div>)}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                  const newQuestion = prompt("Enter a question to avoid:");
                  if (newQuestion) setRestrictedQuestions(prev => [...prev, newQuestion]);
                }}>
                    + Add Don't
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Escalation Categories */}
            <Card className="p-6 bg-white dark:bg-card">
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
                    {escalationCategories.map((category, idx) => <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <p className="text-sm flex-1">{category.name}</p>
                        <Switch checked={category.enabled} onCheckedChange={checked => {
                      setEscalationCategories(prev => prev.map((cat, i) => i === idx ? {
                        ...cat,
                        enabled: checked
                      } : cat));
                    }} />
                      </div>)}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => {
                  const newCategory = prompt("Enter a category to auto-escalate:");
                  if (newCategory) {
                    setEscalationCategories(prev => [...prev, {
                      name: newCategory,
                      enabled: true
                    }]);
                  }
                }}>
                    + Add Category
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Concierge Brain Card */}
            <Card className="p-6 bg-white dark:bg-card" data-tour-id="knowledge-base">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Concierge Brain</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#fcfbf8]" data-tour-id="wedding-details">
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

              <Button variant="outline" className="w-full mt-4" onClick={() => setKnowledgeBaseOpen(true)} data-tour-id="manage-faqs">
                Update Concierge Brain
              </Button>
            </Card>

            <Button className="w-full" size="lg">
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
                {chatMessages.map((msg, idx) => <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                      <div className={`rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center justify-between px-2">
                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                        {msg.role === 'assistant' && <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" onClick={() => {
                      setSelectedMessageForFeedback(msg.content);
                      setSelectedMessageIndex(idx);
                      setFeedbackDialogOpen(true);
                    }}>
                            Give Feedback
                          </Button>}
                      </div>
                    </div>
                  </div>)}
              </div>

              <div className="p-4 border-t bg-white dark:bg-muted/30 space-y-3">
                {/* Quick Test Questions */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Try asking these:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTestQuestions.map((question, idx) => <Button key={idx} variant="outline" size="sm" className="text-xs border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => handleQuickQuestion(question)}>
                        {question}
                      </Button>)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input value={testMessage} onChange={e => setTestMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendTest()} placeholder="Type a test question..." className="flex-1" />
                  <Button onClick={handleSendTest} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <KnowledgeBaseDialog open={knowledgeBaseOpen} onOpenChange={setKnowledgeBaseOpen} />
      <ShareChatbotDialog open={shareChatbotOpen} onOpenChange={setShareChatbotOpen} />
      <MessageHandlingDialog open={messageHandlingOpen} onOpenChange={setMessageHandlingOpen} />
      <FeedbackDialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen} messageContent={selectedMessageForFeedback} onApplyChanges={(newContent, tone) => {
      if (selectedMessageIndex !== null) {
        const updatedMessages = [...chatMessages];
        updatedMessages[selectedMessageIndex] = {
          ...updatedMessages[selectedMessageIndex],
          content: newContent
        };
        setChatMessages(updatedMessages);
      }
    }} />
    </div>;
}