import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Check, Info } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWedding } from '@/contexts/WeddingContext';
import { mockAIResponse } from '@/lib/mockAI';
import { SimulatedMessage } from '@/types/wedding';
import { cn } from '@/lib/utils';
export default function Step4() {
  const navigate = useNavigate();
  const {
    wedding,
    conversations,
    addConversation,
    updateWedding
  } = useWedding();
  const [message, setMessage] = useState('');

  const suggestions = [
    "What time does it start?",
    "Where is the venue?",
    "What should I wear?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };
  const handleSendMessage = () => {
    if (!message.trim()) return;
    const guestMessage: SimulatedMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      guestMessage: message,
      botResponse: '',
      confidence: 'high',
      source: null,
      isGuest: true
    };
    addConversation(guestMessage);

    // Generate AI response
    const aiResponse = mockAIResponse(message, wedding);
    setTimeout(() => {
      const botMessage: SimulatedMessage = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        guestMessage: message,
        botResponse: aiResponse.text,
        confidence: aiResponse.confidence,
        source: aiResponse.source,
        isGuest: false
      };
      addConversation(botMessage);
    }, 500);
    setMessage('');
  };
  const handleComplete = () => {
    updateWedding({
      onboardingStep: 5,
      tourMode: true,
      canGoBack: true
    });
    navigate('/onboarding/step-5');
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  return <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <OnboardingStepper currentStep={4} />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Test Your Guest Concierge
          </h1>
          <p className="text-lg text-muted-foreground">
            Try asking questions as a guest would. Your AI concierge is ready!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* SMS Simulator */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold">Guest Concierge</h2>
              <Badge variant="outline" className="bg-mint/20 text-mint-foreground border-mint/30">
                Simulation Mode
              </Badge>
            </div>

            <Alert className="mb-4 bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900">
                Right now, Pinch can answer basic questions about timing, location, and dress code. After setup, you'll add more to your Chatbot Brain to expand what Pinch can handle automatically.
              </AlertDescription>
            </Alert>

            <ScrollArea className="h-96 mb-4 border border-border-subtle rounded-lg p-4">
              {conversations.length === 0 ? <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>Start a conversation by asking a question below</p>
                </div> : <div className="space-y-4">
                  {conversations.map(conv => <div key={conv.id} className={cn("flex", conv.isGuest ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-2xl px-4 py-2", conv.isGuest ? "bg-accent text-accent-foreground" : "bg-card border")}>
                        <p className="text-sm">
                          {conv.isGuest ? conv.guestMessage : conv.botResponse}
                        </p>
                        {!conv.isGuest && <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {conv.confidence}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conv.botResponse.length} chars
                            </span>
                          </div>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(conv.timestamp)}
                        </p>
                      </div>
                    </div>)}
                </div>}
            </ScrollArea>

            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Try asking these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a guest question..." className="flex-1" />
              <Button onClick={handleSendMessage} disabled={!message.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Conversation History */}
          <Card className="p-6">
            <h2 className="text-xl font-serif font-semibold mb-4">Conversation History</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Review all simulated guest interactions
            </p>

            <ScrollArea className="h-96">
              {conversations.filter(c => !c.isGuest).length === 0 ? <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>No conversations yet</p>
                </div> : <div className="space-y-4">
                  {conversations.filter(c => !c.isGuest).map(conv => <div key={conv.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Guest</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{conv.guestMessage}</p>

                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                              Pinch
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conv.botResponse.length} chars
                            </span>
                          </div>
                          <p className="text-sm">{conv.botResponse}</p>
                        </div>
                      </div>)}
                </div>}
            </ScrollArea>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button size="lg" onClick={handleComplete} className="rounded-xl h-11 px-8 font-medium [&:not(:disabled)]:hover:!bg-accent" style={{
            backgroundColor: '#5b6850',
            color: 'white'
          }}>
            <Check className="w-5 h-5 mr-2" />
            Complete Setup & View Dashboard
          </Button>
        </div>
      </div>
    </div>;
}