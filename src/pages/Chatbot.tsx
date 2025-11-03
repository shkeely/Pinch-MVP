import { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Zap, Sparkles, Heart, Briefcase, Smile, Send } from 'lucide-react';

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

export default function Chatbot() {
  const [selectedTone, setSelectedTone] = useState('warm');
  const [chatbotName, setChatbotName] = useState('Wedding Assistant');
  const [autoReply, setAutoReply] = useState(true);
  const [chatbotActive, setChatbotActive] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'user', content: 'What time is the wedding?', timestamp: '01:17 PM' },
    { role: 'assistant', content: "We'd love to see you there! The ceremony starts at the scheduled time.", timestamp: '01:17 PM' }
  ]);

  const handleSendTest = () => {
    if (!testMessage.trim()) return;
    
    const newUserMsg = { role: 'user', content: testMessage, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newUserMsg]);
    setTestMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const response = tones.find(t => t.id === selectedTone)?.example || "Thank you for your message!";
      const aiMsg = { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">AI Chatbot</h1>
          <p className="text-muted-foreground">
            Configure your AI wedding concierge
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Chatbot Status</h3>
                    <p className="text-sm text-muted-foreground">Your AI concierge is {chatbotActive ? 'active' : 'inactive'}</p>
                  </div>
                </div>
                <Switch checked={chatbotActive} onCheckedChange={setChatbotActive} />
              </div>
            </Card>

            {/* Tone Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Response Tone</h2>
              <div className="grid gap-4">
                {tones.map((tone) => {
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
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Chatbot Name */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Chatbot Name</h3>
              <Input
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
              />
            </Card>

            {/* Auto-Reply */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Auto-Reply</h4>
                  <p className="text-sm text-muted-foreground">Respond to messages automatically</p>
                </div>
                <Switch checked={autoReply} onCheckedChange={setAutoReply} />
              </div>
            </Card>

            {/* Knowledge Base Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Knowledge Base</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Wedding Details</p>
                      <p className="text-sm text-muted-foreground">Location, timing, dress code</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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

              <Button variant="outline" className="w-full mt-4">
                Update Knowledge Base
              </Button>
            </Card>

            <Button className="w-full" size="lg">
              Save Changes
            </Button>
          </div>

          {/* Right Column - Chat Simulation */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="overflow-hidden bg-card border-border">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{chatbotName}</h2>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  Simulation Mode
                </Badge>
              </div>

              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-background">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'space-y-2'}`}>
                      <div className={`rounded-2xl p-4 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground px-2">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTest()}
                    placeholder="Type a test question..."
                    className="flex-1"
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
    </div>
  );
}
