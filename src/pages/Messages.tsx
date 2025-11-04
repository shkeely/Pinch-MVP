import { useState } from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import TopNav from '@/components/navigation/TopNav';
import { AIAssistButton } from '@/components/ai/AIAssistButton';
import GiveFeedbackDialog from '@/components/feedback/GiveFeedbackDialog';
import SendMessageDialog from '@/components/messages/SendMessageDialog';
interface Message {
  id: string;
  guestName: string;
  question: string;
  answer: string;
  timestamp: string;
  date: string;
  status: 'auto' | 'escalated' | 'risky';
  confidence?: string;
}
const mockMessages: Message[] = [{
  id: '1',
  guestName: 'Emily Thompson',
  question: 'What time does the ceremony start?',
  answer: 'The ceremony begins at 4:30 PM on Saturday, June 15th at The Grove Estate. We recommend arriving 15 minutes early.',
  timestamp: '2:30:00 PM',
  date: '5/10/2025',
  status: 'auto',
  confidence: '95% confident'
}, {
  id: '2',
  guestName: 'Michael Chen',
  question: 'Is there parking available at the venue?',
  answer: 'Yes, there is complimentary valet parking available at the venue entrance.',
  timestamp: '1:45:00 PM',
  date: '5/10/2025',
  status: 'auto',
  confidence: '92% confident'
}, {
  id: '3',
  guestName: 'Jessica Martinez',
  question: 'Can I bring my kids?',
  answer: 'We love your little ones, but we have planned an adults-only celebration. We hope you understand!',
  timestamp: '11:20:00 AM',
  date: '5/11/2025',
  status: 'auto',
  confidence: '88% confident'
}, {
  id: '4',
  guestName: 'David Park',
  question: 'I might need to cancel - what should I do?',
  answer: '',
  timestamp: '9:15:00 AM',
  date: '5/11/2025',
  status: 'escalated'
}];
export default function Messages() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'auto' | 'escalated' | 'risky'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message>(mockMessages[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draftResponse, setDraftResponse] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const segments = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  
  const filteredMessages = mockMessages.filter(msg => {
    const matchesFilter = activeFilter === 'all' || msg.status === activeFilter;
    const matchesSearch = msg.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || msg.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground text-base">
              Guest conversations & AI responses
            </p>
          </div>
          <Button 
            className="rounded-full px-6 text-white bg-indigo-400 hover:bg-indigo-300"
            onClick={() => setIsSendMessageDialogOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message to Guests
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-[#ccc1dd] text-foreground' : 'bg-white border border-border text-foreground hover:bg-muted/50'}`}>
            All
          </button>
          <button onClick={() => setActiveFilter('auto')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'auto' ? 'bg-[#ccc1dd] text-foreground' : 'bg-white border border-border text-foreground hover:bg-muted/50'}`}>
            Auto
          </button>
          <button onClick={() => setActiveFilter('escalated')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'escalated' ? 'bg-[#ccc1dd] text-foreground' : 'bg-white border border-border text-foreground hover:bg-muted/50'}`}>
            Escalated
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Panel - Conversation List */}
          <Card className="p-5 bg-card border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] h-fit lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-background border-border rounded-full" />
            </div>

            {/* Conversation List */}
            <div className="space-y-3">
              {filteredMessages.map(msg => <button key={msg.id} onClick={() => setSelectedMessage(msg)} className={`w-full text-left p-4 rounded-2xl transition-colors border ${selectedMessage.id === msg.id ? 'bg-muted/50 border-border' : 'bg-white border-border hover:bg-muted/30'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-foreground">{msg.guestName}</p>
                    <Badge variant={msg.status === 'escalated' ? 'destructive' : 'secondary'} className={`text-xs rounded-full px-2.5 py-0.5 ${msg.status === 'auto' ? 'bg-[#c8deb9] text-foreground' : 'text-destructive-foreground bg-red-500'}`}>
                      {msg.status === 'auto' ? 'Auto' : 'Escalated'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                    {msg.question}
                  </p>
                  <p className="text-xs text-muted-foreground">{msg.date}</p>
                </button>)}
            </div>
          </Card>

          {/* Right Panel - Conversation Detail */}
          <Card className="p-6 bg-card border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-1">
                  {selectedMessage.guestName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedMessage.date}, {selectedMessage.timestamp}
                </p>
              </div>
              <Badge variant={selectedMessage.status === 'escalated' ? 'destructive' : 'secondary'} className={`text-xs rounded-full px-3 py-1 ${selectedMessage.status === 'auto' ? 'bg-[#c8deb9] text-foreground' : 'text-destructive-foreground bg-red-500'}`}>
                {selectedMessage.status === 'auto' ? 'Auto' : 'Escalated'}
              </Badge>
            </div>

            <Separator className="mb-6" />

            {/* Messages */}
            <div className="space-y-4 mb-6 flex-1">
              {/* Guest Question - Left aligned */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-5 bg-muted/50">
                  <p className="font-semibold text-foreground mb-2">
                    {selectedMessage.question}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.timestamp}
                  </p>
                </div>
              </div>

              {/* AI Response - Right aligned */}
              {selectedMessage.answer && <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl p-5 bg-[#e8f5e9]">
                    <p className="text-foreground mb-3 leading-relaxed">
                      {selectedMessage.answer}
                    </p>
                    {selectedMessage.confidence && <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/60 text-xs">
                          AI Response
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          • {selectedMessage.confidence}
                        </span>
                      </div>}
                  </div>
                </div>}

              {/* No Response Yet */}
              {!selectedMessage.answer && <div className="bg-muted/30 rounded-2xl p-5 border border-dashed border-border">
                  <p className="text-muted-foreground text-center">
                    This message needs your attention. Draft a response below.
                  </p>
                </div>}
            </div>

            {/* Draft Response */}
            {!selectedMessage.answer && <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Draft Response</h3>
                  <AIAssistButton 
                    currentText={draftResponse}
                    onAIGenerate={setDraftResponse}
                    context={`in response to: "${selectedMessage.question}"`}
                  />
                </div>
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Type your response..." 
                    value={draftResponse}
                    onChange={(e) => setDraftResponse(e.target.value)}
                    className="min-h-[120px] border-border" 
                  />
                  <div className="flex justify-end">
                    <Button className="rounded-full px-6 gap-2" style={{
                      backgroundColor: '#5b6850',
                      color: 'white'
                    }}>
                      <Send className="w-4 h-4" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>}

            {/* Bottom Section */}
            <div className="mt-auto">
              <Separator className="mb-6" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 gap-2 hover:bg-muted/50"
                  onClick={() => setIsFeedbackDialogOpen(true)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Give Feedback
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <GiveFeedbackDialog 
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
        messageContext={selectedMessage.question}
      />

      <SendMessageDialog
        open={isSendMessageDialogOpen}
        onOpenChange={setIsSendMessageDialogOpen}
        segments={segments}
      />
    </div>;
}