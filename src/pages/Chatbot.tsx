import { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Zap, Sparkles, Heart, Briefcase, Smile, Send, Share2, Settings2 } from 'lucide-react';
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
  const [chatbotName, setChatbotName] = useState('Wedding Assistant');
  const [replyMode, setReplyMode] = useState<'auto' | 'approval'>('auto');
  const [chatbotActive, setChatbotActive] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  const [shareChatbotOpen, setShareChatbotOpen] = useState(false);
  const [messageHandlingOpen, setMessageHandlingOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedMessageForFeedback, setSelectedMessageForFeedback] = useState('');
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState([{
    role: 'user',
    content: 'What time is the wedding?',
    timestamp: '01:17 PM'
  }, {
    role: 'assistant',
    content: "We'd love to see you there! The ceremony starts at the scheduled time.",
    timestamp: '01:17 PM'
  }]);
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
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">AI Chatbot</h1>
            <p className="text-muted-foreground">
              Configure your AI wedding concierge
            </p>
          </div>
          <Button 
            onClick={() => setShareChatbotOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Chatbot Link
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
                      <p className="text-sm italic text-muted-foreground pl-13">
                        "{tone.example}"
                      </p>
                    </Card>;
              })}
              </div>
            </div>

            {/* Chatbot Name */}
            <Card className="p-6 bg-[#f7f5f3]">
              <h3 className="font-semibold mb-3">Chatbot Name</h3>
              <Input value={chatbotName} onChange={e => setChatbotName(e.target.value)} placeholder="Enter chatbot name" />
            </Card>

            {/* Reply Mode */}
            <Card className="p-6 bg-[#f7f5f3]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Message Handling</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessageHandlingOpen(true)}
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <RadioGroup value={replyMode} onValueChange={(value) => setReplyMode(value as 'auto' | 'approval')}>
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

            {/* Knowledge Base Card */}
            <Card className="p-6 bg-[#f7f5f3]">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Knowledge Base</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#fcfbf8]">
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
                onClick={() => setKnowledgeBaseOpen(true)}
              >
                Update Knowledge Base
              </Button>
            </Card>

            <Button className="w-full" size="lg">
              Save Changes
            </Button>
          </div>

          {/* Right Column - Chat Simulation */}
          <div className="lg:sticky lg:top-8 h-fit space-y-4">
            {/* Status Card */}
            <Card className="p-4">
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

            <Card className="overflow-hidden bg-card border-border">
              <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{chatbotName}</h2>
                <Badge variant="secondary" className="bg-purple-600 text-white font-semibold px-4 py-1.5 text-sm">
                  🎭 Simulation Mode
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
                        {msg.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs"
                            onClick={() => {
                              setSelectedMessageForFeedback(msg.content);
                              setSelectedMessageIndex(idx);
                              setFeedbackDialogOpen(true);
                            }}
                          >
                            Give Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>)}
              </div>

              <div className="p-4 border-t bg-muted/30">
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
      <KnowledgeBaseDialog 
        open={knowledgeBaseOpen} 
        onOpenChange={setKnowledgeBaseOpen}
      />
      <ShareChatbotDialog
        open={shareChatbotOpen}
        onOpenChange={setShareChatbotOpen}
      />
      <MessageHandlingDialog
        open={messageHandlingOpen}
        onOpenChange={setMessageHandlingOpen}
      />
      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        messageContent={selectedMessageForFeedback}
        onApplyChanges={(newContent, tone) => {
          if (selectedMessageIndex !== null) {
            const updatedMessages = [...chatMessages];
            updatedMessages[selectedMessageIndex] = {
              ...updatedMessages[selectedMessageIndex],
              content: newContent
            };
            setChatMessages(updatedMessages);
          }
        }}
      />
    </div>
  );
}