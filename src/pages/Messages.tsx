import { useState } from 'react';
import { Search, Send, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TopNav from '@/components/navigation/TopNav';
import SendMessageDialog from '@/components/messages/SendMessageDialog';
import { useWedding } from '@/contexts/WeddingContext';

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

// Messages is a Phase 3 feature - show placeholder for now
export default function Messages() {
  const { weddingId } = useWedding();
  const [activeFilter, setActiveFilter] = useState<'all' | 'auto' | 'escalated' | 'risky'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const segments = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  
  // Empty state - no messages until Phase 3 SMS integration
  const messages: Message[] = [];
  
  const filteredMessages = messages.filter(msg => {
    const matchesFilter = activeFilter === 'all' || msg.status === activeFilter;
    const matchesSearch = msg.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || msg.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
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

            {/* Conversation List or Empty State */}
            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Guest conversations will appear here once they start texting your wedding number.
                  </p>
                </div>
              ) : (
                filteredMessages.map(msg => (
                  <button key={msg.id} className="w-full text-left p-4 rounded-2xl transition-colors border bg-white border-border hover:bg-muted/30">
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
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Right Panel - Placeholder */}
          <Card className="p-6 bg-card border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col min-h-[400px]">
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No conversation selected</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                When guests text your wedding number, their conversations will appear here. 
                You'll be able to review AI responses and send follow-up messages.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <SendMessageDialog
        open={isSendMessageDialogOpen}
        onOpenChange={setIsSendMessageDialogOpen}
        segments={segments}
      />
    </div>
  );
}